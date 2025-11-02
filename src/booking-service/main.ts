import { NestFactory } from '@nestjs/core';
import { BookingServiceModule } from './booking-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BookingServiceModule);
  await app.listen(3001);
  console.log('Booking Service is running on http://localhost:3001');
}
bootstrap();

