import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Toast from '../../../components/common/Toast'
import { getAuthErrorMessage } from '../../../features/auth/authUtils'
import {
  useDownloadTransporterCommissionInvoicePdfMutation,
  useGetTransporterCommissionInvoiceQuery,
  useGetTransporterCommissionInvoicesQuery,
} from '../../../features/transporter/transporterApi'
import {
  downloadBlobFile,
  mapCommissionInvoice,
  mapCommissionInvoiceDetails,
} from '../../../features/transporter/invoiceMappers'
import InvoicesTableSection from './sections/InvoicesTableSection'
import InvoiceDetailModal from './sections/InvoiceDetailModal'

const PAGE_SIZE = 7

export default function InvoicesPage() {
  const { t } = useTranslation()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
  const [toast, setToast] = useState({
    open: false,
    message: '',
    variant: 'error',
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading, isError, error, refetch } =
    useGetTransporterCommissionInvoicesQuery({
      search,
      page,
      limit: PAGE_SIZE,
    })

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useGetTransporterCommissionInvoiceQuery(selectedInvoiceId, {
    skip: !selectedInvoiceId,
  })

  const [downloadPdf, { isLoading: isDownloading }] =
    useDownloadTransporterCommissionInvoicePdfMutation()

  const invoices = useMemo(
    () => (data?.invoices || []).map(mapCommissionInvoice),
    [data?.invoices],
  )

  const selectedInvoice = useMemo(
    () => mapCommissionInvoiceDetails(detailData),
    [detailData],
  )

  const pagination = data?.pagination || {}
  const total = Number(pagination.total) || invoices.length
  const totalPages = Math.max(1, Number(pagination.totalPages) || 1)
  const pageSize = Number(pagination.limit) || PAGE_SIZE

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }))
  }, [])

  const handleDownload = async (invoice) => {
    const invoiceId = invoice?.invoiceId || invoice?.id
    if (!invoiceId || isDownloading) return

    try {
      const blob = await downloadPdf(invoiceId).unwrap()
      downloadBlobFile(blob, `${invoiceId}.pdf`)
    } catch (err) {
      setToast({
        open: true,
        message: getAuthErrorMessage(err, 'Failed to download invoice'),
        variant: 'error',
      })
    }
  }

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = total === 0 ? 0 : Math.min(page * pageSize, total)

  return (
    <div className="space-y-6">
      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={closeToast}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t('transporterInvoices.title')}
        </h1>
        <p className="mt-1 text-base text-gray-500">
          {t('transporterInvoices.subtitle')}
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

      <InvoicesTableSection
        invoices={invoices}
        loading={isLoading}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onView={(row) => setSelectedInvoiceId(row.invoiceId || row.id)}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        pagination={{
          page,
          pageSize,
          total,
          from,
          to,
          summaryLabel: t('transporterInvoices.showingResults', {
            from,
            to,
            total,
          }),
          previousLabel: t('transporterInvoices.previous'),
          nextLabel: t('transporterInvoices.next'),
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
        onDownload={() => handleDownload({ invoiceId: selectedInvoiceId })}
        isDownloading={isDownloading}
      />
    </div>
  )
}
