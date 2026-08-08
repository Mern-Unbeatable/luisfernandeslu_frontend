import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getHomePathForRole } from '../../features/auth/demoUsers'

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = '/login',
}) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getHomePathForRole(user?.role)} replace />
  }

  return <Outlet />
}
