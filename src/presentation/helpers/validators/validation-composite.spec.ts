import { MissingParamError } from '../../errors';
import { IValidation } from '../../protocols/validation';
import { ValidationComposite } from './validation-composite';

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: IValidation[];
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
  const validationStubs = [
    makeValidationStub(),
    makeValidationStub(),
    makeValidationStub(),
  ];

  return {
    sut: new ValidationComposite(validationStubs),
    validationStubs,
  };
};

describe('ValidationComposite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());

    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new Error());
  });

  it('Should not return an error if validation succeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
