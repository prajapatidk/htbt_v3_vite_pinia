import validator from 'validator'

const validateResource = data => {
  let errors = {}

  const { name, ipAddress, type } = data

  if (validator.isEmpty(name)) {
    errors.name = 'Name field is required.'
  }

  if (validator.isEmpty(ipAddress)) {
    errors.ipAddress = 'Please enter a valid IP address.'
  }

  if (validator.isEmpty(type)) {
    errors.type = 'Resource type is required.'
  }

  return {
    isInvalid: Object.keys(errors).length > 0,
    errors: errors
  }
}

export default validateResource
