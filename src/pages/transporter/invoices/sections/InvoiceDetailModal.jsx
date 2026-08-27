import { useTranslation } from 'react-i18next'
import { FiDownload, FiX } from 'react-icons/fi'

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-semibold text-gray-800">
        {value || '—'}
      </span>
    </div>
  )
}

export default function InvoiceDetailModal({
  isOpen,
  onClose,
  invoice,
  isLoading = false,
  isError = false,
  errorMessage = '',
  onDownload,
  isDownloading = false,
}) {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl bg-white shadow-xl duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            {t('transporterInvoices.detailTitle', {
              defaultValue: 'Invoice Details',
            })}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label={t('transporterInvoices.close', { defaultValue: 'Close' })}
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading invoice…</p>
          ) : null}

          {isError ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}

          {!isLoading && !isError && invoice ? (
            <div>
              <DetailRow
                label={t('transporterInvoices.columns.invoiceId')}
                value={invoice.invoiceId}
              />
              <DetailRow
                label={t('transporterInvoices.columns.type')}
                value={invoice.type}
              />
              <DetailRow
                label={t('transporterInvoices.columns.orderId')}
                value={invoice.orderId}
              />
              <DetailRow
                label={t('transporterInvoices.columns.customer')}
                value={invoice.customer}
              />
              <DetailRow
                label={t('transporterInvoices.columns.amount')}
                value={invoice.amount}
              />
              <DetailRow
                label={t('transporterInvoices.columns.date')}
                value={invoice.date}
              />
              <DetailRow
                label={t('transporterInvoices.orderTotal', {
                  defaultValue: 'Order Total',
                })}
                value={invoice.orderTotal}
              />
              <DetailRow
                label={t('transporterInvoices.commissionPercent', {
                  defaultValue: 'Commission',
                })}
                value={invoice.commissionPercent}
              />
              <DetailRow
                label={t('transporterInvoices.partyPayout', {
                  defaultValue: 'Party Payout',
                })}
                value={invoice.partyPayout}
              />
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            {t('transporterInvoices.close', { defaultValue: 'Close' })}
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading || !invoice}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--active)] px-4 py-2 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60"
          >
            <FiDownload className="size-4" />
            {t('transporterInvoices.downloadInvoice')}
          </button>
        </div>
      </div>
    </div>
  )
}
