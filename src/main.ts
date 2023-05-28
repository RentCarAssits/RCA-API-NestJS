import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'dotenv';

async function bootstrap() {
  config.config();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: '*' });
  const port = (process.env.PORT || process.env.LOCAL_PORT)?? 3000;
  await app.listen(port);
}
bootstrap();
