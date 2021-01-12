import { InvalidParamError, MissingParamError } from '../../errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  IAuthentication,
} from './login-protocols';

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: IAuthentication,
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password } = httpRequest.body;

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) return badRequest(new InvalidParamError('email'));

      const token = await this.authentication.auth(email, password);

      if (!token) return unauthorized();

      return ok({ accessToken: token });
    } catch (error) {
      return serverError(error);
    }
  }
}
