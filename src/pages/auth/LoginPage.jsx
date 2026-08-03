import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setCredentials } from '../../features/auth/authSlice'
import {
  DEMO_USERS,
  findDemoUser,
  getHomePathForRole,
} from '../../features/auth/demoUsers'

const inputClass =
  'mt-1.5 w-full rounded-lg border-0 bg-[#FFF4E5] px-4 py-3 text-sm text-[var(--primary-text)] outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:ring-[var(--active)]'

function GoogleIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  )
}

function FacebookIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
    >
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.32 20.06v-6.5h2.18l.33-2.54h-2.51v-1.62c0-.74.2-1.24 1.26-1.24h1.35V5.9c-.23-.03-1.04-.1-1.97-.1-1.95 0-3.29 1.19-3.29 3.38v1.89H8.68v2.54h2.19v6.5h2.45Z"
      />
    </svg>
  )
}

/** Login form — /login */
export default function LoginPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const roleHint = params.get('role') || ''
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const applyDemo = (user) => {
    setEmail(user.email)
    setPassword(user.password)
    setError('')
    completeLogin(user)
  }

  const completeLogin = (demoUser) => {
    dispatch(
      setCredentials({
        user: {
          id: demoUser.role,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
        },
        accessToken: `demo-token-${demoUser.role}`,
        refreshToken: `demo-refresh-${demoUser.role}`,
      }),
    )
    navigate(getHomePathForRole(demoUser.role), { replace: true })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const demoUser = findDemoUser(email, password)
    if (!demoUser) {
      setError(t('auth.invalidCredentials'))
      return
    }
    setError('')
    completeLogin(demoUser)
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {t('auth.loginTitle')}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--secondary-text)] sm:text-base">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="block">
          <span className="text-sm font-medium text-[var(--primary-text)]">
            {t('auth.email')}
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[var(--primary-text)]">
            {t('auth.password')}
          </span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.passwordPlaceholder')}
            className={inputClass}
          />
        </label>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[var(--active)] underline-offset-2 hover:underline"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        {error ? (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[var(--active)] text-base font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t('auth.signIn')}
        </button>
      </form>

      {/* Demo credentials */}
      <div className="mt-6 rounded-xl border border-dashed border-[var(--active)]/40 bg-[#FFFBF5] p-4">
        <p className="text-sm font-semibold text-[var(--primary-text)]">
          {t('auth.demo.title')}
        </p>
        <p className="mt-1 text-xs text-[var(--secondary-text)]">
          {t('auth.demo.hint', { password: DEMO_USERS[0].password })}
        </p>
        <ul className="mt-3 max-h-48 space-y-1.5 overflow-y-auto">
          {DEMO_USERS.map((user) => {
            const highlighted = roleHint === user.role
            return (
              <li key={user.email}>
                <button
                  type="button"
                  onClick={() => applyDemo(user)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                    highlighted
                      ? 'bg-[var(--active)]/15 ring-1 ring-[var(--active)]/40'
                      : 'hover:bg-white'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-[var(--primary-text)]">
                      {t(user.labelKey)}
                    </span>
                    <span className="block truncate text-[var(--secondary-text)]">
                      {user.email}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium text-[var(--active)]">
                    {t('auth.demo.use')}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <p className="mt-5 text-center text-sm text-[var(--secondary-text)]">
        {t('auth.noAccount')}{' '}
        <Link
          to="/signup"
          className="font-semibold text-[var(--active)] hover:underline"
        >
          {t('header.signUp')}
        </Link>
      </p>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-sm text-[var(--secondary-text)]">{t('auth.or')}</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-gray-50"
        >
          <GoogleIcon className="size-5 shrink-0" />
          {t('auth.google')}
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-gray-50"
        >
          <FacebookIcon className="size-5 shrink-0" />
          {t('auth.facebook')}
        </button>
      </div>
    </div>
  )
}
