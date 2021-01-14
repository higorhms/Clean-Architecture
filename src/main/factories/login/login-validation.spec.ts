import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { IValidation } from '../../../presentation/protocols/validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { makeLoginValidation } from './login-validation';

jest.mock('../../../presentation/helpers/validators/validation-composite');

describe('LoginValidationFactory factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();

    const validations: IValidation[] = [];

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation({} as EmailValidatorAdapter, 'email'));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
