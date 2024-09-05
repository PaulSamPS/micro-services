import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  VkAccessTokenResponse,
  VkProfileResponse,
} from '@/auth/auth-by-vk/auth-by-vk.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class VkApiService {
  private readonly logger = new Logger(VkApiService.name);
  private readonly VK_API_VERSION: string;
  private readonly VK_BASE_URL = 'https://api.vk.com';
  private readonly exchangeSilentAuthTokenUrl = `/method/auth.exchangeSilentAuthToken?`;
  private readonly getProfileInfoUrl = `/method/account.getProfileInfo?`;

  constructor(private readonly config: ConfigService) {
    this.VK_API_VERSION = this.config.get<string>('VK_API_VERSION', '5.199');
  }

  async exchangeVkSilentToken(
    token: string,
    uuid: string,
  ): Promise<VkAccessTokenResponse> {
    return this.makeRequestToVk(this.exchangeSilentAuthTokenUrl, {
      token,
      uuid,
      access_token: this.config.get('VK_SERVICE_KEY'),
    });
  }

  async getVkProfileInfo(access_token: string): Promise<VkProfileResponse> {
    return this.makeRequestToVk(this.getProfileInfoUrl, { access_token });
  }

  private async makeRequestToVk(
    url: string,
    queryParams: Record<string, string>,
  ) {
    const v = this.VK_API_VERSION;

    try {
      const response = await fetch(
        new URL(
          url + new URLSearchParams({ v, ...queryParams }),
          this.VK_BASE_URL,
        ),
      );

      return response.json();
    } catch (error) {
      this.logger.error('Ошибка запроса к VK API', error);
      throw new RpcException({
        message: 'Ошибка при запросе к VK API',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
