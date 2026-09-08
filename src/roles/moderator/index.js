import {
  buildStaffNav,
  filterStaffNav,
  getStaffHomePath,
  isStaffPathAllowed,
} from '../staffNav'

const moderatorRole = {
  id: 'moderator',
  labelKey: 'panel.roles.moderator',
  basePath: '/moderator',
  nav: buildStaffNav('/moderator', { includeAdminOnly: false }),
}

export function filterModeratorNav(nav = [], user) {
  return filterStaffNav(nav, user, { moderatorOnly: true })
}

export function getModeratorHomePath(user) {
  const items = filterModeratorNav(moderatorRole.nav, user)
  return getStaffHomePath(items, '/moderator/profile')
}

export function isModeratorPathAllowed(pathname, user) {
  const items = filterModeratorNav(moderatorRole.nav, user)
  const path = String(pathname || '').replace(/\/$/, '') || '/moderator'
  return isStaffPathAllowed(path, items)
}

export default moderatorRole
