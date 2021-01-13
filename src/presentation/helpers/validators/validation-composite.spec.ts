import { MissingParamError } from '../../errors';
import { IValidation } from './validation';
import { ValidationComposite } from './validation-composite';

const makeValidationStub = () => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return new MissingParamError('field');
    }
  }

  return new ValidationStub();
};

const validationStub = makeValidationStub();

const makeSut = () => new ValidationComposite([validationStub]);

describe('ValidationComposite', () => {
  it('Should return an error if any validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
