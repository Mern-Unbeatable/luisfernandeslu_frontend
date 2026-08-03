import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getHomePathForRole } from '../../features/auth/demoUsers'

export default function PublicRoute({ redirectTo } = {}) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (isAuthenticated) {
    const target =
      redirectTo || getHomePathForRole(user?.role) || '/'
    return <Navigate to={target} replace />
  }

  return <Outlet />
}
