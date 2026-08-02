import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PublicRoute({ redirectTo = '/dashboard' }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}