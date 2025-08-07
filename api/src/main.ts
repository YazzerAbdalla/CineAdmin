import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // <-- must be true
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Setting API Path
  const apiPath = 'api';

  // Swagger Options
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Movie rating app by Nest.js')
    .setDescription('Swagger API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // Swagger path: http://localhost:5000/api/docs\
  SwaggerModule.setup(`${apiPath}/docs`, app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
