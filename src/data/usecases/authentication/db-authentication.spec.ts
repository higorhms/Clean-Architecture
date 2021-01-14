import { AccountModel } from '../../../domain/models/account';
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

describe('DbAuthentication', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub
      implements ILoadAccountByEmailRepository {
      async load(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
        };
        return Promise.resolve(account);
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    sut.auth({ email: 'any_email@mail.com', password: 'any_password' });

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
