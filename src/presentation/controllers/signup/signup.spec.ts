import SignUpController from './signup';
import { MissingParamError, ServerError } from '../../errors/index';
import {
  AddAccountModel,
  AddAccount,
  AccountModel,
  IValidation,
} from './signup-protocols';
import { badRequest } from '../../helpers/http-helper';

let signUpController: SignUpController;
let addAccountStub: AddAccount;
let validationStub: IValidation;

class ValidationStub implements IValidation {
  validate(input: any): Error {
    return null;
  }
}

class AddAccountStub implements AddAccount {
  async add(_: AddAccountModel): Promise<AccountModel> {
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
    addAccountStub = new AddAccountStub();
    validationStub = new ValidationStub();
    signUpController = new SignUpController(addAccountStub, validationStub);
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
      .mockImplementationOnce((_: AddAccountModel) => {
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
    expect(httpResponse.body).toEqual(new ServerError(null));
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

  test('Should call Validation with correct values', async () => {
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await signUpController.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns an Error', async () => {
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com.br',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    const httpResponse = await signUpController.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });
});
