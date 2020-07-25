import { EmailValidatorAdapter } from './email-validator'
import { EmailValidator } from '../presentation/protocols/email-validator'
import validator from 'validator'

let emailValidatorAdapter: EmailValidator

jest.mock('validator', () => ({
  isEmail: () => true
}))

describe('EmailValidator adapter', () => {
  beforeEach(() => {
    emailValidatorAdapter = new EmailValidatorAdapter()
  })

  it('Should return false if validator returns false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = emailValidatorAdapter.isValid('invalid_email@mail.com')

    expect(isValid).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const isValid = emailValidatorAdapter.isValid('valid_email@mail.com')

    expect(isValid).toBe(true)
  })
})
