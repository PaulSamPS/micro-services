import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { AUTH_SERVICE, QUEUE } from './constants';

@Module({
  imports: [RabbitMQModule.register(AUTH_SERVICE, QUEUE)],
  controllers: [AuthController],
})
export class AuthModule {}
