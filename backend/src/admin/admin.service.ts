import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, VerificationStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { AdminCoachQueryDto } from './dto/admin-coach-query.dto';
import { ReviewCoachDto } from './dto/review-coach.dto';

const REVIEW_INCLUDE = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
    },
  },
  sports: { include: { sport: true } },
  reviewedBy: { select: { id: true, firstName: true, lastName: true } },
} satisfies Prisma.CoachProfileInclude;

type CoachForReview = Prisma.CoachProfileGetPayload<{
  include: typeof REVIEW_INCLUDE;
}>;

function toReviewResponse(coach: CoachForReview) {
  const { user, sports, reviewedBy, ...profile } = coach;
  return {
    ...profile,
    sports: sports.map((s) => s.sport),
    user,
    reviewedBy,
  };
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listCoaches(query: AdminCoachQueryDto) {
    const coaches = await this.prisma.coachProfile.findMany({
      where: { verificationStatus: query.status ?? VerificationStatus.PENDING },
      include: REVIEW_INCLUDE,
      // Oldest first: the coach who has been waiting longest gets seen first.
      orderBy: { createdAt: 'asc' },
    });
    return coaches.map(toReviewResponse);
  }

  async counts() {
    const grouped = await this.prisma.coachProfile.groupBy({
      by: ['verificationStatus'],
      _count: { _all: true },
    });
    const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
    for (const row of grouped) {
      counts[row.verificationStatus] = row._count._all;
    }
    return counts;
  }

  async reviewCoach(id: string, adminId: string, dto: ReviewCoachDto) {
    if (dto.status === VerificationStatus.REJECTED && !dto.note?.trim()) {
      throw new BadRequestException('A rejection needs a note explaining why.');
    }

    const coach = await this.prisma.coachProfile.findUnique({ where: { id } });
    if (!coach) {
      throw new NotFoundException('Coach profile not found.');
    }
    if (coach.verificationStatus === dto.status) {
      throw new ConflictException(
        `This profile is already ${dto.status.toLowerCase()}.`,
      );
    }

    const updated = await this.prisma.coachProfile.update({
      where: { id },
      data: {
        verificationStatus: dto.status,
        verificationNote: dto.note?.trim() ?? null,
        reviewedAt: new Date(),
        reviewedById: adminId,
      },
      include: REVIEW_INCLUDE,
    });

    return toReviewResponse(updated);
  }
}
