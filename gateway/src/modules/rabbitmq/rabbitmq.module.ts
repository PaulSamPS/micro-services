import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({})
export class RabbitMQModule {
  static register(name: string, queue: string): DynamicModule {
    return {
      module: RabbitMQModule,
      imports: [
        ClientsModule.register([
          {
            name: name,
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://localhost:5672'],
              queue: queue,
              queueOptions: {
                durable: false,
              },
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
