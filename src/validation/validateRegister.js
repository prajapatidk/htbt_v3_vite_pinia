import validator from 'validator'

const validateRegister = data => {
  let errors = {}

  const { username, email, password, confirmPassword } = data

  if (validator.isEmpty(username)) {
    errors.username = 'Name field is required.'
  }

  // if (validator.isEmpty(email)) {
  //   errors.email = 'Email field is required.'
  // }

  // if (!validator.isEmail(email)) {
  //   errors.email = 'Please enter a valid email address.'
  // }

  if (validator.isEmpty(password)) {
    errors.password = 'Password field is required.'
  }

  if (validator.isEmpty(confirmPassword)) {
    errors.confirmPassword = 'Confirm password field is required.'
  }

  if (!validator.equals(password, confirmPassword)) {
    errors.confirmPassword = 'Confirm password is not matched'
  }

  return {
    isInvalid: Object.keys(errors).length > 0,
    errors: errors
  }
}

export default validateRegister
