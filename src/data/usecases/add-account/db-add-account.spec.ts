import { DbAddAccount } from './db-add-account';
import { AddAccount, Encrypter } from './db-add-account-protocols';

let dbAddAccount: AddAccount;
let encrypterStub: Encrypter;

jest.mock('../../protocols/encrypter', () => ({
  encrypt: () => 'hashed_password',
}));

class EncrypterStub implements Encrypter {
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

  it('Should throw if Encrypter throw', async () => {
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    const accoutPromise = dbAddAccount.add(accountData);

    await expect(accoutPromise).rejects.toThrow();
  });
});
