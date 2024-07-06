import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { PRODUCTS_SERVICE, QUEUE } from './constants';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [RabbitMQModule.register(PRODUCTS_SERVICE, QUEUE)],
  controllers: [ProductsController],
  providers: [JwtService],
})
export class ProductsModule {}
