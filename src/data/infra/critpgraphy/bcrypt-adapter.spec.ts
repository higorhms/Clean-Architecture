import bcrypt from 'bcrypt';

import { BCryptAdapter } from './bcrypt-adapter';
import { Encrypter } from '../../protocols/encrypter';

let bcryptAdapter: Encrypter;

describe('BCrypt Adapter', () => {
  beforeEach(() => {
    bcryptAdapter = new BCryptAdapter(12);
  });

  it('Should call bcrypt with correct value', async () => {
    const salt = 12;
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await bcryptAdapter.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });
});
