import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'dotenv';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  config.config();
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = (process.env.PORT || process.env.LOCAL_PORT) ?? 3000;
  logger.log(`App running on port ${port}`);
  await app.listen(port);
}
bootstrap();
