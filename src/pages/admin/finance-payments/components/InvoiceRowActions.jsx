import { FiDownload, FiEye } from 'react-icons/fi'

export default function InvoiceRowActions({
  viewLabel,
  downloadLabel,
  onView,
  onDownload,
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onView}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-[var(--secondary-text)] transition-colors hover:border-[var(--active)] hover:text-[var(--active)]"
        aria-label={viewLabel}
      >
        <FiEye className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDownload}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-[var(--secondary-text)] transition-colors hover:border-[var(--active)] hover:text-[var(--active)]"
        aria-label={downloadLabel}
      >
        <FiDownload className="h-4 w-4" />
      </button>
    </div>
  )
}
