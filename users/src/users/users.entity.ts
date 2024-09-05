import { IUser, UserRole } from './users.interface';

export class UsersEntity implements IUser {
  id?: number;
  email: string;
  vk_id?: string;
  password: string;
  role: UserRole;

  constructor(user: IUser) {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.vk_id = user.vk_id;
    this.role = user.role;
  }
}
