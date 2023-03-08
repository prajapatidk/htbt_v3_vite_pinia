export const BASE_URL = 'http://localhost:7788'
export const TOKEN = 'token'

export const avoidHeader = {
  headers: {
    authorization: null
  }
}

export const msgType = {
  success: 'success',
  failed: 'failed'
}

export const confirmationMsg = {
  delete: 'Do you really want to remove this record',
  release: 'Do you really want to release the device',
  restore: 'Do you really want to restore the device'
}

export const team = [
  'Hios',
  'HiSecOS',
  'HiLCOS',
  'Provize',
  'Wireless',
  'Grtcomm'
]

export const roles = ['ADMIN', 'USER']

export const mailReg = `/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@incedoinc\.com$/`
