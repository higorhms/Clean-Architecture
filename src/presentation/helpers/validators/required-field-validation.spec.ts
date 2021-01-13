import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredFieldValidation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field');

    const error = sut.validate({});

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('Should not return a MissingParamError if validation succeds', () => {
    const sut = new RequiredFieldValidation('field');

    const error = sut.validate({ field: 'any_data' });

    expect(error).toBeFalsy();
  });
});
