import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';

import { BookingRequestsService } from './booking-requests.service';
import { BookingRequestQueryDto } from './dto/booking-request-query.dto';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { UpdateBookingRequestDto } from './dto/update-booking-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('booking-requests')
export class BookingRequestsController {
  constructor(
    private readonly bookingRequestsService: BookingRequestsService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateBookingRequestDto,
  ) {
    return this.bookingRequestsService.create(user.id, dto);
  }

  /** Coaches get the requests sent to them; everyone else gets their own. */
  @Get()
  list(
    @CurrentUser() user: RequestUser,
    @Query() query: BookingRequestQueryDto,
  ) {
    return this.bookingRequestsService.list(user.id, query);
  }

  @Get(':id')
  getById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.bookingRequestsService.getById(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateBookingRequestDto,
  ) {
    return this.bookingRequestsService.update(id, user.id, dto);
  }
}
