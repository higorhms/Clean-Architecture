import {
  IAuthentication,
  IAuthenticationModel,
} from '../../../domain/usecases/authentication';
import { IHashComparer } from '../../protocols/criptography/hash-comparer';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashComparer: IHashComparer,
  ) {}

  public async auth({
    email,
    password,
  }: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email);

    if (!account) return null;

    await this.hashComparer.compare({
      unhashed: password,
      hash: account.password,
    });

    return null;
  }
}
