import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AUTH_SERVICE } from './constants';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { Response as ExpressResponse } from 'express';
import { setAuthCookie } from '../../lib/set-auth-cookie';
import { ILoginResponseType } from './login-response.type';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.client.send('register', dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    try {
      const data: ILoginResponseType = await lastValueFrom(
        this.client.send('login', dto),
      );
      setAuthCookie(res, data.accessToken, 'accessToken');
      setAuthCookie(res, data.refreshToken, 'refreshToken');
      return { message: 'Вход успешно выполнен' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
