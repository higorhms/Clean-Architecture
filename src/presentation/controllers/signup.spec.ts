import SignUpController from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'

let signUpController: SignUpController
let emailValidatorStub: EmailValidator

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

describe('SignUp Controller', () => {
  beforeEach(() => {
    emailValidatorStub = new EmailValidatorStub()
    signUpController = new SignUpController(emailValidatorStub)
  })

  test('Should return 400 if no name is provided',() => {
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided',() => {
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided',() => {
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided',() => {
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided',() => {
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email',() => {
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    signUpController.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com.br')
  })

  test('Should return 500 if an email validator throws',() => {
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email: string) => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = signUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
