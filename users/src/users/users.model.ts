import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { IUser, UserRole } from './users.interface';

@Table({ tableName: 'user' })
export class UsersModel extends Model implements IUser {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.STRING, defaultValue: false })
  vk_id: string;

  @Column({
    type: DataType.STRING,
    defaultValue: UserRole.User,
  })
  role: UserRole;
}
