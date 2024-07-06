export enum UserRole {
  User = 'User',
  Admin = 'Admin',
}

export interface IUser {
  id?: number;
  email: string;
  password: string;
  role: UserRole;
}
