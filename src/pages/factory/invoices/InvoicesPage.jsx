import { useState } from 'react'
import { FiCalendar, FiDownload, FiEye, FiFileText } from 'react-icons/fi'
import DataTable from '@/components/data-display/DataTable/DataTable'

const DUMMY_INVOICES = [
  {
    id: 'CI-01063',
    type: 'Invoice',
    orderId: 'ORD-001',
    customer: 'Downtown Construction Co.',
    amount: '$285.00',
    date: '2024-05-28',
  },
  {
    id: 'CI-01064',
    type: 'Invoice',
    orderId: 'ORD-002',
    customer: 'West Side Building Project',
    amount: '$180.00',
    date: '2024-05-27',
  },
  {
    id: 'CI-01065',
    type: 'Invoice',
    orderId: 'ORD-003',
    customer: 'Suburban Housing Development',
    amount: '$420.00',
    date: '2024-05-26',
  },
  {
    id: 'CI-01066',
    type: 'Invoice',
    orderId: 'ORD-004',
    customer: 'Tax Authority',
    amount: '$3,450.00',
    date: '2024-05-01',
  },
  {
    id: 'CI-01087',
    type: 'Invoice',
    orderId: 'ORD-025',
    customer: 'Content Creation',
    amount: '$4,250.00',
    date: '2024-05-22',
  },
  {
    id: 'CI-01088',
    type: 'Invoice',
    orderId: 'ORD-026',
    customer: 'Harbor Bridge Works',
    amount: '$960.00',
    date: '2024-05-20',
  },
  {
    id: 'CI-01089',
    type: 'Invoice',
    orderId: 'ORD-027',
    customer: 'Metro Construction LLC',
    amount: '$1,120.00',
    date: '2024-05-18',
  },
  {
    id: 'CI-01090',
    type: 'Invoice',
    orderId: 'ORD-028',
    customer: 'Riverside Housing Co.',
    amount: '$540.00',
    date: '2024-05-15',
  },
  {
    id: 'CI-01091',
    type: 'Invoice',
    orderId: 'ORD-029',
    customer: 'Skyline Developers',
    amount: '$2,780.00',
    date: '2024-05-12',
  },
  {
    id: 'CI-01092',
    type: 'Invoice',
    orderId: 'ORD-030',
    customer: 'Greenfield Estates',
    amount: '$675.00',
    date: '2024-05-10',
  },
  {
    id: 'CI-01093',
    type: 'Invoice',
    orderId: 'ORD-031',
    customer: 'Central Plaza Project',
    amount: '$1,890.00',
    date: '2024-05-08',
  },
  {
    id: 'CI-01094',
    type: 'Invoice',
    orderId: 'ORD-032',
    customer: 'Oakwood Builders',
    amount: '$310.00',
    date: '2024-05-05',
  },
  {
    id: 'CI-01095',
    type: 'Invoice',
    orderId: 'ORD-033',
    customer: 'Summit Concrete Supply',
    amount: '$2,150.00',
    date: '2024-05-03',
  },
  {
    id: 'CI-01096',
    type: 'Invoice',
    orderId: 'ORD-034',
    customer: 'Lakeview Contractors',
    amount: '$890.00',
    date: '2024-05-02',
  },
]

const PAGE_SIZE = 7

function downloadInvoice(row) {
  const content = [
    `Invoice ID: ${row.id}`,
    `Type: ${row.type}`,
    `Order ID: ${row.orderId}`,
    `Customer: ${row.customer}`,
    `Amount: ${row.amount}`,
    `Date: ${row.date}`,
  ].join('\n')

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${row.id}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

const COLUMNS = [
  {
    key: 'id',
    header: 'INVOICES ID',
    render: (value) => (
      <span className="inline-flex items-center gap-2 font-medium text-[var(--primary-text)]">
        <FiFileText className="size-4 shrink-0 text-[var(--secondary-text)]" />
        {value}
      </span>
    ),
  },
  {
    key: 'type',
    header: 'TYPE',
    render: (value) => (
      <span className="inline-flex rounded-md border border-[color-mix(in_srgb,var(--active)_45%,white)] bg-[color-mix(in_srgb,var(--active)_12%,white)] px-2.5 py-1 text-xs font-medium text-[var(--active)]">
        {value}
      </span>
    ),
  },
  { key: 'orderId', header: 'ORDER ID' },
  { key: 'customer', header: 'CUSTOMER' },
  {
    key: 'amount',
    header: 'AMOUNT',
    render: (value) => (
      <span className="font-bold text-[var(--primary-text)]">{value}</span>
    ),
  },
  {
    key: 'date',
    header: 'DATE',
    render: (value) => (
      <span className="inline-flex items-center gap-2 text-[var(--primary-text)]">
        <FiCalendar className="size-4 shrink-0 text-[var(--secondary-text)]" />
        {value}
      </span>
    ),
  },
  {
    key: 'actions',
    header: 'ACTIONS',
    render: (_value, row) => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`View ${row.id}`}
          onClick={() => {}}
          className="rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
        >
          <FiEye className="size-4" />
        </button>
        <button
          type="button"
          aria-label={`Download ${row.id}`}
          onClick={() => downloadInvoice(row)}
          className="rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
        >
          <FiDownload className="size-4" />
        </button>
      </div>
    ),
  },
]

export default function InvoicesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = DUMMY_INVOICES.filter((row) => {
    const q = search.trim().toLowerCase()
    if (!q) return true

    return (
      String(row.id).toLowerCase().includes(q) ||
      String(row.orderId).toLowerCase().includes(q) ||
      String(row.customer).toLowerCase().includes(q)
    )
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          Commission Invoices
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          Manage and track all commission invoices generated from marketplace
          orders.
        </p>
      </div>

      <DataTable
        columns={COLUMNS}
        data={paged}
        showSearch
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        searchPlaceholder="Search invoice ID, order ID, customer..."
        showPagination
        pagination={{
          page: safePage,
          pageSize: PAGE_SIZE,
          total: filtered.length,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}
