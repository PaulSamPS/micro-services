import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig, SequelizeConfig } from './config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),

    SequelizeModule.forRootAsync({
      useClass: SequelizeConfig,
    }),
    ReviewModule,
  ],
})
export class AppModule {}
