import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRequestStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { BookingRequestQueryDto } from './dto/booking-request-query.dto';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { UpdateBookingRequestDto } from './dto/update-booking-request.dto';
import { expandRecurrence, singleSession } from './schedule';

/**
 * A coach accepting a package commits to every session in it, unpaid, up front.
 * The mobile form would otherwise allow 12 weeks x 7 days = 84.
 */
const MAX_SESSIONS = 24;

const REQUEST_INCLUDE = {
  sessions: { orderBy: { scheduledAt: 'asc' } },
  sport: true,
  athlete: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      role: true,
    },
  },
  coach: {
    select: {
      id: true,
      venue: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
  },
} satisfies Prisma.BookingRequestInclude;

type RequestWithRelations = Prisma.BookingRequestGetPayload<{
  include: typeof REQUEST_INCLUDE;
}>;

/**
 * EXPIRED is derived rather than stored, which avoids a scheduler for the MVP.
 * A pending request lapses once its first session is in the past: the schedule
 * the athlete proposed can no longer be honoured as submitted, even if later
 * sessions in a package are still ahead.
 */
function effectiveStatus(request: RequestWithRelations): BookingRequestStatus {
  if (request.status !== BookingRequestStatus.PENDING) {
    return request.status;
  }
  const first = request.sessions[0];
  return first && first.scheduledAt.getTime() < Date.now()
    ? BookingRequestStatus.EXPIRED
    : BookingRequestStatus.PENDING;
}

function toResponse(request: RequestWithRelations) {
  const { athlete, coach, sessions, sport, ...rest } = request;
  return {
    ...rest,
    status: effectiveStatus(request),
    sport,
    sessions: sessions.map((s) => ({ id: s.id, scheduledAt: s.scheduledAt })),
    athlete: {
      id: athlete.id,
      firstName: athlete.firstName,
      lastName: athlete.lastName,
      profileImage: athlete.profileImage,
      bookedForChild: athlete.role === 'PARENT',
    },
    coach: {
      id: coach.id,
      userId: coach.user.id,
      firstName: coach.user.firstName,
      lastName: coach.user.lastName,
      profileImage: coach.user.profileImage,
      venue: coach.venue,
    },
  };
}

@Injectable()
export class BookingRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingRequestDto) {
    // The JWT's role can be stale — creating a coach profile promotes the
    // account — so the child-details rule reads the role from the database.
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const coach = await this.prisma.coachProfile.findUnique({
      where: { id: dto.coachId },
      include: { sports: true },
    });
    if (!coach || !coach.isActive || coach.verificationStatus !== 'APPROVED') {
      // Same response whether the coach is missing or merely unapproved, so
      // this can't be used to enumerate pending profiles.
      throw new NotFoundException('Coach not found.');
    }
    if (coach.userId === userId) {
      throw new BadRequestException(
        'You cannot request a session with yourself.',
      );
    }
    if (!coach.sports.some((s) => s.sportId === dto.sportId)) {
      throw new BadRequestException('This coach does not offer that sport.');
    }

    const scheduledAts = this.buildSchedule(dto);

    if (scheduledAts.length > MAX_SESSIONS) {
      throw new BadRequestException(
        `A request cannot exceed ${MAX_SESSIONS} sessions (this one has ${scheduledAts.length}).`,
      );
    }
    if (scheduledAts[0].getTime() <= Date.now()) {
      throw new BadRequestException(
        'Sessions must be scheduled in the future.',
      );
    }

    if (user.role === 'PARENT') {
      if (!dto.childName || dto.childAge === undefined) {
        throw new BadRequestException(
          'Child name and age are required when booking as a parent.',
        );
      }
    } else if (dto.childName || dto.childAge !== undefined) {
      throw new BadRequestException(
        'Only parent accounts can supply child details.',
      );
    }

    await this.assertNoConflicts(dto.coachId, scheduledAts);

