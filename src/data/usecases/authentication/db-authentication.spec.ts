import { AccountModel } from '../../../domain/models/account';
import { IAuthenticationModel } from '../../../domain/usecases/authentication';
import {
  IHashComparer,
  IHashComparerModel,
} from '../../protocols/criptography/hash-comparer';
import {
  ITokenGenerator,
  ITokenGeneratorModel,
} from '../../protocols/criptography/token-generator';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
});

const makeLoadAccountByEmailRespository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements ILoadAccountByEmailRepository {
    async load(_: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeFakeAuthentication = (): IAuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeHashComparer = (): IHashComparer => {
  class HashComparerStub implements IHashComparer {
    async compare(_: IHashComparerModel): Promise<boolean> {
      return true;
    }
  }

  return new HashComparerStub();
};

const makeTokenGenerator = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    async generate(_: ITokenGeneratorModel): Promise<string> {
      return 'any_token';
    }
  }

  return new TokenGeneratorStub();
};
interface ISutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  hashComparerStub: IHashComparer;
  tokenGeneratorStub: ITokenGenerator;
}

const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRespository();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  };
};

describe('DbAuthentication', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    sut.auth(makeFakeAuthentication());

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.auth(makeFakeAuthentication());

    expect(promise).rejects.toThrow();
  });

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null));

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBeNull();
  });

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();

    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.auth(makeFakeAuthentication());

    expect(compareSpy).toHaveBeenCalledWith({
      unhashed: 'any_password',
      hash: 'hashed_password',
    });
  });

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.auth(makeFakeAuthentication());

    expect(promise).rejects.toThrow();
  });

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false));

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBeNull();
  });

  it('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    await sut.auth(makeFakeAuthentication());

    expect(generateSpy).toHaveBeenCalledWith({ userId: 'any_id' });
  });
});
