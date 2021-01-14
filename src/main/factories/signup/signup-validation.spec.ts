import {
  CompareFieldsValidation,
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';
import { IValidation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../../presentation/helpers/validators/validation-composite');

describe('SignUpValidation factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const validations: IValidation[] = [];

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    );

    validations.push(new EmailValidation({} as EmailValidatorAdapter, 'email'));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
