/** Roles / path prefixes that use the Progressive Web App experience. */
export const PWA_PANEL_ROLES = [
  'supplier',
  'factory',
  'transporter',
  'affiliate',
  'admin',
  'moderator',
]

export const PWA_PANEL_PREFIXES = PWA_PANEL_ROLES.map((role) => `/${role}`)

function matchPanelRoleFromAuthPath(pathname) {
  // /login/supplier, /register/factory, /admin/login, /moderator/login
  const loginMatch = pathname.match(/^\/(login|register)\/([^/]+)/i)
  if (loginMatch) {
    const role = String(loginMatch[2] || '').toLowerCase()
    return PWA_PANEL_ROLES.includes(role) ? role : null
  }
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return 'admin'
  }
  if (
    pathname === '/moderator/login' ||
    pathname.startsWith('/moderator/login/')
  ) {
    return 'moderator'
  }
  return null
}

/** Buyer / public experience stays a normal website (no SW / no install). */
export function isPanelPwaPath(pathname = '') {
  const path = String(pathname || '/').split('?')[0]
  if (matchPanelRoleFromAuthPath(path)) return true
  return PWA_PANEL_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  )
}

export function getPanelBasePath(pathname = '') {
  const path = String(pathname || '/').split('?')[0]
  const authRole = matchPanelRoleFromAuthPath(path)
  if (authRole) return `/${authRole}`

  const match = PWA_PANEL_PREFIXES.find(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  )
  return match || '/supplier'
}

export function getPanelRoleLabel(basePath) {
  const map = {
    '/supplier': 'Supplier',
    '/factory': 'Factory',
    '/transporter': 'Transporter',
    '/affiliate': 'Affiliate',
    '/admin': 'Admin',
    '/moderator': 'Moderator',
  }
  return map[basePath] || 'Panel'
}
