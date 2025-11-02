# Система бронирования столиков

Проект для бронирования столиков в ресторанах. Состоит из двух сервисов, которые общаются через Kafka.

## Установка

```bash
npm install
```

## Запуск

1. Запустить Docker контейнеры:
```bash
docker-compose up -d
```

Подождать пока Kafka полностью запустится (может быть минуту).

2. Запустить API сервис:
```bash
npm run start:dev:api
```

3. Запустить Booking сервис (в другом терминале):
```bash
npm run start:dev:booking
```

## API

API сервис работает на порту 3000.

**Создать бронирование:**
```
POST http://localhost:3000/api/bookings
{
  "restaurantId": "rest-1",
  "restaurantName": "Ресторан Премьер",
  "date": "2024-12-25",
  "time": "19:00",
  "numberOfGuests": 4,
  "customerName": "Иван Иванов",
  "customerEmail": "ivan@example.com"
}
```

**Посмотреть бронирование:**
```
GET http://localhost:3000/api/bookings/{bookingId}
```
