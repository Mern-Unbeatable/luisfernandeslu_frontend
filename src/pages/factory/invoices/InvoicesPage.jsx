import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiCalendar, FiDownload, FiEye, FiFileText } from 'react-icons/fi'
import DataTable from '@/components/data-display/DataTable/DataTable'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import {
  useDownloadFactoryCommissionInvoicePdfMutation,
  useGetFactoryCommissionInvoiceQuery,
  useGetFactoryCommissionInvoicesQuery,
} from '@/features/factory-invoices/factoryInvoiceApi'
import {
  downloadBlobFile,
  mapFactoryInvoice,
  mapFactoryInvoiceDetails,
} from '@/features/factory-invoices/invoiceMappers'
import InvoiceDetailModal from './InvoiceDetailModal'

const PAGE_SIZE = 7

export default function InvoicesPage() {
  const { t } = useTranslation()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading, isError, error, refetch } =
    useGetFactoryCommissionInvoicesQuery({
      search,
      page,
      limit: PAGE_SIZE,
    })

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useGetFactoryCommissionInvoiceQuery(selectedInvoiceId, {
    skip: !selectedInvoiceId,
  })

  const [downloadPdf, { isLoading: isDownloading }] =
    useDownloadFactoryCommissionInvoicePdfMutation()

  const invoices = useMemo(
    () => (data?.invoices || []).map(mapFactoryInvoice),
    [data?.invoices],
  )

  const selectedInvoice = useMemo(
    () => mapFactoryInvoiceDetails(detailData),
    [detailData],
  )

  const pagination = data?.pagination || {}
  const total = Number(pagination.total) || invoices.length
  const totalPages = Math.max(1, Number(pagination.totalPages) || 1)
  const pageSize = Number(pagination.limit) || PAGE_SIZE

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleDownload = useCallback(
    async (invoiceId) => {
      if (!invoiceId || isDownloading) return
      try {
        const blob = await downloadPdf(invoiceId).unwrap()
        downloadBlobFile(blob, `${invoiceId}.pdf`)
      } catch (err) {
        toast.error(getAuthErrorMessage(err, 'Failed to download invoice'))
      }
    },
    [downloadPdf, isDownloading],
  )

  const columns = useMemo(
    () => [
      {
        key: 'id',
        header: t('factoryInvoices.columns.invoiceId'),
        render: (value) => (
          <span className="inline-flex items-center gap-2 font-medium text-[var(--primary-text)]">
            <FiFileText className="size-4 shrink-0 text-[var(--secondary-text)]" />
            {value}
          </span>
        ),
      },
      {
        key: 'type',
        header: t('factoryInvoices.columns.type'),
        render: (value) => (
          <span className="inline-flex rounded-md border border-[color-mix(in_srgb,var(--active)_45%,white)] bg-[color-mix(in_srgb,var(--active)_12%,white)] px-2.5 py-1 text-xs font-medium text-[var(--active)]">
            {value === 'Invoice' ? t('factoryInvoices.typeInvoice') : value}
          </span>
        ),
      },
      { key: 'orderId', header: t('factoryInvoices.columns.orderId') },
      { key: 'customer', header: t('factoryInvoices.columns.customer') },
      {
        key: 'amount',
        header: t('factoryInvoices.columns.amount'),
        render: (value) => (
          <span className="font-bold text-[var(--primary-text)]">{value}</span>
        ),
      },
      {
        key: 'date',
        header: t('factoryInvoices.columns.date'),
        render: (value) => (
          <span className="inline-flex items-center gap-2 text-[var(--primary-text)]">
            <FiCalendar className="size-4 shrink-0 text-[var(--secondary-text)]" />
            {value}
          </span>
        ),
      },
      {
        key: 'actions',
        header: t('factoryInvoices.columns.actions'),
        render: (_value, row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={t('factoryInvoices.viewAria', { id: row.id })}
              onClick={() => setSelectedInvoiceId(row.id)}
              className="rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
            >
              <FiEye className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t('factoryInvoices.downloadAria', { id: row.id })}
              onClick={() => handleDownload(row.id)}
              disabled={isDownloading}
              className="rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)] disabled:opacity-50"
            >
              <FiDownload className="size-4" />
            </button>
          </div>
        ),
      },
    ],
    [t, handleDownload, isDownloading],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          {t('factoryInvoices.title')}
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t('factoryInvoices.subtitle')}
        </p>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, 'Failed to load invoices')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      <DataTable
        columns={columns}
        data={invoices}
        loading={isLoading}
        emptyMessage={t('factoryInvoices.empty', {
          defaultValue: 'No invoices found.',
        })}
        showSearch
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder={t('factoryInvoices.searchPlaceholder')}
        showPagination
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
        }}
      />

      <InvoiceDetailModal
        isOpen={Boolean(selectedInvoiceId)}
        onClose={() => setSelectedInvoiceId(null)}
        invoice={selectedInvoice}
        isLoading={isDetailLoading}
        isError={isDetailError}
        errorMessage={getAuthErrorMessage(detailError, 'Failed to load invoice')}
        onDownload={() => handleDownload(selectedInvoiceId)}
        isDownloading={isDownloading}
      />
    </div>
  )
}
