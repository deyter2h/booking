import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'booking_user',
  password: process.env.DB_PASSWORD || 'booking_password',
  database: process.env.DB_DATABASE || 'booking_db',
  entities: [Booking],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
};

