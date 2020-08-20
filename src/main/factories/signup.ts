import SignUpController from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BCryptAdapter } from '../../infra/critpgraphy/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';

export const signUpControllerFactory = (): SignUpController => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const encrypter = new BCryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(encrypter, addAccountRepository);

  return new SignUpController(emailValidator, addAccount);
};
