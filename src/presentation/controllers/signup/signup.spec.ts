import SignUpController from './signup';
import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '../../errors/index';
import {
  AddAccountModel,
  AddAccount,
  AccountModel,
  EmailValidator,
} from './signup-protocols';

let signUpController: SignUpController;
let emailValidatorStub: EmailValidator;
let addAccountStub: AddAccount;

class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true;
  }
}

class AddAccountStub implements AddAccount {
  async add(account: AddAccountModel): Promise<AccountModel> {
    return Promise.resolve({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com.br',
      password: 'valid_password',
    });
  }
}

describe('SignUp Controller', () => {
  beforeEach(() => {
    emailValidatorStub = new EmailValidatorStub();
    addAccountStub = new AddAccountStub();
    signUpController = new SignUpController(emailValidatorStub, addAccountStub);
  });

  test('Should return 400 if no name is provided', async () => {
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', async () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', async () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
      },
    };
    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });

  test('Should return 400 if an invalid email is provided', async () => {
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should return 400 if password confirmation fails', async () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };
    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });

  test('Should call EmailValidator with correct email', async () => {
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await signUpController.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com.br');
  });

  test('Should return 500 if email validator throws', async () => {
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce((email: string) => {
        throw new Error();
      });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toBeInstanceOf(ServerError);
  });

  test('Should call AddAccount with correct values', async () => {
    const addApy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await signUpController.handle(httpRequest);

    expect(addApy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com.br',
      password: 'any_password',
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce((account: AddAccountModel) => {
        throw new Error();
      });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toBeInstanceOf(ServerError);
  });

  test('Should return 200 valid data is provided', async () => {
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com.br',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };
    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com.br',
      password: 'valid_password',
    });
  });
});
