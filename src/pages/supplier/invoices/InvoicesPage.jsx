import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCalendar, FiDownload, FiEye, FiFileText } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import {
  DEMO_SUPPLIER_INVOICES,
  SUPPLIER_INVOICES_PAGE_SIZE,
} from '@/data/demoData'

function downloadInvoice(row, t) {
  const typeLabel =
    row.type === 'Invoice' ? t('supplierInvoices.typeInvoice') : row.type

  const content = [
    `${t('supplierInvoices.download.invoiceId')}: ${row.id}`,
    `${t('supplierInvoices.download.type')}: ${typeLabel}`,
    `${t('supplierInvoices.download.orderId')}: ${row.orderId}`,
    `${t('supplierInvoices.download.customer')}: ${row.customer}`,
    `${t('supplierInvoices.download.amount')}: ${row.amount}`,
    `${t('supplierInvoices.download.date')}: ${row.date}`,
  ].join('\n')

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${row.id}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

export default function InvoicesPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const pageSize = SUPPLIER_INVOICES_PAGE_SIZE

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return DEMO_SUPPLIER_INVOICES.filter((row) => {
      if (!q) return true

      const typeLabel = (
        row.type === 'Invoice' ? t('supplierInvoices.typeInvoice') : row.type
      ).toLowerCase()

      return (
        String(row.id).toLowerCase().includes(q) ||
        String(row.orderId).toLowerCase().includes(q) ||
        String(row.customer).toLowerCase().includes(q) ||
        String(row.amount).toLowerCase().includes(q) ||
        String(row.date).toLowerCase().includes(q) ||
        String(row.type).toLowerCase().includes(q) ||
        typeLabel.includes(q)
      )
    })
  }, [search, t])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  )

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total)

  const columns = useMemo(
    () => [
      {
        key: 'id',
        header: t('supplierInvoices.columns.invoiceId'),
        render: (value) => (
          <span className="inline-flex items-center gap-2 font-medium text-[var(--primary-text)]">
            <FiFileText
              className="size-4 shrink-0 text-[var(--secondary-text)]"
              aria-hidden
            />
            {value}
          </span>
        ),
      },
      {
        key: 'type',
        header: t('supplierInvoices.columns.type'),
        render: (value) => (
          <span className="inline-flex rounded-md border border-[color-mix(in_srgb,var(--active)_45%,white)] bg-[color-mix(in_srgb,var(--active)_12%,white)] px-2.5 py-1 text-xs font-medium text-[var(--active)]">
            {value === 'Invoice' ? t('supplierInvoices.typeInvoice') : value}
          </span>
        ),
      },
      {
        key: 'orderId',
        header: t('supplierInvoices.columns.orderId'),
      },
      {
        key: 'customer',
        header: t('supplierInvoices.columns.customer'),
      },
      {
        key: 'amount',
        header: t('supplierInvoices.columns.amount'),
        render: (value) => (
          <span className="font-bold text-[var(--primary-text)]">{value}</span>
        ),
      },
      {
        key: 'date',
        header: t('supplierInvoices.columns.date'),
        render: (value) => (
          <span className="inline-flex items-center gap-2 text-[var(--primary-text)]">
            <FiCalendar
              className="size-4 shrink-0 text-[var(--secondary-text)]"
              aria-hidden
            />
            {value}
          </span>
        ),
      },
      {
        key: 'actions',
        header: t('supplierInvoices.columns.actions'),
        render: (_value, row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={t('supplierInvoices.viewAria', { id: row.id })}
              onClick={() => {
                // TODO: wire invoice view API / detail route
              }}
              className="rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
            >
              <FiEye className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t('supplierInvoices.downloadAria', { id: row.id })}
              onClick={() => downloadInvoice(row, t)}
              className="rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
            >
              <FiDownload className="size-4" />
            </button>
          </div>
        ),
      },
    ],
    [t],
  )

  return (
    <>
      <Seo
        title={t('supplierInvoices.title')}
        description={t('supplierInvoices.subtitle')}
      />
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t('supplierInvoices.title')}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t('supplierInvoices.subtitle')}
          </p>
        </header>

        <DataTable
          columns={columns}
          data={paged}
          getRowKey={(row) => row.id}
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          searchPlaceholder={t('supplierInvoices.searchPlaceholder')}
          showPagination
          pagination={{
            page: safePage,
            pageSize,
            total,
            from,
            to,
            hasPrevious: safePage > 1,
            hasNext: safePage < pageCount,
            onPageChange: setPage,
            summaryLabel: t('supplierInvoices.pagination.summary', {
              from,
              to,
              total,
            }),
            previousLabel: t('supplierInvoices.pagination.previous'),
            nextLabel: t('supplierInvoices.pagination.next'),
          }}
        />
      </div>
    </>
  )
}
