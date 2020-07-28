import bcrypt from 'bcrypt';
import { Encrypter } from '../../protocols/encrypter';

export class BCryptAdapter implements Encrypter {
  private readonly hashSalt: number;

  constructor(salt: number) {
    this.hashSalt = salt;
  }

  public async encrypt(value: string): Promise<string> {
    const hashedString = await bcrypt.hash(value, this.hashSalt);

    return hashedString;
  }
}
