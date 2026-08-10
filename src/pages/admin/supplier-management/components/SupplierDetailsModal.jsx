import { useTranslation } from 'react-i18next'
import { FiFileText, FiX } from 'react-icons/fi'
import SupplierStatusBadge from './SupplierStatusBadge'

function DetailField({ label, value, className = '' }) {
  return (
    <div className={`rounded-lg bg-[#FAF7F2] px-4 py-3 ${className}`}>
      <p className="text-xs font-medium text-[var(--secondary-text)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--primary-text)]">{value}</p>
    </div>
  )
}

function DocumentThumb({ doc }) {
  const toneClass =
    doc.tone === 'blue'
      ? 'from-sky-100 to-sky-200'
      : doc.tone === 'amber'
        ? 'from-amber-100 to-amber-200'
        : 'from-gray-100 to-gray-200'

  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br ${toneClass}`}
    >
      <div className="absolute inset-0 flex items-center justify-center text-[var(--secondary-text)]/40">
        <FiFileText className="size-8" aria-hidden />
      </div>
      {doc.tone === 'blue' ? (
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-sky-500" />
      ) : null}
      {doc.tone === 'amber' ? (
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-500" />
      ) : null}
    </div>
  )
}

export default function SupplierDetailsModal({
  open,
  supplier,
  onClose,
  i18nKey = 'adminSupplierManagement',
  formatRegisteredDate,
}) {
  const { t } = useTranslation()

  if (!open || !supplier) return null

  const formatDate =
    formatRegisteredDate ||
    ((date) => {
      if (!date) return '—'
      const [y, m, d] = date.split('-').map(Number)
      if (!y || !m || !d) return date
      return `${m}/${d}/${y}`
    })

  const titleId = `${i18nKey}-details-title`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label={t(`${i18nKey}.modal.close`)}
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100"
          aria-label={t(`${i18nKey}.modal.close`)}
        >
          <FiX className="size-5" />
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--active)_14%,white)] text-[var(--active)]">
              <FiFileText className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <h2
              id={titleId}
              className="text-lg font-bold text-[var(--primary-text)]"
            >
              {t(`${i18nKey}.modal.title`)}
            </h2>
          </div>
          <p className="text-xs text-[var(--secondary-text)]">
            {t(`${i18nKey}.modal.registeredOn`, {
              date: formatDate(supplier.registered),
            })}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailField
            label={t(`${i18nKey}.columns.name`)}
            value={supplier.name}
            className="sm:col-span-2"
          />
          <DetailField
            label={t(`${i18nKey}.columns.email`)}
            value={supplier.email}
          />
          <DetailField
            label={t(`${i18nKey}.columns.phone`)}
            value={supplier.phone}
          />
          <div className="rounded-lg bg-[#FAF7F2] px-4 py-3 sm:col-span-2">
            <p className="text-xs font-medium text-[var(--secondary-text)]">
              {t(`${i18nKey}.columns.status`)}
            </p>
            <div className="mt-2">
              <SupplierStatusBadge status={supplier.status} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-[var(--primary-text)]">
            {t(`${i18nKey}.modal.documentsTitle`)}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(supplier.documents || []).map((doc) => (
              <DocumentThumb key={doc.id} doc={doc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
