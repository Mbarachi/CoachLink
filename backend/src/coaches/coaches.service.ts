import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CoachQueryDto } from './dto/coach-query.dto';
import { CreateCoachProfileDto } from './dto/create-coach-profile.dto';
import { UpdateCoachProfileDto } from './dto/update-coach-profile.dto';

/** Shape the frontend's `Coach` type expects: profile + sports + user identity. */
const COACH_INCLUDE = {
  user: { select: { firstName: true, lastName: true, profileImage: true } },
  sports: { include: { sport: true } },
} satisfies Prisma.CoachProfileInclude;

type CoachWithRelations = Prisma.CoachProfileGetPayload<{
  include: typeof COACH_INCLUDE;
}>;

function toCoachResponse(coach: CoachWithRelations) {
  const { user, sports, ...profile } = coach;
  return {
    profile,
    sports: sports.map((s) => s.sport),
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.profileImage,
  };
}

@Injectable()
export class CoachesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: CoachQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const coaches = await this.prisma.coachProfile.findMany({
      where: {
        // Athletes may only discover coaches who passed manual verification.
        verificationStatus: 'APPROVED',
        isActive: true,
        ...(query.venue
          ? { venue: { equals: query.venue, mode: 'insensitive' } }
          : {}),
        ...(query.sport
          ? {
              sports: {
                some: {
                  sport: { name: { equals: query.sport, mode: 'insensitive' } },
                },
              },
            }
          : {}),
        ...(query.search
          ? {
              OR: [
                { venue: { contains: query.search, mode: 'insensitive' } },
                {
                  user: {
                    firstName: { contains: query.search, mode: 'insensitive' },
                  },
                },
                {
                  user: {
                    lastName: { contains: query.search, mode: 'insensitive' },
                  },
                },
              ],
            }
          : {}),
      },
      include: COACH_INCLUDE,
      orderBy: [{ rating: 'desc' }, { totalReviews: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    });

    return coaches.map(toCoachResponse);
  }

  async getById(id: string) {
    const coach = await this.prisma.coachProfile.findUnique({
      where: { id },
      include: COACH_INCLUDE,
    });
    if (!coach) {
      throw new NotFoundException('Coach not found.');
    }
    return toCoachResponse(coach);
  }

  async create(userId: string, dto: CreateCoachProfileDto) {
    const existing = await this.prisma.coachProfile.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new BadRequestException('You already have a coach profile.');
    }
    await this.assertSportsExist(dto.sportIds);

    const coach = await this.prisma.coachProfile.create({
      data: {
        userId,
        bio: dto.bio,
        yearsOfExperience: dto.yearsOfExperience,
        sessionRate: dto.sessionRate,
        venue: dto.venue,
        ...(dto.area ? { area: dto.area } : {}),
        sports: { create: dto.sportIds.map((sportId) => ({ sportId })) },
      },
      include: COACH_INCLUDE,
    });

    // Creating a profile also promotes the account to a coach.
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'COACH' },
    });

    return toCoachResponse(coach);
  }

  async update(id: string, userId: string, dto: UpdateCoachProfileDto) {
    const existing = await this.prisma.coachProfile.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Coach not found.');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('You can only edit your own coach profile.');
    }
    if (dto.sportIds) {
      await this.assertSportsExist(dto.sportIds);
    }

    const { sportIds, ...rest } = dto;
    const coach = await this.prisma.coachProfile.update({
      where: { id },
      data: {
        ...rest,
        ...(sportIds
          ? {
              sports: {
                deleteMany: {},
                create: sportIds.map((sportId) => ({ sportId })),
              },
            }
          : {}),
      },
      include: COACH_INCLUDE,
    });

    return toCoachResponse(coach);
  }

  private async assertSportsExist(sportIds: string[]) {
    const found = await this.prisma.sport.count({
      where: { id: { in: sportIds } },
    });
    if (found !== sportIds.length) {
      throw new BadRequestException('One or more sports are invalid.');
    }
  }
}
