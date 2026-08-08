import { useTranslation } from 'react-i18next'
import { FiMessageSquare, FiTruck } from 'react-icons/fi'

export default function DriverContactCard({
  driver,
  onChat,
  className = '',
}) {
  const { t } = useTranslation()
  if (!driver) return null

  return (
    <div
      className={`rounded-lg border border-sky-100 bg-sky-50/80 p-4 sm:p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <FiTruck className="size-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-[var(--primary-text)]">
              {driver.name}
            </p>
            {driver.vehicle ? (
              <p className="text-sm text-[var(--secondary-text)]">
                {driver.vehicle}
              </p>
            ) : null}
            {driver.phone ? (
              <p className="mt-1 text-sm text-[var(--secondary-text)]">
                {driver.phone}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChat?.(driver)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--active)] px-4 py-1.5 text-xs font-semibold text-white hover:brightness-95"
        >
          <FiMessageSquare className="size-3.5" aria-hidden />
          {t('buyerOrderDetail.chat')}
        </button>
      </div>
    </div>
  )
}
