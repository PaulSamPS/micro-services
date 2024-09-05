import { Module } from '@nestjs/common';
import { UsersModule } from '@/users/users.module';
import { AuthByVkController } from '@/auth/auth-by-vk/auth-by-vk.controller';
import { AuthByVkService } from '@/auth/auth-by-vk/auth-by-vk.service';
import { VkApiService } from '@/auth/auth-by-vk/vk-api.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthByVkController],
  providers: [AuthByVkService, VkApiService],
})
export class AuthByVkModule {}
