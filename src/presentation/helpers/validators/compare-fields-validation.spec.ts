import { InvalidParamError } from '../../errors';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (): CompareFieldsValidation =>
  new CompareFieldsValidation('field', 'fieldToCompare');

describe('CompareFieldsValidation', () => {
  it('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'any',
      fieldToCompare: 'any_value',
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  it('Should not return if validation succeds', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });

    expect(error).toBeFalsy();
  });
});
