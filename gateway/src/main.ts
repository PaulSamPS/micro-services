import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(cookieParser(configService.get<string>('SECRET_COOKIE')));
  const port = configService.get('port') || 3434;

  app.enableCors({
    credentials: true,
    origin: configService.get<string>('BASE_URL'),
  });

  await app.listen(port, () =>
    Logger.log(`🚀 Server is started on port ${port}`),
  );
}
bootstrap();
