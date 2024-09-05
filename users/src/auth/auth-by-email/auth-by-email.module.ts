import { Module } from '@nestjs/common';
import { AuthByEmailController } from './auth-by email.controller';
import { AuthByEmailService } from './auth-by-email.service';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthByEmailController],
  providers: [AuthByEmailService],
})
export class AuthByEmailModule {}
