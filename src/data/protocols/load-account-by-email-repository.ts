import { AccountModel } from '../../domain/models/account';

export interface ILoadAccountByEmailRepository {
  load(email: string): Promise<AccountModel>;
}
