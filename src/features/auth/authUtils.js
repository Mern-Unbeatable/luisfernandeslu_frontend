export function parseAuthPayload(payload) {
  const root = payload?.data ?? payload ?? {}
  const user = root.user ?? null
  const profile = root.profile ?? null

  return {
    user:
      user && profile
        ? { ...user, profile }
        : user,
    accessToken: root.accessToken ?? root.token ?? null,
    refreshToken: root.refreshToken ?? null,
  }
}

export function getLoginPathForRole(role) {
  return `/api/auth/login/${role}`
}

export function getRegisterPathForRole(role) {
  return `/api/auth/register/${role}`
}

export const EMAIL_VERIFICATION_KEY = 'emailVerification'
export const FORGOT_PASSWORD_KEY = 'forgotPassword'

export function readForgotPasswordSession() {
  try {
    return JSON.parse(sessionStorage.getItem(FORGOT_PASSWORD_KEY) || 'null')
  } catch {
    return null
  }
}

export function writeForgotPasswordSession(data) {
  sessionStorage.setItem(FORGOT_PASSWORD_KEY, JSON.stringify(data))
}

export function clearForgotPasswordSession() {
  sessionStorage.removeItem(FORGOT_PASSWORD_KEY)
}

export function readEmailVerificationSession() {
  try {
    return JSON.parse(sessionStorage.getItem(EMAIL_VERIFICATION_KEY) || 'null')
  } catch {
    return null
  }
}

export function writeEmailVerificationSession(data) {
  sessionStorage.setItem(EMAIL_VERIFICATION_KEY, JSON.stringify(data))
}

export function clearEmailVerificationSession() {
  sessionStorage.removeItem(EMAIL_VERIFICATION_KEY)
}

const SUPPLIER_FILE_FIELDS = [
  'companyCertificate',
  'rcbe',
  'ibanProof',
  'idDocuments',
  'addressProof',
]

const FACTORY_FILE_FIELDS = [
  'factoryCertificate',
  'rcbe',
  'ibanProof',
  'idDocuments',
  'addressProof',
]

function appendRegisterFiles(formData, fieldName, files) {
  if (!Array.isArray(files)) return
  for (const file of files) {
    if (file instanceof File) {
      formData.append(fieldName, file)
    }
  }
}

function buildRoleMultipartFormData(values, { entityField, entityKey, fileFields }) {
  const formData = new FormData()
  formData.append(entityKey, values[entityField]?.trim() ?? '')
  formData.append('email', values.email?.trim() ?? '')
  formData.append('phone', values.phone?.trim() ?? '')
  formData.append('iban', values.iban?.trim() ?? '')
  formData.append('password', values.password ?? '')
  formData.append(
    'confirmPassword',
    values.confirmPassword?.trim() || values.password || '',
  )

  for (const fieldName of fileFields) {
    appendRegisterFiles(formData, fieldName, values[fieldName])
  }

  return formData
}

function buildSupplierRegisterFormData(values) {
  return buildRoleMultipartFormData(values, {
    entityField: 'companyName',
    entityKey: 'companyName',
    fileFields: SUPPLIER_FILE_FIELDS,
  })
}

function buildFactoryRegisterFormData(values) {
  return buildRoleMultipartFormData(values, {
    entityField: 'factoryName',
    entityKey: 'factoryName',
    fileFields: FACTORY_FILE_FIELDS,
  })
}

function buildTransporterRegisterFormData(values) {
  const formData = new FormData()
  formData.append('fullName', values.fullName?.trim() ?? '')
  formData.append('email', values.email?.trim() ?? '')
  formData.append('phone', values.phone?.trim() ?? '')
  formData.append('iban', values.iban?.trim() ?? '')
  formData.append('password', values.password ?? '')
  formData.append(
    'confirmPassword',
    values.confirmPassword?.trim() || values.password || '',
  )

  appendRegisterFiles(formData, 'ibanProof', values.ibanProof)
  appendRegisterFiles(formData, 'civilLiability', values.civilLiability)
  appendRegisterFiles(formData, 'transporterCivilLiability', values.transporterCivilLiability)

  return formData
}

function buildAffiliateRegisterFormData(values) {
  const formData = new FormData()
  formData.append('fullName', values.fullName?.trim() ?? '')
  formData.append('email', values.email?.trim() ?? '')
  formData.append('phone', values.phone?.trim() ?? '')
  formData.append('iban', values.iban?.trim() ?? '')
  formData.append('password', values.password ?? '')
  formData.append('affiliateCode', values.affiliateCode?.trim() ?? '')
  appendRegisterFiles(formData, 'ibanProof', values.ibanProof)
  return formData
}

export function buildRegisterPayload(role, values) {
  switch (role) {
    case 'customer':
      return {
        fullName: values.fullName?.trim() ?? '',
        email: values.email?.trim() ?? '',
        password: values.password ?? '',
      }
    case 'company':
      return {
        companyName: values.companyName?.trim() ?? '',
        email: values.email?.trim() ?? '',
        nif: values.nif?.trim() ?? '',
        password: values.password ?? '',
        referenceCode: values.referenceCode?.trim() ?? '',
      }
    case 'supplier':
      return buildSupplierRegisterFormData(values)
    case 'factory':
      return buildFactoryRegisterFormData(values)
    case 'transporter':
      return buildTransporterRegisterFormData(values)
    case 'affiliate':
      return buildAffiliateRegisterFormData(values)
    default:
      return values
  }
}

export function getAuthErrorMessage(error, fallback = 'Something went wrong') {
  if (!error) return fallback

  const payload =
    (typeof error.data === 'object' && error.data !== null && error.data) ||
    (typeof error === 'object' && error !== null && error) ||
    null

  if (!payload) {
    return typeof error === 'string' ? error : fallback
  }

  if (typeof payload === 'string') return payload

  if (payload.message) return payload.message

  if (typeof payload.error === 'string') return payload.error

  return fallback
}

export const API_LOGIN_ROLES = new Set([
  'customer',
  'company',
  'supplier',
  'factory',
  'transporter',
  'affiliate',
  'admin',
])

export const API_REGISTER_ROLES = new Set([
  'customer',
  'company',
  'supplier',
  'factory',
  'transporter',
  'affiliate',
])
