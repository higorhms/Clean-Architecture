import { EmailValidatorAdapter } from './email-validator'
import { EmailValidator } from '../presentation/protocols/email-validator'

let emailValidatorAdapter: EmailValidator

describe('EmailValidator adapter', () => {
  beforeEach(() => {
    emailValidatorAdapter = new EmailValidatorAdapter()
  })

  it('Should return false if validator returns false', () => {
    const isValid = emailValidatorAdapter.isValid('invalid_email@mail.com')

    expect(isValid).toBe(false)
  })
})
