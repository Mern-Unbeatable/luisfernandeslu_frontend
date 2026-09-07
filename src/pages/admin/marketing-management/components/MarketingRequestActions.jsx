import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

export default function MarketingRequestActions({
  onAccept,
  onReject,
  disabled = false,
}) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-1.5 border-t border-gray-100 px-3.5 py-3">
      <button
        type="button"
        onClick={onAccept}
        disabled={disabled}
        className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md bg-[var(--active)] px-2 py-2 text-xs font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FiCheckCircle className="size-4" aria-hidden />
        {t('adminMarketingManagement.actions.accept')}
      </button>
      <button
        type="button"
        onClick={onReject}
        disabled={disabled}
        className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md bg-red-500 px-2 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FiXCircle className="size-4" aria-hidden />
        {t('adminMarketingManagement.actions.reject')}
      </button>
    </div>
  )
}
