import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/** Terms / Privacy footer used on affiliate auth */
export default function AuthLegalNote() {
  const { t } = useTranslation()
  return (
    <p className="mt-6 text-center text-xs leading-relaxed text-(--secondary-text)">
      {t('auth.legal.prefix')}{' '}
      <Link
        to="/terms"
        className="font-medium text-(--active) hover:underline"
      >
        {t('auth.legal.terms')}
      </Link>{' '}
      {t('auth.legal.and')}{' '}
      <Link
        to="/privacy"
        className="font-medium text-(--active) hover:underline"
      >
        {t('auth.legal.privacy')}
      </Link>
      .
    </p>
  )
}
