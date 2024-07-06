import { IsEmail, IsString } from 'class-validator';

export namespace AccountLogin {
  export const topic = 'account.login.command';

  export class Request {
    constructor(email: string, password: string) {
      this.email = email;
      this.password = password;
    }

    @IsEmail()
    email: string;

    @IsString()
    password: string;
  }

  export class Response {
    constructor(message: string) {
      this.message = message;
    }

    message: string;
  }
}
