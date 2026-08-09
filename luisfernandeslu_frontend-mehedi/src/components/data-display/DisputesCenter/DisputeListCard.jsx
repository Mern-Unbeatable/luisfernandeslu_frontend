import { FiMessageSquare } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'

function disputeStatusLabel(status, t) {
  return t(`disputesCenter.status.${status}`, status)
}

export default function DisputeListCard({ dispute, onSelect, className = '' }) {
  const { t } = useTranslation()
  if (!dispute) return null

  return (
    <button
      type="button"
      onClick={() => onSelect?.(dispute)}
      className={`flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-colors hover:border-[var(--active)] ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-[var(--primary-text)]">
          {t('disputesCenter.idLabel', { id: dispute.displayId })}
        </p>
        <p className="text-xs text-[var(--secondary-text)]">
          {t('disputesCenter.orderMeta', {
            orderId: dispute.orderId,
            date: dispute.orderDate,
          })}
        </p>
      </div>

      <div className="px-4 py-3 sm:px-5">
        <div className="mb-3 flex justify-center">
          <StatusBadge
            status={dispute.status}
            label={disputeStatusLabel(dispute.status, t)}
          />
        </div>
        <p className="text-center text-sm font-bold text-[var(--primary-text)]">
          {dispute.title}
        </p>
        <div className="mt-4 flex gap-3">
          <img
            src={dispute.image}
            alt=""
            className="size-20 shrink-0 rounded-lg object-cover sm:size-24"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--active)]">
              {dispute.highlight}
            </p>
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[var(--secondary-text)]">
              {dispute.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-[#F9FAFB] px-4 py-3 sm:px-5">
        <p className="text-sm text-[var(--secondary-text)]">
          {t('disputesCenter.sellerLabel', { name: dispute.seller })}
        </p>
        <span className="inline-flex items-center gap-1 text-sm text-[var(--secondary-text)]">
          <FiMessageSquare className="size-4" aria-hidden />
          {dispute.messageCount}
        </span>
      </div>
    </button>
  )
}
