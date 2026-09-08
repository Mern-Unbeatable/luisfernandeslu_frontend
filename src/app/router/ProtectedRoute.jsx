import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getHomePathForRole } from '../../features/auth/demoUsers'

const BLOCKED_STATUSES = ['BLOCKED']

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = '/login',
}) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getHomePathForRole(user?.role)} replace />
  }

  if (BLOCKED_STATUSES.includes(user?.status)) {
    return <Navigate to="/account-suspended" replace />
  }

  // For SUSPENDED users, only allow access to overview/dashboard page
  if (user?.status === 'SUSPENDED') {
    const roleHome = getHomePathForRole(user?.role)
    const isOverviewPage = location.pathname === roleHome || location.pathname === `${roleHome}/`
    if (!isOverviewPage) {
      return <Navigate to={roleHome} replace />
    }
  }

  return <Outlet />
}
