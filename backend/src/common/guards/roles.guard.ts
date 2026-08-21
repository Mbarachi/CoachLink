import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type { RequestUser } from '../decorators/current-user.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<UserRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Not authenticated.');
    }

    // Deliberately re-read the role rather than trusting the JWT's copy. Tokens
    // live for 7 days, so a revoked admin would otherwise keep access until
    // theirs expired — too long a window for a privileged route.
    const current = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (!current || !required.includes(current.role)) {
      throw new ForbiddenException('You do not have access to this resource.');
    }

    return true;
  }
}
