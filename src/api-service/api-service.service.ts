import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../shared/entities/booking.entity';
import { CreateBookingDto } from '../shared/dto/create-booking.dto';
import { BookingCreatedEvent } from '../shared/events/booking.events';
import { KAFKA_TOPICS } from '../shared/config/kafka.config';
import { Kafka } from 'kafkajs';

@Injectable()
export class ApiServiceService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer;

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {
    this.kafka = new Kafka({
      clientId: 'api-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookingRepository.create({
      restaurantId: createBookingDto.restaurantId,
      restaurantName: createBookingDto.restaurantName,
      date: new Date(createBookingDto.date),
      time: createBookingDto.time,
      numberOfGuests: createBookingDto.numberOfGuests,
      customerName: createBookingDto.customerName,
      customerEmail: createBookingDto.customerEmail,
      status: BookingStatus.CREATED,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    const event: BookingCreatedEvent = {
      bookingId: savedBooking.id,
      restaurantId: savedBooking.restaurantId,
      date: createBookingDto.date,
      time: createBookingDto.time,
      numberOfGuests: savedBooking.numberOfGuests,
      status: savedBooking.status,
    };

    await this.producer.send({
      topic: KAFKA_TOPICS.BOOKING_CREATED,
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    });

    return savedBooking;
  }

  async getBooking(id: string): Promise<Booking | null> {
    return this.bookingRepository.findOne({ where: { id } });
  }
}

