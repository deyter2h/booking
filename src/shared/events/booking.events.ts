import { BookingStatus } from '../entities/booking.entity';

export class BookingCreatedEvent {
  bookingId: string;
  restaurantId: string;
  date: string;
  time: string;
  numberOfGuests: number;
  status: BookingStatus;
}

