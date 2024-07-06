import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { access } = this.extractTokenFromCookie(request);

    if (!access) {
      throw new UnauthorizedException('Токен не найден в куки.');
    }

    try {
      await this.verifyAccessToken(access);
      return true;
    } catch {
      return false;
    }
  }

  private async verifyAccessToken(accessToken: string): Promise<void> {
    try {
      await this.jwtService.verifyAsync(accessToken, {
        secret: this.getJwtSecretAccess(),
      });
    } catch (err) {
      throw new UnauthorizedException('Access токен невалиден.');
    }
  }

  private extractTokenFromCookie(request: Request): {
    access: string;
    refresh: string;
  } {
    const { auth_access: access = '', auth_refresh: refresh = '' } =
      request.cookies;
    return { access, refresh };
  }

  private getJwtSecretAccess(): string {
    const secret = this.configService.get<string>('JWT_SECRET_ACCESS') || '';
    if (!secret) {
      throw new InternalServerErrorException(
        'Секрет JWT для access токена не найден в конфигурации.',
      );
    }
    return secret;
  }
}
