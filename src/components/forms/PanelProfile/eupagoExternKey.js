/** Same rule as the backend: 4-char groups joined by dashes, e.g. 095c-09ad-5b40-605a-5859. */
const EXTERN_KEY_PATTERN = /^[a-z0-9]{4}(-[a-z0-9]{4}){3,4}$/i

export function isValidEupagoExternKey(value) {
  return EXTERN_KEY_PATTERN.test(String(value || '').trim())
}
