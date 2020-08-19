import request from 'supertest';

import app from '../config/app';

describe('SignUp Route', () => {
  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Higor',
        email: 'higorhmscebrac@hotmail.com',
        password: '123',
        passwordConfirmation: '123',
      })
      .expect(200);
  });
});
