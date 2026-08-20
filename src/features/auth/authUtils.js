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
