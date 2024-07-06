import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from '@/users/users.model';
import { TokensModule } from '@/tokens/tokens.module';

@Module({
  imports: [SequelizeModule.forFeature([UsersModel]), TokensModule],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
