import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLogoutMutation } from './authApi'

export function getLoginRouteForUser(user) {
  if (user?.role === 'admin') return '/admin/login'
  if (user?.role) return `/login/${user.role}`
  return '/login'
}

export function useAuthLogout() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [logout, { isLoading }] = useLogoutMutation()

  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap()
    } catch {
      // Local session is cleared in the mutation's finally block.
    }

    navigate(getLoginRouteForUser(user), { replace: true })
  }, [logout, navigate, user])

  return { logout: handleLogout, isLoggingOut: isLoading }
}
