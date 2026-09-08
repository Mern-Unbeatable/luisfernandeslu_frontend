import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  getAdminHomePath,
  isAdminPathAllowed,
} from '../../roles/admin'
import {
  getModeratorHomePath,
  isModeratorPathAllowed,
} from '../../roles/moderator'
import { swapStaffBasePath } from '../../roles/staffNav'

/**
 * Keeps full admins on /admin and moderators on /moderator,
 * and enforces enabled module permissions.
 */
export default function StaffAreaGuard({ area = 'admin' }) {
  const location = useLocation()
  const user = useSelector((state) => state.auth.user)

  if (user?.role !== 'admin') {
    return <Outlet />
  }

  // Wait for staff payload (login/getMe)
  if (user.staffRole == null && user.isFullAdmin == null) {
    return <Outlet />
  }

  const isModerator = user.staffRole === 'moderator'

  if (area === 'admin' && isModerator) {
    return (
      <Navigate
        to={swapStaffBasePath(location.pathname, '/admin', '/moderator')}
        replace
      />
    )
  }

  if (area === 'moderator' && !isModerator) {
    return (
      <Navigate
        to={swapStaffBasePath(location.pathname, '/moderator', '/admin')}
        replace
      />
    )
  }

  if (area === 'moderator') {
    if (isModeratorPathAllowed(location.pathname, user)) {
      return <Outlet />
    }
    return <Navigate to={getModeratorHomePath(user)} replace />
  }

  if (isAdminPathAllowed(location.pathname, user)) {
    return <Outlet />
  }

  return <Navigate to={getAdminHomePath(user)} replace />
}
