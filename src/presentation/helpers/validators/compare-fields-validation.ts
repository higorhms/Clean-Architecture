import { InvalidParamError } from '../../errors';
import { IValidation } from './validation';

export class CompareFieldsValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string,
  ) {}

  public validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
  }
}
