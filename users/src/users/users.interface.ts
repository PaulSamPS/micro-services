export enum UserRole {
  User = 'User',
  Admin = 'Admin',
}

export interface IUser {
  id?: number;
  vk_id?: string;
  email: string;
  password: string;
  role: UserRole;
}
