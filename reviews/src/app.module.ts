import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig, SequelizeConfig } from './config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),

    SequelizeModule.forRootAsync({
      useClass: SequelizeConfig,
    }),
  ],
})
export class AppModule {}
