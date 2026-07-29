import { Injectable, NotFoundException } from '@nestjs/common';

import { sanitizeUser } from '../common/sanitize-user';
import { PrismaService } from '../prisma/prisma.service';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return sanitizeUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({ where: { id }, data: dto });
    return sanitizeUser(user);
  }
}
