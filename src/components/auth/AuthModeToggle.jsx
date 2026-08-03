import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/** Compact Login | Sign Up pill — matches marketing auth designs */
export default function AuthModeToggle({ role, mode }) {
  const { t } = useTranslation()
  const tab =
    'rounded-full px-7 py-2.5 text-center text-sm font-semibold transition-colors'

  return (
    <div className="mb-8 inline-flex rounded-full bg-[#FFF4E5] p-1">
      <Link
        to={`/login/${role}`}
        className={`${tab} ${
          mode === 'login'
            ? 'bg-[var(--active)] text-white'
            : 'text-[var(--primary-text)] hover:text-[var(--active)]'
        }`}
      >
        {t('auth.loginTab')}
      </Link>
      <Link
        to={`/signup/${role}`}
        className={`${tab} ${
          mode === 'register'
            ? 'bg-[var(--active)] text-white'
            : 'text-[var(--primary-text)] hover:text-[var(--active)]'
        }`}
      >
        {t('auth.signUpTab')}
      </Link>
    </div>
  )
}
