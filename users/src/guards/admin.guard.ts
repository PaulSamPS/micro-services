import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersRepository } from '@/users/users.repository';
import { IUser, UserRole } from '@/users/users.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('Токен не найден.');
    }

    let decodedToken: Pick<IUser, 'role' | 'id' | 'email'>;

    try {
      decodedToken = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Невалидный токен.');
    }

    const user = await this.usersRepository.findOneById(decodedToken.id);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден.');
    }

    if (user.role !== UserRole.Admin) {
      throw new ForbiddenException('Доступ запрещен.');
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | null {
    return request.cookies.auth_access || null;
  }
}
