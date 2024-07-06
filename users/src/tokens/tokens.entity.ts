import { ITokens } from './tokens.interface';

export class TokensEntity implements ITokens {
  id?: number;
  access_token: string;
  refresh_token: string;

  constructor(token: ITokens) {
    this.id = token.id;
    this.access_token = token.access_token;
    this.refresh_token = token.refresh_token;
  }
}
