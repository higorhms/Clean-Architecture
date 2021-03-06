import { Router } from 'express';
import { signUpControllerFactory } from '../factories/signup/signup';
import { adaptRoute } from '../adapters/express-route-adapter';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(signUpControllerFactory()));
};
