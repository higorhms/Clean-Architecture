import { InvalidParamError } from '../../errors';
import { EmailValidator } from '../../protocols/email-validator';
import { IValidation } from '../../protocols/validation';

export class EmailValidation implements IValidation {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly fieldName: string,
  ) {}

  public validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isValid) return new InvalidParamError(this.fieldName);

    return null;
  }
}
