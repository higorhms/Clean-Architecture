import { Router, Request, Response } from 'express';

export default (router: Router): void => {
  router.post('/signup', (_: Request, res: Response) => {
    res.json({ message: 'ok' });
  });
};
