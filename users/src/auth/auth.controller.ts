import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtTokenService } from '@/tokens/jwt-token.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @EventPattern('register')
  async register(@Payload() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @EventPattern('login')
  async login(@Payload() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @EventPattern('refresh-token')
  async refreshToken(@Payload() _refreshToken: string) {
    return await this.jwtTokenService.refreshTokens(_refreshToken);
  }
}
