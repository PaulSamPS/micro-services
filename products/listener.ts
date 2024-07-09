import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  const port = configService.get('port') || 3436;

  await app.listen(port, () =>
    Logger.log(`🚀 Server is started on port ${port}`),
  );
}
bootstrap();
