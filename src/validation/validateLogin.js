import validator from 'validator'

const validateLogin = data => {
  let errors = {}

  const { email, password } = data

  if (validator.isEmpty(email)) {
    errors.email = 'Email field is required.'
  }

  if (validator.isEmpty(password)) {
    errors.password = 'Password field is required.'
  }

  return {
    isInvalid: Object.keys(errors).length > 0,
    errors: errors
  }
}

export default validateLogin
