import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TokensModel } from './tokens.model';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectModel(TokensModel)
    private readonly tokensModel: typeof TokensModel,
  ) {}

  /**
   * Найти токены по идентификатору пользователя.
   * @param user_id Идентификатор пользователя.
   * @returns Объект с данными токенов или undefined, если токены не найдены.
   */
  async findByUserId(user_id: number): Promise<TokensModel | undefined> {
    return this.tokensModel.findOne({ where: { user_id } });
  }

  async create(
    user_id: number,
    access_token: string,
    refresh_token: string,
  ): Promise<TokensModel> {
    try {
      return await this.tokensModel.create({
        user_id,
        access_token,
        refresh_token,
      });
    } catch (error) {
      throw new Error(`Ошибка при создании записи о токенах: ${error}`);
    }
  }

  /**
   * Обновить запись о токенах.
   * @param tokens Объект с данными токенов для обновления.
   */
  async update(tokens: TokensModel): Promise<void> {
    try {
      await tokens.save();
    } catch (error) {
      throw new Error(`Ошибка при обновлении записи о токенах: ${error}`);
    }
  }
}
