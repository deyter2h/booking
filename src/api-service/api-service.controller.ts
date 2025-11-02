import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiServiceService } from './api-service.service';
import { CreateBookingDto } from '../shared/dto/create-booking.dto';

@Controller('bookings')
export class ApiServiceController {
  constructor(private readonly apiServiceService: ApiServiceService) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    try {
      const booking = await this.apiServiceService.createBooking(
        createBookingDto,
      );
      return {
        id: booking.id,
        status: booking.status,
        message: 'Booking created successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create booking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    const booking = await this.apiServiceService.getBooking(id);
    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
    return booking;
  }
}

