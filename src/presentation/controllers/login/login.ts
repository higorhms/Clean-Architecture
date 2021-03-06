import { InvalidParamError, MissingParamError } from '../../errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http/http-helper';
import { IValidation } from '../signup/signup-protocols';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  IAuthentication,
} from './login-protocols';

export class LoginController implements Controller {
  constructor(
    private readonly validation: IValidation,
    private readonly authentication: IAuthentication,
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) return badRequest(error);

      const { email, password } = httpRequest.body;

      const token = await this.authentication.auth({ email, password });

      if (!token) return unauthorized();

      return ok({ accessToken: token });
    } catch (error) {
      return serverError(error);
    }
  }
}
