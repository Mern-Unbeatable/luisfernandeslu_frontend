import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthSubmitButton } from '../../components/auth/AuthField'

const OTP_LENGTH = 5

function readForgotSession() {
  try {
    return JSON.parse(sessionStorage.getItem('forgotPassword') || 'null')
  } catch {
    return null
  }
}

/** Step 2 — enter email OTP */
export default function OtpVerificationPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const session = readForgotSession()
  const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [resendHint, setResendHint] = useState('')
  const inputsRef = useRef([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  if (!session?.email) {
    return <Navigate to="/forgot-password" replace />
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

  const onSubmit = (event) => {
    event.preventDefault()
    const code = digits.join('')
    if (code.length !== OTP_LENGTH) {
      setError(t('auth.forgot.otpIncomplete'))
      return
    }
    setError('')
    sessionStorage.setItem(
      'forgotPassword',
      JSON.stringify({ ...session, otpVerified: true }),
    )
    navigate('/forgot-password/reset')
  }

  const onResend = () => {
    setDigits(Array(OTP_LENGTH).fill(''))
    setError('')
    setResendHint(t('auth.forgot.otpResent'))
    inputsRef.current[0]?.focus()
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {t('auth.forgot.otpTitle')}
        </h1>
        <p className="mt-2 text-sm text-[var(--secondary-text)] sm:text-base">
          {t('auth.forgot.otpSubtitle')}
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

        <AuthSubmitButton>{t('auth.forgot.verify')}</AuthSubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--secondary-text)]">
        {t('auth.forgot.noCode')}{' '}
        <button
          type="button"
          onClick={onResend}
          className="font-semibold text-[var(--active)] hover:underline"
        >
          {t('auth.forgot.resend')}
        </button>
      </p>

      <p className="mt-4 text-center text-sm">
        <Link
          to="/forgot-password"
          className="font-medium text-[var(--secondary-text)] hover:text-[var(--active)] hover:underline"
        >
          {t('auth.forgot.changeEmail')}
        </Link>
      </p>
    </div>
  )
}