    const request = await this.prisma.bookingRequest.create({
      data: {
        athleteId: userId,
        coachId: dto.coachId,
        sportId: dto.sportId,
        mode: dto.mode,
        weeks: dto.mode === 'PACKAGE' ? dto.weeks : null,
        daysOfWeek: dto.mode === 'PACKAGE' ? dto.daysOfWeek! : [],
        startTime: dto.startTime,
        sessionRate: coach.sessionRate,
        sessionCount: scheduledAts.length,
        totalAmount: coach.sessionRate * scheduledAts.length,
        notes: dto.notes ?? null,
        childName: dto.childName ?? null,
        childAge: dto.childAge ?? null,
        sessions: {
          create: scheduledAts.map((scheduledAt) => ({ scheduledAt })),
        },
      },
      include: REQUEST_INCLUDE,
    });

    return toResponse(request);
  }

  async list(userId: string, query: BookingRequestQueryDto) {
    const coachProfile = await this.prisma.coachProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    // A coach sees the requests sent to them; everyone else sees their own.
    const scope = coachProfile
      ? { coachId: coachProfile.id }
      : { athleteId: userId };

    const requests = await this.prisma.bookingRequest.findMany({
      where: { ...scope, ...(query.status ? { status: query.status } : {}) },
      include: REQUEST_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    return requests.map(toResponse);
  }

  async getById(id: string, userId: string) {
    const request = await this.findParticipating(id, userId);
    return toResponse(request);
  }

  async update(id: string, userId: string, dto: UpdateBookingRequestDto) {
    const request = await this.findParticipating(id, userId);

    const current = effectiveStatus(request);
    if (current !== BookingRequestStatus.PENDING) {
      throw new ConflictException(
        `This request is ${current.toLowerCase()} and can no longer be changed.`,
      );
    }

    const isCoach = request.coach.user.id === userId;
    const isCancel = dto.status === BookingRequestStatus.CANCELLED;

    if (isCancel && isCoach) {
      throw new ForbiddenException(
        'Decline the request instead of cancelling it.',
      );
    }
    if (!isCancel && !isCoach) {
      throw new ForbiddenException(
        'Only the coach can accept or decline a request.',
      );
    }

    // Two coaches can hold pending requests for the same slot; the first to
    // accept takes it. Re-check here rather than trusting the create-time pass.
    if (dto.status === BookingRequestStatus.ACCEPTED) {
      await this.assertNoConflicts(
        request.coachId,
        request.sessions.map((s) => s.scheduledAt),
        request.id,
      );
    }

    const updated = await this.prisma.bookingRequest.update({
      where: { id },
      data: {
        status: dto.status,
        respondedAt: isCancel ? null : new Date(),
      },
      include: REQUEST_INCLUDE,
    });

    return toResponse(updated);
  }

  private buildSchedule(dto: CreateBookingRequestDto): Date[] {
    if (dto.mode === 'SINGLE') {
      if (dto.weeks !== undefined || dto.daysOfWeek !== undefined) {
        throw new BadRequestException(
          'weeks and daysOfWeek apply to package requests only.',
        );
      }
      return singleSession(dto.startDate, dto.startTime);
    }

    if (dto.weeks === undefined || !dto.daysOfWeek?.length) {
      throw new BadRequestException(
        'A package request needs weeks and at least one day of the week.',
      );
    }
    return expandRecurrence({
      startDate: dto.startDate,
      startTime: dto.startTime,
      weeks: dto.weeks,
      daysOfWeek: dto.daysOfWeek,
    });
  }

  /** Rejects slots the coach has already committed to on an accepted request. */
  private async assertNoConflicts(
    coachId: string,
    scheduledAts: Date[],
    exceptRequestId?: string,
  ) {
    const clash = await this.prisma.bookingRequestSession.findFirst({
      where: {
        scheduledAt: { in: scheduledAts },
        request: {
          coachId,
          status: BookingRequestStatus.ACCEPTED,
          ...(exceptRequestId ? { id: { not: exceptRequestId } } : {}),
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    if (clash) {
      throw new ConflictException(
        `The coach is already booked at ${clash.scheduledAt.toISOString()}.`,
      );
    }
  }

  private async findParticipating(id: string, userId: string) {
    const request = await this.prisma.bookingRequest.findUnique({
      where: { id },
      include: REQUEST_INCLUDE,
    });
    if (!request) {
      throw new NotFoundException('Booking request not found.');
    }
    if (request.athleteId !== userId && request.coach.user.id !== userId) {
      throw new ForbiddenException('This booking request is not yours.');
    }
    return request;
  }
}
