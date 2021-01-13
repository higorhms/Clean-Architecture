import SignUpController from '../../presentation/controllers/signup/signup';
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BCryptAdapter } from '../../infra/critpgraphy/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogControllerDecorator } from '../decorators/log';
import { Controller } from '../../presentation/protocols';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { makeSignUpValidation } from './signup-validation';

export const signUpControllerFactory = (): Controller => {
  const salt = 12;
  const encrypter = new BCryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(encrypter, addAccountRepository);

  const validationComposite = makeSignUpValidation();

  const signUpController = new SignUpController(
    addAccount,
    validationComposite,
  );
  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logMongoRepository);
};
