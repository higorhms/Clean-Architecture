export interface IUpdateAccessTokenRepositoryModel {
  userId: string;
  token: string;
}

export interface IUpdateAccessTokenRepository {
  update(data: IUpdateAccessTokenRepositoryModel): Promise<void>;
}
