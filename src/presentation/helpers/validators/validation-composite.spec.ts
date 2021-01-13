import { MissingParamError } from '../../errors';
import { IValidation } from './validation';
import { ValidationComposite } from './validation-composite';

interface SutTypes {
  sut: ValidationComposite;
  validationStub: IValidation;
}

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub();

  return {
    sut: new ValidationComposite([validationStub]),
    validationStub,
  };
};

describe('ValidationComposite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
