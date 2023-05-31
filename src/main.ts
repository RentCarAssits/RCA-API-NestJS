import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as configv1 from 'dotenv';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  configv1.config();
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('RCA-API')
    .setDescription('Rent Car Assists Api Documentation')
    .setVersion('1.0')
    .addTag('CRA')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
