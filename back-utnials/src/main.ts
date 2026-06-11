import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ForbiddenException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}));
  app.enableCors({ origin: '*'});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
