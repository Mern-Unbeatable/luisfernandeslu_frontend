import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FiFileText, FiCalendar, FiEye, FiDownload } from 'react-icons/fi'
import DataTable from '../../../../components/data-display/DataTable/DataTable'

export default function InvoicesTableSection({
  invoices = [],
  loading = false,
  searchValue = '',
  onSearchChange,
  onView,
  onDownload,
  isDownloading = false,
  pagination,
}) {
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      {
        key: 'invoiceId',
        header: t('transporterInvoices.columns.invoiceId'),
        render: (value) => (
          <span className="flex items-center gap-2 font-medium text-zinc-500">
            <FiFileText className="size-4 text-zinc-400" />
            {value}
          </span>
        ),
      },
      {
        key: 'type',
        header: t('transporterInvoices.columns.type'),
        render: (value) => (
          <span className="inline-flex items-center rounded border border-amber-200/50 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
            {t(`transporterInvoices.types.${String(value).toLowerCase()}`, {
              defaultValue: value,
            })}
          </span>
        ),
      },
      {
        key: 'orderId',
        header: t('transporterInvoices.columns.orderId'),
        render: (value) => (
          <span className="font-semibold text-zinc-800">{value}</span>
        ),
      },
      {
        key: 'customer',
        header: t('transporterInvoices.columns.customer'),
        render: (value) => (
          <span className="font-medium text-zinc-600">{value}</span>
        ),
      },
      {
        key: 'amount',
        header: t('transporterInvoices.columns.amount'),
        render: (value) => (
          <span className="font-bold text-zinc-800">{value}</span>
        ),
      },
      {
        key: 'date',
        header: t('transporterInvoices.columns.date'),
        render: (value) => (
          <span className="flex items-center gap-2 font-medium text-zinc-500">
            <FiCalendar className="size-4 text-zinc-400" />
            {value}
          </span>
        ),
      },
      {
        key: 'actions',
        header: t('transporterInvoices.columns.actions'),
        render: (_value, row) => (
          <div className="flex items-center gap-3 text-zinc-400">
            <button
              type="button"
              onClick={() => onView?.(row)}
              className="transition-colors hover:text-zinc-600"
              aria-label={t('transporterInvoices.viewInvoice')}
            >
              <FiEye className="size-4.5" />
            </button>
            <button
              type="button"
              onClick={() => onDownload?.(row)}
              disabled={isDownloading}
              className="transition-colors hover:text-zinc-600 disabled:opacity-50"
              aria-label={t('transporterInvoices.downloadInvoice')}
            >
              <FiDownload className="size-4.5" />
            </button>
          </div>
        ),
      },
    ],
    [t, onView, onDownload, isDownloading],
  )

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <DataTable
        showCard={false}
        columns={columns}
        data={invoices}
        loading={loading}
        emptyMessage={t('transporterInvoices.empty', {
          defaultValue: 'No invoices found.',
        })}
        showSearch
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('transporterInvoices.searchPlaceholder', {
          defaultValue: 'Search invoices…',
        })}
        showPagination={Boolean(pagination)}
        pagination={pagination}
      />
    </div>
  )
}
