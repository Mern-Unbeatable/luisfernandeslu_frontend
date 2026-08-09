import { useTranslation } from 'react-i18next'

export default function MarketingBoostMeta({ boostTier, duration }) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-2 gap-2 border-t border-gray-100 bg-white px-3.5 py-2.5 text-center">
      <div>
        <p className="text-[10px] font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
          {t('adminMarketingManagement.boostTier')}
        </p>
        <p className="mt-0.5 text-sm font-bold text-[var(--primary-text)]">
          {boostTier}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
          {t('adminMarketingManagement.duration')}
        </p>
        <p className="mt-0.5 text-sm font-bold text-[var(--primary-text)]">
          {duration}
        </p>
      </div>
    </div>
  )
}
