import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ITokens } from './tokens.interface';

@Table({ tableName: 'token' })
export class TokensModel extends Model implements ITokens {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  access_token: string;

  @Column({ type: DataType.STRING, allowNull: false })
  refresh_token: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;
}
