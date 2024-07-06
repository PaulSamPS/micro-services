import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtTokenService } from '@/tokens/jwt-token.service';
import { setAuthCookie } from '@/lib/set-auth-cookie';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { access, refresh } = this.extractTokenFromCookie(request);

    if (!access && !refresh) {
      throw new UnauthorizedException('Токен не найден в куки.');
    }

    try {
      await this.verifyAccessToken(access);
      return true;
    } catch {
      await this.refreshTokenIfNeeded(response, refresh);
      return true;
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

  private async refreshTokenIfNeeded(response: Response, refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Истек срок действия токена и отсутствует refresh токен.',
      );
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.getJwtSecretRefresh(),
      });

      const { accessToken, newRefreshToken } =
        await this.jwtTokenService.refreshTokens(refreshToken);

      this.updateCookieTokens(response, accessToken, newRefreshToken);
    } catch (err) {
      throw new UnauthorizedException('Refresh токен невалиден.');
    }
  }

  private updateCookieTokens(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    setAuthCookie(response, accessToken, 'auth_access');
    setAuthCookie(response, refreshToken, 'auth_refresh');
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

  private getJwtSecretRefresh(): string {
    const secret = this.configService.get<string>('JWT_SECRET_REFRESH') || '';
    if (!secret) {
      throw new InternalServerErrorException(
        'Секрет JWT для refresh токена не найден в конфигурации.',
      );
    }
    return secret;
  }
}
