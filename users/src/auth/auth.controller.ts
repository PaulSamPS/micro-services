import {
  Controller,
  HttpStatus,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern('register')
  async register(dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @EventPattern('login')
  async login(dto: LoginDto) {
    return await this.authService.login(dto);
  }
}
