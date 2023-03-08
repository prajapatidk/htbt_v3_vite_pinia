import validator from 'validator'

const validateResource = data => {
  let errors = {}

  const { name, type, ipAddress, console, mgmtport, model } = data

  if (validator.isEmpty(name)) {
    errors.name = 'Name is required.'
  }

  if (validator.isEmpty(type)) {
    errors.type = 'Resource type is required.'
  }

  if (validator.isEmpty(ipAddress)) {
    errors.ipAddress = 'Please enter a valid IP address.'
  }

  if (validator.isEmpty(console)) {
    errors.console = 'Console is required.'
  }

  if (validator.isEmpty(mgmtport)) {
    errors.mgmtport = 'MGMT Port is required.'
  }

  if (validator.isEmpty(model)) {
    errors.model = 'Model is required.'
  }

  return {
    isInvalid: Object.keys(errors).length > 0,
    errors: errors
  }
}

export default validateResource
