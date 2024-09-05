import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { VkAccessTokenResponse, VkProfileResponse } from './auth-by-vk.dto';
import { UsersRepository } from '@/users/users.repository';
import { JwtTokenService } from '@/tokens/jwt-token.service';
import { IUser, UserRole } from '@/users/users.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthByVkService {
  protected readonly logger = new Logger(AuthByVkService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async loginVk(
    vkAccessTokenResponse: VkAccessTokenResponse,
    vkProfile: VkProfileResponse,
  ) {
    const user = await this.findOrCreateUser(vkProfile, vkAccessTokenResponse);
    const tokens = await this.generateTokens(user);
    return { tokens };
  }

  private async findOrCreateUser(
    vkProfile: VkProfileResponse,
    vkAccessTokenResponse: VkAccessTokenResponse,
  ) {
    if (!vkProfile.id) {
      throw new RpcException({
        message: 'Нет id профиля вк',
        status: HttpStatus.BAD_GATEWAY,
      });
    }
    const user = await this.usersRepository.findOneByVkId(vkProfile.id);

    if (!user) {
      await this.usersRepository.createUser({
        role: UserRole.User,
        vk_id: vkProfile.id,
        email: vkAccessTokenResponse.email || null,
        password: vkAccessTokenResponse.access_token,
      });
    }
    return user;
  }

  private async generateTokens(user: IUser) {
    return this.jwtTokenService.generateJwtToken({
      user: { id: user.id, role: user.role },
    });
  }
}
