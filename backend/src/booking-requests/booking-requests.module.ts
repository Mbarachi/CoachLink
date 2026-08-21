import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { BookingRequestsController } from './booking-requests.controller';
import { BookingRequestsService } from './booking-requests.service';

@Module({
  imports: [AuthModule],
  controllers: [BookingRequestsController],
  providers: [BookingRequestsService],
})
export class BookingRequestsModule {}
