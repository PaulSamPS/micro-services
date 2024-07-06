import { Global, Module } from '@nestjs/common';
import { TokensRepository } from './tokens.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokensModel } from '@/tokens/tokens.model';
import { JwtTokenService } from '@/tokens/jwt-token.service';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([TokensModel])],
  providers: [JwtTokenService, JwtService, TokensRepository],
  exports: [JwtTokenService, JwtService],
})
export class TokensModule {}
