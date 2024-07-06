import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

type IDecodeToken = {
  user: {
    role: string;
    id: number;
  };
};

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('Токен не найден.');
    }

    let decodedToken: IDecodeToken;

    try {
      decodedToken = this.jwtService.verify(token, {
        secret: this.getJwtSecretAccess(),
      });
    } catch (err) {
      throw new UnauthorizedException('Невалидный токен.');
    }

    console.log(decodedToken);

    if (decodedToken.user.role !== 'Admin') {
      throw new ForbiddenException('Доступ запрещен.');
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | null {
    return request.cookies.auth_access || null;
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
