import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from '@/users/users.repository';
import { UsersEntity } from '@/users/users.entity';
import { UserRole } from '@/users/users.interface';
import * as bcrypt from 'bcrypt';
import { JwtTokenService } from '@/tokens/jwt-token.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register({ email, password }: RegisterDto) {
    const existedUser = await this.usersRepository.findOneByEmail(email);

    if (existedUser) {
      throw new RpcException({
        message: 'Пользователь с таким email уже существует',
        status: HttpStatus.CONFLICT,
      });
    }

    const newUserEntity = await new UsersEntity({
      email,
      password: '',
      role: UserRole.User,
    }).setPassword(password);

    return await this.usersRepository.createUser(newUserEntity);
  }

  async login(dto: LoginDto) {
    const existingUser = await this.usersRepository.findOneByEmail(dto.email);

    if (!existingUser) {
      throw new RpcException({
        message: 'Пользователь c таким email не найден',
        status: HttpStatus.NOT_FOUND,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new RpcException({
        message: 'Неверный пароль.',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const tokens = await this.jwtTokenService.generateJwtToken({
      user: { id: existingUser.id, role: existingUser.role },
    });

    return tokens;
  }
}
