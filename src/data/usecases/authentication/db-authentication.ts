import {
  IAuthentication,
  IAuthenticationModel,
} from '../../../domain/usecases/authentication';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
  ) {}

  public async auth({
    email,
    password,
  }: IAuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(email);

    return null;
  }
}
