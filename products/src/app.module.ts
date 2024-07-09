import { Module } from '@nestjs/common';
import { ProductsModule } from '@/modules/products/products.module';
import { dbConfig, SequelizeConfig } from './config';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from 'src/modules/files';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),

    SequelizeModule.forRootAsync({
      useClass: SequelizeConfig,
    }),
    ProductsModule,
    FilesModule,
    MulterModule.register({ dest: './uploads ' }),
  ],
})
export class AppModule {}
