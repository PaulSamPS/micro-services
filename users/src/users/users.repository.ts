import { UsersModel } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';
import { JwtTokenService } from '@/tokens/jwt-token.service';
import { UserRole } from '@/users/users.interface';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UsersModel) private readonly userModel: typeof UsersModel,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async findOneById(id: number) {
    return this.userModel.findByPk(id);
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async createUser(user: UsersEntity) {
    const newUserEntity = new UsersModel({
      email: user.email,
      password: user.password,
      role: UserRole.User,
    });

    await newUserEntity.save();
    return { message: 'Регистрация прошла успешно.' };
  }
}
