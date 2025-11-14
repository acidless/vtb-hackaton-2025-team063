import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import cookieParser from "cookie-parser";
import {AllExceptionsFilter} from "./common/filters/all-exceptions.filter";
import {ResponseTransformInterceptor} from "./common/interceptors/response-transform.interceptor";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {MulterExceptionFilter} from "./common/filters/multer-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true,
  });

  const config = new DocumentBuilder()
      .setTitle('Family Multibank API')
      .setDescription('API для семейного мультибанка')
      .setVersion('1.0')
      .addCookieAuth('access_token')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(), new MulterExceptionFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
