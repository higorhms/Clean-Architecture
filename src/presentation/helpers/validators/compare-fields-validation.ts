import { InvalidParamError } from '../../errors';
import { IValidation } from './validation';

interface ICompareFieldsRequest {
  field: string;
  fieldToCompare: string;
}

export class CompareFieldsValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string,
  ) {}

  public validate(input: ICompareFieldsRequest): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
  }
}
