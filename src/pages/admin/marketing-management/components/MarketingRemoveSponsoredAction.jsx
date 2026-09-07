import { FiTrash2 } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

export default function MarketingRemoveSponsoredAction({
  onRemove,
  disabled = false,
}) {
  const { t } = useTranslation()

  return (
    <div className="border-t border-gray-100 px-3.5 py-3">
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="flex w-full items-center justify-center gap-1.5 rounded-md bg-red-500 px-2 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FiTrash2 className="size-4" aria-hidden />
        {t('adminMarketingManagement.actions.removeSponsored', {
          defaultValue: 'Remove sponsored',
        })}
      </button>
    </div>
  )
}
