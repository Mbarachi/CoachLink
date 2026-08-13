import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';

import { CoachesService } from './coaches.service';
import { CoachQueryDto } from './dto/coach-query.dto';
import { CreateCoachProfileDto } from './dto/create-coach-profile.dto';
import { UpdateCoachProfileDto } from './dto/update-coach-profile.dto';

@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  /** Public — browsing coaches doesn't require an account. */
  @Get()
  list(@Query() query: CoachQueryDto) {
    return this.coachesService.list(query);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.coachesService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateCoachProfileDto) {
    return this.coachesService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateCoachProfileDto,
  ) {
    return this.coachesService.update(id, user.id, dto);
  }
}
