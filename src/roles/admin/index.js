import {
  buildStaffNav,
  filterStaffNav,
  getStaffHomePath,
  isStaffPathAllowed,
} from '../staffNav'

const adminRole = {
  id: 'admin',
  labelKey: 'panel.roles.admin',
  basePath: '/admin',
  nav: buildStaffNav('/admin', { includeAdminOnly: true }),
}

export function filterAdminNav(nav = [], user) {
  return filterStaffNav(nav, user, { moderatorOnly: false })
}

export function getAdminHomePath(user) {
  const items = filterAdminNav(adminRole.nav, user)
  return getStaffHomePath(items, '/admin/profile')
}

export function isAdminPathAllowed(pathname, user) {
  const items = filterAdminNav(adminRole.nav, user)
  const path = String(pathname || '').replace(/\/$/, '') || '/admin'
  return isStaffPathAllowed(path, items)
}

export default adminRole
