import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

import { AdminService } from './admin.service';
import { AdminCoachQueryDto } from './dto/admin-coach-query.dto';
import { ReviewCoachDto } from './dto/review-coach.dto';
import { ADMIN_PAGE } from './admin.page';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * The back-office page itself. Public because it holds no data — it signs in
   * through the normal auth endpoints and every call it makes is guarded below.
   */
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'no-store')
  page() {
    return ADMIN_PAGE;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('coaches')
  listCoaches(@Query() query: AdminCoachQueryDto) {
    return this.adminService.listCoaches(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('coaches/counts')
  counts() {
    return this.adminService.counts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('coaches/:id/verification')
  reviewCoach(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() admin: RequestUser,
    @Body() dto: ReviewCoachDto,
  ) {
    return this.adminService.reviewCoach(id, admin.id, dto);
  }
}
