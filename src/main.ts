import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as configv1 from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  configv1.config();
  const app = await NestFactory.create(AppModule);
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
  const port = (process.env.PORT || process.env.LOCAL_PORT) ?? 3000;
  await app.listen(port);
}

bootstrap();
