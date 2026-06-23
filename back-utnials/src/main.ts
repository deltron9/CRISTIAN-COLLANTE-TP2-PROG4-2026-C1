import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({ origin: process.env.URL_FRONT, credentials: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', allowedHeaders: 'Content-Type, Accept, Authorization', optionsSuccessStatus: 204});
  app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
