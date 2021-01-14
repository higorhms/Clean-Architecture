export interface IHashComparerModel {
  unhashed: string;
  hash: string;
}

export interface IHashComparer {
  compare(data: IHashComparerModel): Promise<boolean>;
}
