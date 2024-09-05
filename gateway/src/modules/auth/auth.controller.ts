import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Query,
  Res,
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

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await lastValueFrom(this.client.send('register', dto));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    try {
      const { tokens } = await lastValueFrom(this.client.send('login', dto));
      setAuthCookie(res, tokens.accessToken, 'auth_access');
      setAuthCookie(res, tokens.refreshToken, 'auth_refresh');

      return { message: 'Вход успешно выполнен' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('refresh')
  async refreshToken(
    @Cookies('auth_refresh') _refreshToken: string,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    console.log(_refreshToken);
    const tokens: ILoginResponseType = await lastValueFrom(
      this.client.send('refresh-token', _refreshToken),
    );
    setAuthCookie(res, tokens.accessToken, 'auth_access');
    setAuthCookie(res, tokens.refreshToken, 'auth_refresh');
    return { message: 'Токены обновлены' };
  }

  @Get('vk')
  async loginVk(
    @Query('token') token: string,
    @Query('uuid') uuid: string,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    try {
      const tokens: ILoginResponseType = await lastValueFrom(
        this.client.send('vk-auth', { token, uuid }),
      );
      setAuthCookie(res, tokens.accessToken, 'auth_access');
      setAuthCookie(res, tokens.refreshToken, 'auth_refresh');

      return { message: 'Вход успешно выполнен' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
