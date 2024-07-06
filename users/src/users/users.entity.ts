import { compare, genSalt, hash } from 'bcrypt';
import { IUser, UserRole } from './users.interface';

export class UsersEntity implements IUser {
  id?: number;
  displayName: string;
  email: string;
  password: string;
  role: UserRole;

  constructor(user: IUser) {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.password = await hash(password, salt);
    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.password);
  }
}
