import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowRight } from 'react-icons/fi'
import { AuthSubmitButton } from '../../components/auth/AuthField'

const inputClass =
  'mt-2 w-full rounded-lg border-0 bg-[#FFF4E5] px-4 py-3.5 text-sm text-[var(--primary-text)] outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:ring-[var(--active)]'

/** Step 1 — request reset code via email */
export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const role = params.get('role') || ''
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const loginPath =
    role === 'admin' ? '/admin/login' : role ? `/login/${role}` : '/login'
  const signupPath = role && role !== 'admin' ? `/signup/${role}` : '/signup'

  const onSubmit = (event) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setError(t('auth.forgot.emailRequired'))
      return
    }
    setError('')
    sessionStorage.setItem(
      'forgotPassword',
      JSON.stringify({ email: trimmed, role }),
    )
    navigate('/forgot-password/otp')
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {t('auth.forgot.title')}
        </h1>
        <p className="mt-2 text-sm text-[var(--secondary-text)] sm:text-base">
          {t('auth.forgot.subtitle')}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <label className="block">
          <span className="text-sm font-semibold text-[var(--primary-text)]">
            {t('auth.forgot.emailLabel')}
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>

        {error ? (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        <AuthSubmitButton>
          {t('auth.forgot.sendCode')}
          <FiArrowRight className="size-5" strokeWidth={2.25} aria-hidden />
        </AuthSubmitButton>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-[var(--secondary-text)]">
        <p>
          {t('auth.alreadyHaveAccount')}{' '}
          <Link
            to={loginPath}
            className="font-semibold text-[var(--active)] hover:underline"
          >
            {t('header.logIn')}
          </Link>
        </p>
        <p>
          {t('auth.forgot.newTo')}{' '}
          <Link
            to={signupPath}
            className="font-semibold text-[var(--active)] hover:underline"
          >
            {t('auth.forgot.createAccount')}
          </Link>
        </p>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-[var(--secondary-text)]">
        {t('auth.forgot.needHelp')}{' '}
        <Link
          to="/support"
          className="font-semibold text-[var(--primary-text)] hover:underline"
        >
          {t('auth.forgot.contactSupport')}
        </Link>{' '}
        {t('auth.forgot.assist')}
      </div>
    </div>
  )
}
