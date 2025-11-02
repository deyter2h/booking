import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiServiceController } from './api-service.controller';
import { ApiServiceService } from './api-service.service';
import { databaseConfig } from '../shared/config/database.config';
import { Booking } from '../shared/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Booking]),
  ],
  controllers: [ApiServiceController],
  providers: [ApiServiceService],
})
export class ApiServiceModule {}

