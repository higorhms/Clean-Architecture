export interface ITokenGeneratorModel {
  userId: string;
}

export interface ITokenGenerator {
  generate(data: ITokenGeneratorModel): Promise<string>;
}
