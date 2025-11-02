export const kafkaConfig = {
  client: {
    clientId: 'booking-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  },
  consumer: {
    groupId: 'booking-service-group',
  },
};

export const KAFKA_TOPICS = {
  BOOKING_CREATED: 'booking.created',
  BOOKING_CHECKED: 'booking.checked',
};

