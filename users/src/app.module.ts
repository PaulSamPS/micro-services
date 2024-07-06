import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { dbConfig, getRMQConfig, SequelizeConfig } from '@/config';
import { RMQModule } from 'nestjs-rmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),
    RMQModule.forRootAsync(getRMQConfig()),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfig, // Использование сервиса для настройки подключения к базе данных
    }),
    UsersModule,
    TokensModule,
    AuthModule,
  ],
})
export class AppModule {}
