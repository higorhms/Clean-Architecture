import { DbAddAccount } from './db-add-account';
import {
  AddAccount,
  Encrypter,
  AddAccountRepository,
} from './db-add-account-protocols';
import { AddAccountModel } from '../../../domain/usecases/add-account';
import { AccountModel } from '../../../domain/models/account';

let dbAddAccount: AddAccount;
let encrypterStub: Encrypter;
let addAccountRepositoryStub: AddAccountRepository;

jest.mock('../../protocols/encrypter', () => ({
  encrypt: () => 'hashed_password',
}));

class EncrypterStub implements Encrypter {
  async encrypt(value: string): Promise<string> {
    return Promise.resolve('hashed_password');
  }
}

class AddAccountRepositoryStub {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    };
    return Promise.resolve(fakeAccount);
  }
}

describe('DbAddAccount Usecase', () => {
  beforeEach(() => {
    addAccountRepositoryStub = new AddAccountRepositoryStub();
    encrypterStub = new EncrypterStub();
    dbAddAccount = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
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

  it('Should call AddAccountRepository with correct values', async () => {
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };

    await dbAddAccount.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    });
  });

  it('Should throw if DbAddAccount throws', async () => {
    jest
      .spyOn(addAccountRepositoryStub, 'add')
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
