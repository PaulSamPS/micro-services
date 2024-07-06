import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(cookieParser(configService.get<string>('SECRET_COOKIE')));

  app.enableCors({
    credentials: true,
    origin: configService.get<string>('BASE_URL'),
  });
  await app.listen(3001);
}
bootstrap();
