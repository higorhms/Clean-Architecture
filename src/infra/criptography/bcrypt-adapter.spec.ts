import bcrypt from 'bcrypt';

import { BCryptAdapter } from './bcrypt-adapter';
import { Encrypter } from '../../data/protocols/criptography/encrypter';

let bcryptAdapter: Encrypter;
const salt = 12;

jest.mock('bcrypt', () => ({
  hash: () => 'hashed_value',
}));

describe('BCrypt Adapter', () => {
  beforeEach(() => {
    bcryptAdapter = new BCryptAdapter(salt);
  });

  it('Should call bcrypt with correct value', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await bcryptAdapter.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('Should return a hash on success', async () => {
    const hashedValue = await bcryptAdapter.encrypt('any_value');

    expect(hashedValue).toBe('hashed_value');
  });

  it('Should throw if becrypt throws', async () => {
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()));

    const bcryptPromise = bcryptAdapter.encrypt('any_value');

    await expect(bcryptPromise).rejects.toThrow();
  });
});
