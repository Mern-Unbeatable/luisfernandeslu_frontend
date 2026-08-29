import { useTranslation } from 'react-i18next'
import { FiDownload, FiX } from 'react-icons/fi'

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <span className="text-sm text-[var(--secondary-text)]">{label}</span>
      <span className="text-right text-sm font-semibold text-[var(--primary-text)]">
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
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t('factoryInvoices.detailTitle', {
              defaultValue: 'Invoice Details',
            })}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label={t('factoryInvoices.close', { defaultValue: 'Close' })}
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          {isLoading ? (
            <p className="text-sm text-[var(--secondary-text)]">Loading invoice…</p>
          ) : null}

          {isError ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}

          {!isLoading && !isError && invoice ? (
            <div>
              <DetailRow
                label={t('factoryInvoices.columns.invoiceId')}
                value={invoice.id}
              />
              <DetailRow
                label={t('factoryInvoices.columns.type')}
                value={
                  invoice.type === 'Invoice'
                    ? t('factoryInvoices.typeInvoice')
                    : invoice.type
                }
              />
              <DetailRow
                label={t('factoryInvoices.columns.orderId')}
                value={invoice.orderId}
              />
              <DetailRow
                label={t('factoryInvoices.columns.customer')}
                value={invoice.customer}
              />
              <DetailRow
                label={t('factoryInvoices.columns.amount')}
                value={invoice.amount}
              />
              <DetailRow
                label={t('factoryInvoices.columns.date')}
                value={invoice.date}
              />
              <DetailRow
                label={t('factoryInvoices.orderTotal', {
                  defaultValue: 'Order Total',
                })}
                value={invoice.orderTotal}
              />
              <DetailRow
                label={t('factoryInvoices.commissionPercent', {
                  defaultValue: 'Commission',
                })}
                value={invoice.commissionPercent}
              />
              <DetailRow
                label={t('factoryInvoices.partyPayout', {
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
            {t('factoryInvoices.close', { defaultValue: 'Close' })}
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading || !invoice}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--active)] px-4 py-2 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60"
          >
            <FiDownload className="size-4" />
            {t('factoryInvoices.downloadAria', {
              id: invoice?.id || '',
              defaultValue: 'Download',
            })}
          </button>
        </div>
      </div>
    </div>
  )
}
