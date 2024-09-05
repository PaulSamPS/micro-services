import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthByVkService } from './auth-by-vk.service';
import { EventPattern, RpcException } from '@nestjs/microservices';
import { VkApiService } from '@/auth/auth-by-vk/vk-api.service';

/**
 * контроллер для авторизации по VK ID
 * @docs https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/tokens/access-token
 */
@Controller()
export class AuthByVkController {
  private readonly logger = new Logger(AuthByVkController.name);

  constructor(
    private readonly vkAuthService: AuthByVkService,
    private readonly config: ConfigService,
    private readonly vkApiService: VkApiService, // добавлен новый сервис для работы с VK API
  ) {}

  @EventPattern('vk-auth')
  async signInVk(@Query('token') token: string, @Query('uuid') uuid: string) {
    const accessBody = await this.vkApiService.exchangeVkSilentToken(
      token,
      uuid,
    );
    const access_token = accessBody.access_token;
    const profile = await this.vkApiService.getVkProfileInfo(access_token);

    return await this.vkAuthService.loginVk(accessBody, profile);
  }
}
