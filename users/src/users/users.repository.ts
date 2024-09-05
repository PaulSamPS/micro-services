import { UsersModel } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { JwtTokenService } from '@/tokens/jwt-token.service';
import { IUser, UserRole } from '@/users/users.interface';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UsersModel) private readonly userModel: typeof UsersModel,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async findOneById(id: number) {
    return this.userModel.findByPk(id);
  }

  async findOneByVkId(vk_id: string) {
    return this.userModel.findOne({ where: { vk_id } });
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async createUser(user: IUser) {
    const newUserEntity = new UsersModel({
      email: user.email,
      password: user.password,
      vk_id: user.vk_id || null,
      role: UserRole.User,
    });

    await newUserEntity.save();
    return { message: 'Регистрация прошла успешно.' };
  }
}
