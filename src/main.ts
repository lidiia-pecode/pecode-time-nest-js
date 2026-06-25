import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Pecode Time')
    .setDescription(
      `
    Pecode Time is a time tracking and workforce activity management service
    that allows users to log working hours across different activity types
    and organizational structures.

    Features:
    - Time logging by calendar date
    - Activity and sub-activity hierarchy
    - Pagination support
    - Google OAuth authentication
    - HTTP-only cookie authentication
  `,
    )
    .addGlobalResponse({
      status: 400,
      description: 'Bad Request',
    })
    .addGlobalResponse({
      status: 401,
      description: 'Unauthorized',
    })
    .addGlobalResponse({
      status: 404,
      description: 'Resource not found',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      withCredentials: true,
    },
  });

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
