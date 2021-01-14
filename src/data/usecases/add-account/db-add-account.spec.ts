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

const makeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
});

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
});

class EncrypterStub implements Encrypter {
  async encrypt(_: string): Promise<string> {
    return Promise.resolve('hashed_password');
  }
}

class AddAccountRepositoryStub {
  async add(_: AddAccountModel): Promise<AccountModel> {
    return Promise.resolve(makeFakeAccount());
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

    dbAddAccount.add(makeAccountData());

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  it('Should throw if Encrypter throw', async () => {
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const accoutPromise = dbAddAccount.add(makeAccountData());

    await expect(accoutPromise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct values', async () => {
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await dbAddAccount.add(makeAccountData());

    expect(addSpy).toHaveBeenCalledWith(
      Object.assign(makeAccountData(), {
        password: 'hashed_password',
      } as AccountModel),
    );
  });

  it('Should throw if DbAddAccount throws', async () => {
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const accoutPromise = dbAddAccount.add(makeAccountData());

    await expect(accoutPromise).rejects.toThrow();
  });

  it('Should return an account on success', async () => {
    const account = await dbAddAccount.add(makeAccountData());

    expect(account).toEqual(makeFakeAccount());
  });
});
