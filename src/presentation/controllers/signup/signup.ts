import { badRequest, serverError, ok } from '../../helpers/http-helper';
import { IValidation } from '../../helpers/validators/validation';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
} from './signup-protocols';

class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: IValidation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) return badRequest(error);

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}

export default SignUpController;
