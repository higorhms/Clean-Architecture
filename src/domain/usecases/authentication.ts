export interface IAuthenticationModel {
  email: string;
  password: string;
}

export interface IAuthentication {
  auth(data: IAuthenticationModel): Promise<string>;
}
