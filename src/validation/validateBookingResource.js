import validator from 'validator'

const validateBookingResource = bookform => {
  let errors = {}

  const { dateIn, dateOut, team, description } = bookform

  if (validator.isEmpty(dateIn)) {
    errors.dateIn = 'Please select booking date.'
  }

  if (validator.isEmpty(dateOut)) {
    errors.dateOut = 'Please select release date.'
  }

  if (validator.isEmpty(team)) {
    errors.team = 'Please select the team.'
  }

  if (validator.isEmpty(description)) {
    errors.description = 'Description select the team.'
  }

  return {
    isInvalid: Object.keys(errors).length > 0,
    errors: errors
  }
}

export default validateBookingResource
