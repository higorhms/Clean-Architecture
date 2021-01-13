import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation('field');

describe('RequiredFieldValidation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({});

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('Should not return a MissingParamError if validation succeds', () => {
    const sut = makeSut();

    const error = sut.validate({ field: 'any_data' });

    expect(error).toBeFalsy();
  });
});
