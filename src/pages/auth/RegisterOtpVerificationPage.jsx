import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { AuthSubmitButton } from '../../components/auth/AuthField'
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from '../../features/auth/authApi'
import {
  clearEmailVerificationSession,
  getAuthErrorMessage,
  readEmailVerificationSession,
  writeEmailVerificationSession,
} from '../../features/auth/authUtils'
import { AUTH_ROLE_IDS } from '../../features/auth/roleAuthConfig'

const OTP_LENGTH = 5

/** Step 2 — verify email OTP after registration */
export default function RegisterOtpVerificationPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { role: roleParam } = useParams()
  const session = readEmailVerificationSession()
  const role = session?.role || roleParam
  const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [resendHint, setResendHint] = useState('')
  const inputsRef = useRef([])
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  if (!role || !AUTH_ROLE_IDS.includes(role)) {
    return <Navigate to="/signup" replace />
  }

  if (!session?.email) {
    return <Navigate to={`/signup/${role}`} replace state={location.state} />
  }

  const setDigitAt = (index, value) => {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    if (char && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const onKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const onPaste = (event) => {
    event.preventDefault()
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((ch, i) => {
      next[i] = ch
    })
    setDigits(next)
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const code = digits.join('')
    if (code.length !== OTP_LENGTH) {
      setError(t('auth.forgot.otpIncomplete'))
      return
    }

    setError('')
    setResendHint('')

    try {
      const data = await verifyOtp({
        email: session.email,
        otp: code,
        role,
      }).unwrap()

      if (data?.success === false) {
        setError(getAuthErrorMessage(data, t('auth.register.verificationFailed')))
        return
      }

      clearEmailVerificationSession()

      const message =
        data?.message || t('auth.register.verificationSuccess')

      toast.success(message)
      navigate(`/login/${role}`, { replace: true, state: location.state })
    } catch (err) {
      setError(getAuthErrorMessage(err, t('auth.register.verificationFailed')))
    }
  }

  const onResend = async () => {
    setError('')
    setResendHint('')

    try {
      const data = await resendOtp({
        email: session.email,
        role,
      }).unwrap()

      if (data?.success === false) {
        setError(getAuthErrorMessage(data, t('auth.register.resendFailed')))
        return
      }

      writeEmailVerificationSession({
        ...session,
        otpExpiresAt: data?.otpExpiresAt ?? session.otpExpiresAt,
      })
      setDigits(Array(OTP_LENGTH).fill(''))
      setResendHint(data?.message || t('auth.forgot.otpResent'))
      inputsRef.current[0]?.focus()
    } catch (err) {
      setError(getAuthErrorMessage(err, t('auth.register.resendFailed')))
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {t('auth.register.otpTitle')}
        </h1>
        <p className="mt-2 text-sm text-[var(--secondary-text)] sm:text-base">
          {session.message || t('auth.register.otpSubtitle')}
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--primary-text)]">
          {session.email}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex justify-between gap-2 sm:gap-3" onPaste={onPaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              aria-label={t('auth.forgot.otpDigit', { n: index + 1 })}
              onChange={(e) => setDigitAt(index, e.target.value)}
              onKeyDown={(e) => onKeyDown(index, e)}
              className={`size-12 rounded-lg border bg-white text-center text-lg font-semibold text-[var(--primary-text)] outline-none transition sm:size-14 ${
                digit
                  ? 'border-[var(--active)]'
                  : 'border-gray-300 focus:border-[var(--active)]'
              }`}
            />
          ))}
        </div>

        {error ? (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : null}
        {resendHint ? (
          <p className="text-sm text-green-600" role="status">
            {resendHint}
          </p>
        ) : null}

        <AuthSubmitButton disabled={isVerifying} loading={isVerifying}>
          {t('auth.forgot.verify')}
        </AuthSubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--secondary-text)]">
        {t('auth.forgot.noCode')}{' '}
        <button
          type="button"
          onClick={onResend}
          disabled={isResending}
          className="font-semibold text-[var(--active)] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t('auth.forgot.resend')}
        </button>
      </p>

      <p className="mt-4 text-center text-sm">
        <Link
          to={`/signup/${role}`}
          state={location.state}
          className="font-medium text-[var(--secondary-text)] hover:text-[var(--active)] hover:underline"
        >
          {t('auth.register.changeDetails')}
        </Link>
      </p>
    </div>
  )
}
