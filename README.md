# Система бронирования столиков

Проект для бронирования столиков в ресторанах. Состоит из двух сервисов, которые общаются через Kafka.

## Что нужно для запуска

- Node.js
- Docker и Docker Compose
- PostgreSQL и Kafka запускаются через Docker

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

## Как это работает

1. Создаешь бронь через API - она сохраняется со статусом CREATED
2. Событие уходит в Kafka
3. Booking Service подхватывает событие и проверяет доступность
4. Статус меняется на CHECKING_AVAILABILITY, потом на CONFIRMED или REJECTED

Если в ресторане уже есть бронь на это время - новая будет отклонена.

## Структура

- `src/api-service` - API сервис, принимает HTTP запросы
- `src/booking-service` - сервис проверки доступности, слушает Kafka
- `src/shared` - общий код (сущности, конфиги)

