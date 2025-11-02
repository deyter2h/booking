import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingServiceService } from './booking-service.service';
import { BookingServiceController } from './booking-service.controller';
import { databaseConfig } from '../shared/config/database.config';
import { Booking } from '../shared/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Booking]),
  ],
  controllers: [BookingServiceController],
  providers: [BookingServiceService],
})
export class BookingServiceModule {}

