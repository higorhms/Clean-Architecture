import request from 'supertest';

import { Request, Response } from 'express';
import app from '../config/app';

describe('Cors Middleware', () => {
  it('Should enable cors', async () => {
    app.get('/test_cors', (_: Request, res: Response) => {
      res.send();
    });

    await request(app)
      .get('/test_cors')
      .expect('acess-control-allow-origin', '*')
      .expect('acess-control-allow-methods', '*')
      .expect('acess-control-allow-headers', '*');
  });
});
