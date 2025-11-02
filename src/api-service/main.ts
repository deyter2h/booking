import { NestFactory } from '@nestjs/core';
import { ApiServiceModule } from './api-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiServiceModule);
  app.setGlobalPrefix('api');
  await app.listen(3000);
  console.log('API Service is running on http://localhost:3000');
}
bootstrap();

