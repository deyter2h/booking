import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookingStatus {
  CREATED = 'CREATED',
  CHECKING_AVAILABILITY = 'CHECKING_AVAILABILITY',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantId: string;

  @Column()
  restaurantName: string;

  @Column('date')
  date: Date;

  @Column('time')
  time: string;

  @Column()
  numberOfGuests: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CREATED,
  })
  status: BookingStatus;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

