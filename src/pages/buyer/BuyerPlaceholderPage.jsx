import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/** Placeholder for buyer account sub-pages until real screens exist. */
export default function BuyerPlaceholderPage({ titleKey, title }) {
  const { t } = useTranslation()
  const { userName } = useOutletContext() || {}
  const resolvedTitle = titleKey ? t(titleKey) : title

  return (
    <div className="rounded-sm border border-gray-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-[var(--primary-text)]">
        {resolvedTitle}
      </h2>
      <p className="mt-2 text-sm text-[var(--secondary-text)]">
        {userName ? `${userName} — ` : ''}
        {t('buyer.placeholderComingSoon', { title: resolvedTitle })}
      </p>
    </div>
  )
}
