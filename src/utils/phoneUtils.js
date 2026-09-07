/** Strip characters that are not valid in a phone number while typing. */
export function sanitizePhoneInput(value) {
  if (value == null || value === '') return ''

  let result = ''
  for (const char of String(value)) {
    if (char >= '0' && char <= '9') {
      result += char
      continue
    }
    if (char === '+' && result.length === 0) {
      result += char
      continue
    }
    if (char === ' ' || char === '-' || char === '(' || char === ')') {
      result += char
    }
  }

  return result
}

export function countPhoneDigits(value) {
  return (String(value || '').match(/\d/g) || []).length
}

/** Validates international-style phone numbers (8–15 digits). */
export function isValidPhone(value, { required = true } = {}) {
  const trimmed = String(value || '').trim()

  if (!trimmed) return !required
  if (!/^\+?[\d\s\-()]+$/.test(trimmed)) return false

  const digits = countPhoneDigits(trimmed)
  return digits >= 8 && digits <= 15
}
