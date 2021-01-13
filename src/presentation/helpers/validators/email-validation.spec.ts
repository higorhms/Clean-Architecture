import { EmailValidation } from './email-validation';
import { EmailValidator } from '../../protocols/email-validator';
import { InvalidParamError } from '../../errors';

class EmailValidatorStub implements EmailValidator {
  isValid(_: string): boolean {
    return true;
  }
}

let sut: EmailValidation;
let emailValidatorStub: EmailValidator;

describe('Email Validation', () => {
  beforeEach(() => {
    emailValidatorStub = new EmailValidatorStub();
    sut = new EmailValidation(emailValidatorStub, 'email');
  });

  test('Should return an error if EmailValidator returns false', async () => {
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const error = sut.validate({ email: 'any_email@mail.com.br' });
    expect(error).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with correct email', async () => {
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    sut.validate({ email: 'any_email@mail.com.br' });
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com.br');
  });

  test('Should throw if email validator throws', async () => {
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce((_: string) => {
        throw new Error();
      });
    expect(sut.validate).toThrow();
  });
});
