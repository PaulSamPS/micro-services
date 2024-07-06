import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface IToken {
  user: {
    id: string;
    role: string;
  };
  iat: Date;
  exp: Date;
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('Токен не найден.');
    }

    let decodedToken = {} as IToken;

    try {
      decodedToken = this.jwtService.decode(token);
    } catch (err) {
      throw new UnauthorizedException('Невалидный токен.');
    }

    if (decodedToken.user.role !== 'Admin') {
      throw new ForbiddenException('Доступ запрещен.');
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | null {
    return request.cookies.auth_access || null;
  }
}
