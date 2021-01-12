import { IValidation } from './validation';

export class ValidationComposite implements IValidation {
  constructor(private readonly validations: IValidation[]) {}

  public validate(input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input);

      if (error) return error;
    }

    return null;
  }
}
