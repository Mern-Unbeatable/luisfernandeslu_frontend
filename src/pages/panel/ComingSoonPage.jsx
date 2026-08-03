import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/** Placeholder for panel routes until real screens exist. */
export default function ComingSoonPage({ titleKey }) {
  const { t } = useTranslation()
  const { roleConfig } = useOutletContext() || {}
  const resolvedTitle = titleKey
    ? t(titleKey)
    : t('panel.nav.dashboard')

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
      <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
        {resolvedTitle}
      </h1>
      <p className="mt-3 text-sm text-[var(--secondary-text)] sm:text-base">
        {t('panel.comingSoon')}
      </p>
      {roleConfig?.id ? (
        <p className="mt-1 text-xs text-gray-400">
          {t(roleConfig.labelKey)}
        </p>
      ) : null}
    </div>
  )
}
