import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';
import { IValidation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation(new EmailValidatorAdapter(), 'email'));

  return new ValidationComposite(validations);
};
