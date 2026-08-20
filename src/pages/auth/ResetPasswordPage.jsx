import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi'
import { AuthSubmitButton } from '../../components/auth/AuthField'
import { useResetPasswordMutation } from '../../features/auth/authApi'
import {
  clearForgotPasswordSession,
  getAuthErrorMessage,
  readForgotPasswordSession,
} from '../../features/auth/authUtils'

const inputClass =
  'w-full rounded-lg border-0 bg-[#FFF4E5] py-3.5 pr-11 pl-4 text-sm text-[var(--primary-text)] outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:ring-[var(--active)]'

function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[var(--primary-text)]">
        {label}
      </span>
      <span className="relative mt-2 block">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          autoComplete="new-password"
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-[var(--primary-text)]"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? (
            <FiEyeOff className="size-5" strokeWidth={1.75} />
          ) : (
            <FiEye className="size-5" strokeWidth={1.75} />
          )}
        </button>
      </span>
    </label>
  )
}

/** Step 3 — set a new password */
export default function ResetPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const session = readForgotPasswordSession()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  if (!session?.email || !session?.resetToken) {
    return <Navigate to="/forgot-password" replace />
  }

  const loginPath =
    session.role === 'admin'
      ? '/admin/login'
      : session.role
        ? `/login/${session.role}`
        : '/login'

  const onSubmit = async (event) => {
    event.preventDefault()
    if (password.length < 8) {
      setError(t('auth.forgot.passwordTooShort'))
      return
    }
    if (password !== confirm) {
      setError(t('auth.register.passwordMismatch'))
      return
    }

    setError('')

    try {
      const data = await resetPassword({
        resetToken: session.resetToken,
        password,
        confirmPassword: confirm,
      }).unwrap()

      if (data?.success === false) {
        setError(getAuthErrorMessage(data, t('auth.forgot.resetFailed')))
        return
      }

      clearForgotPasswordSession()
      toast.success(data.message || t('auth.forgot.resetSuccess'))
      navigate(loginPath, { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err, t('auth.forgot.resetFailed')))
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {t('auth.forgot.resetTitle')}
        </h1>
        <p className="mt-2 text-sm text-[var(--secondary-text)] sm:text-base">
          {session.resetMessage || t('auth.forgot.resetSubtitle')}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <PasswordField
          label={t('auth.password')}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.forgot.passwordPh')}
          show={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
        />
        <PasswordField
          label={t('auth.register.confirmPassword')}
          name="confirmPassword"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={t('auth.forgot.passwordPh')}
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
        />

        {error ? (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        <AuthSubmitButton disabled={isLoading}>
          {t('auth.forgot.resetSubmit')}
          <FiArrowRight className="size-5" strokeWidth={2.25} aria-hidden />
        </AuthSubmitButton>
      </form>
    </div>
  )
}
