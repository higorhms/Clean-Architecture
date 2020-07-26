import { DbAddAccount } from './db-add-account';
import { Encrypter } from '../../protocols/encrypter';
import { AddAccount } from '../../../domain/usecases/add-account';

let dbAddAccount: AddAccount;
let encrypterStub: Encrypter;

jest.mock('../../protocols/encrypter', () => ({
  encrypt: () => 'hashed_password',
}));

class EncrypterStub {
  async encrypt(value: string): Promise<string> {
    return Promise.resolve('hashed_password');
  }
}

describe('DbAddAccount Usecase', () => {
  beforeEach(() => {
    encrypterStub = new EncrypterStub();
    dbAddAccount = new DbAddAccount(encrypterStub);
  });

  it('Should call Encrypter with correct password', () => {
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    dbAddAccount.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
