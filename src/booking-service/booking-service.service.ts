import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { Booking, BookingStatus } from '../shared/entities/booking.entity';
import { BookingCreatedEvent } from '../shared/events/booking.events';
import { KAFKA_TOPICS } from '../shared/config/kafka.config';

@Injectable()
export class BookingServiceService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer;

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {
    this.kafka = new Kafka({
      clientId: 'booking-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
    this.consumer = this.kafka.consumer({ groupId: 'booking-service-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: KAFKA_TOPICS.BOOKING_CREATED,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        const event: BookingCreatedEvent = JSON.parse(
          message.value?.toString() || '{}',
        );

        console.log('Received booking event:', event);

        try {
          await this.processBookingCreatedEvent(event);
        } catch (error) {
          console.error('Error processing booking event:', error);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  private async processBookingCreatedEvent(event: BookingCreatedEvent) {
    const booking = await this.bookingRepository.findOne({
      where: { id: event.bookingId },
    });

    if (!booking) {
      console.error(`Booking ${event.bookingId} not found`);
      return;
    }

    booking.status = BookingStatus.CHECKING_AVAILABILITY;
    await this.bookingRepository.save(booking);

    const isAvailable = await this.checkTableAvailability(
      event.restaurantId,
      event.date,
      event.time,
      event.bookingId,
    );

    if (isAvailable) {
      booking.status = BookingStatus.CONFIRMED;
      console.log(`Booking ${event.bookingId} confirmed`);
    } else {
      booking.status = BookingStatus.REJECTED;
      console.log(`Booking ${event.bookingId} rejected - no tables available`);
    }

    await this.bookingRepository.save(booking);
  }

  private async checkTableAvailability(
    restaurantId: string,
    date: string,
    time: string,
    currentBookingId: string,
  ): Promise<boolean> {
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const conflictingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.restaurantId = :restaurantId', { restaurantId })
      .andWhere('booking.date >= :startDate AND booking.date < :endDate', {
        startDate: bookingDate,
        endDate: nextDay,
      })
      .andWhere('booking.time = :time', { time })
      .andWhere('booking.id != :currentBookingId', {
        currentBookingId,
      })
      .andWhere(
        '(booking.status = :confirmed OR booking.status = :checking)',
        {
          confirmed: BookingStatus.CONFIRMED,
          checking: BookingStatus.CHECKING_AVAILABILITY,
        },
      )
      .getCount();

    return conflictingBookings === 0;
  }
}

