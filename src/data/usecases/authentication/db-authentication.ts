import {
  IAuthentication,
  IAuthenticationModel,
} from '../../../domain/usecases/authentication';
import { IHashComparer } from '../../protocols/criptography/hash-comparer';
import { ITokenGenerator } from '../../protocols/criptography/token-generator';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashComparer: IHashComparer,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  public async auth({
    email,
    password,
  }: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email);

    if (!account) return null;

    const isValid = await this.hashComparer.compare({
      unhashed: password,
      hash: account.password,
    });

    if (!isValid) return null;

    const accessToken = await this.tokenGenerator.generate({
      userId: account.id,
    });

    if (accessToken) return accessToken;

    return null;
  }
}
