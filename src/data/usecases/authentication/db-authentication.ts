import {
  IAuthentication,
  IAuthenticationModel,
  IHashComparer,
  ITokenGenerator,
  ILoadAccountByEmailRepository,
  IUpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashComparer: IHashComparer,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository,
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

    await this.updateAccessTokenRepositoryStub.update({
      userId: account.id,
      token: accessToken,
    });

    return accessToken || null;
  }
}
