import { Module } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductsController } from './products.controller';
import { JwtService } from '@nestjs/jwt';
import { ProductsModel } from '@/modules/products/products.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesService } from 'src/modules/files';
import { RabbitMQModule } from '@/modules/rabbitmq/rabbitmq.module';
import { PRODUCTS_UPDATE_SERVICE, QUEUE } from '@/modules/products/constants';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductsModel]),
    RabbitMQModule.register(PRODUCTS_UPDATE_SERVICE, QUEUE),
  ],
  providers: [ProductsRepository, JwtService, FilesService],
  controllers: [ProductsController],
})
export class ProductsModule {}
