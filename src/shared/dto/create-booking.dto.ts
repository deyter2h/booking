export class CreateBookingDto {
  restaurantId: string;
  restaurantName: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  numberOfGuests: number;
  customerName?: string;
  customerEmail?: string;
}

