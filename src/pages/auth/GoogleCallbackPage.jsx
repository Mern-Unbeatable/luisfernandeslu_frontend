import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGoogleExchangeMutation } from '../../features/auth/authApi'
import { getAuthErrorMessage } from '../../features/auth/authUtils'
import { getHomePathForRole } from '../../features/auth/demoUsers'
import PageSkeleton from '../../components/common/Skeleton/PageSkeleton'

const KNOWN_ERRORS = new Set([
  'google_unavailable',
  'role_not_allowed',
  'email_in_use',
  'account_disabled',
  'registered_as_customer',
  'registered_as_company',
  'registered_as_supplier',
  'registered_as_factory',
  'registered_as_transporter',
  'registered_as_affiliate',
])

function readHashParams() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  return {
    code: params.get('code'),
    error: params.get('error'),
    next: params.get('next'),
  }
}

/** Landing page after Google: swaps the one-time code for a normal login. */
export default function GoogleCallbackPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [exchange] = useGoogleExchangeMutation()
  const [params] = useState(readHashParams)
  const [exchangeError, setExchangeError] = useState('')
  const started = useRef(false)

  const { code, error: errorCode, next } = params
  const redirectError =
    errorCode || !code
      ? t(`auth.googleErrors.${KNOWN_ERRORS.has(errorCode) ? errorCode : 'generic'}`)
      : ''
  const error = redirectError || exchangeError

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname)
    if (started.current || !code) return
    started.current = true

    exchange(code)
      .unwrap()
      .then((data) => {
        const role = data?.user?.role
        const safeNext =
          next && next.startsWith('/') && !next.startsWith('//') ? next : null
        navigate(safeNext || getHomePathForRole(role), { replace: true })
      })
      .catch((err) => {
        setExchangeError(getAuthErrorMessage(err, t('auth.googleErrors.generic')))
      })
  }, [code, next, exchange, navigate, t])

  if (!error) return <PageSkeleton />

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="max-w-md text-sm text-red-600">{error}</p>
      <Link
        to="/login"
        className="mt-4 text-sm font-bold text-[var(--active)] hover:underline"
      >
        {t('auth.googleBackToLogin')}
      </Link>
    </div>
  )
}
