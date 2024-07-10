import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { REVIEWS_SERVICE, QUEUE } from './constants';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [RabbitMQModule.register(REVIEWS_SERVICE, QUEUE)],
  controllers: [ReviewsController],
  providers: [JwtService],
})
export class ReviewsModule {}
