import { Controller } from '@nestjs/common';
import { AuthByEmailService } from './auth-by-email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EventPattern } from '@nestjs/microservices';
import { JwtTokenService } from '@/tokens/jwt-token.service';

@Controller()
export class AuthByEmailController {
  constructor(
    private readonly authByEmailService: AuthByEmailService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @EventPattern('register')
  async register(dto: RegisterDto) {
    return await this.authByEmailService.register(dto);
  }

  @EventPattern('login')
  async login(dto: LoginDto) {
    return await this.authByEmailService.login(dto);
  }

  @EventPattern('refresh-token')
  async refreshToken(_refreshToken: string) {
    return await this.jwtTokenService.refreshTokens(_refreshToken);
  }
}
