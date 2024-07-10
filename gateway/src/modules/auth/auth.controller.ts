import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AUTH_SERVICE } from './constants';
import { lastValueFrom } from 'rxjs';
import { Response as ExpressResponse } from 'express';
import { setAuthCookie } from '../../lib/set-auth-cookie';
import { ILoginResponseType } from './login-response.type';
import { Cookies } from '../../decorators/coockie.decorator';
import { ErrorInterceptor } from '../../interceptors/error-interceptor';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  @UseInterceptors(ErrorInterceptor)
  async register(@Body() dto: RegisterDto): Promise<{ message: string }> {
    return await lastValueFrom(this.client.send('register', dto));
  }

  @Post('login')
  @UseInterceptors(ErrorInterceptor)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<{ message: string }> {
    const tokens: { accessToken: string; refreshToken: string } =
      await lastValueFrom(this.client.send('login', dto));
    setAuthCookie(res, tokens.accessToken, 'auth_access');
    setAuthCookie(res, tokens.refreshToken, 'auth_refresh');

    return { message: 'Вход успешно выполнен' };
  }

  @Get('refresh')
  @UseInterceptors(ErrorInterceptor)
  async refreshToken(
    @Cookies('auth_refresh') _refreshToken: string,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const tokens: ILoginResponseType = await lastValueFrom(
      this.client.send('refresh-token', _refreshToken),
    );
    setAuthCookie(res, tokens.accessToken, 'auth_access');
    setAuthCookie(res, tokens.refreshToken, 'auth_refresh');
    return { message: 'Токены обновлены' };
  }
}
