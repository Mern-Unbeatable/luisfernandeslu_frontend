import { FiDownload, FiMapPin, FiPhone } from 'react-icons/fi'
import DataTable from '../DataTable/DataTable'

export function normalizeStatus(status = '') {
  const s = String(status).toLowerCase().trim()
  if (s === 'cancelled' || s === 'canceled' || s === 'cancel') return 'cancel'
  if (s === 'assigned') return 'assigned'
  if (s === 'pending') return 'pending'
  if (s === 'new') return 'new'
  if (s === 'processing') return 'processing'
  if (s === 'paid') return 'paid'
  return s || 'pending'
}

const BADGE = {
  pending: 'bg-amber-100 text-amber-700',
  assigned: 'bg-gray-700 text-white',
  cancel: 'bg-red-100 text-red-600',
  new: 'bg-sky-100 text-sky-700',
  processing: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
}

export function StatusBadge({ status }) {
  const key = normalizeStatus(status)
  const label =
    key === 'cancel' ? 'Cancel' : key.charAt(0).toUpperCase() + key.slice(1)
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${BADGE[key] || BADGE.pending}`}
    >
      {label}
    </span>
  )
}

export function DownloadInvoiceButton({ onClick, label = 'DOWNLOAD INVOICE' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--active)] px-4 text-sm font-semibold tracking-wide text-white uppercase transition-opacity hover:opacity-90"
    >
      <FiDownload className="size-4" strokeWidth={2.25} aria-hidden />
      {label}
    </button>
  )
}

export function AcceptButton({ onClick, label = 'ACCEPT' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 min-w-[120px] items-center justify-center rounded-lg bg-[var(--active)] px-6 text-sm font-semibold tracking-wide text-white uppercase transition-opacity hover:opacity-90"
    >
      {label}
    </button>
  )
}

export function MetaCard({ label, value }) {
  return (
    <div className="min-w-[140px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs text-[var(--secondary-text)]">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-[var(--primary-text)]">
        {value}
      </p>
    </div>
  )
}

export function SectionEyebrow({ children }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.14em] text-gray-400 uppercase">
      {children}
    </p>
  )
}

export function IconLabel({ icon: Icon = FiMapPin, label, value }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1.5 text-xs text-[var(--secondary-text)]">
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {label}
      </p>
      <p className="text-sm font-medium break-words text-[var(--primary-text)]">
        {value || '—'}
      </p>
    </div>
  )
}

export function StackLabel({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-[var(--secondary-text)]">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-[var(--primary-text)]">
        {value || '—'}
      </p>
    </div>
  )
}

export function ContactLine({ email, phone }) {
  return (
    <div className="flex flex-col gap-1 text-sm text-[var(--secondary-text)]">
      {email ? <p>{email}</p> : null}
      {phone ? (
        <p className="inline-flex items-center gap-1">
          <FiPhone className="size-3.5" aria-hidden />
          {phone}
        </p>
      ) : null}
    </div>
  )
}

const PRODUCT_COLS = [
  {
    key: 'product',
    header: 'PRODUCT',
    className: 'max-w-[200px] whitespace-normal',
  },
  { key: 'category', header: 'CATEGORY' },
  { key: 'material', header: 'MATERIAL' },
  {
    key: 'weightSize',
    header: 'WEIGHT / SIZE',
    className: 'max-w-[180px] whitespace-normal',
  },
  { key: 'qty', header: 'QTY' },
  { key: 'unit', header: 'UNIT' },
  {
    key: 'warehouse',
    header: 'WAREHOUSE LOCATION',
    className: 'w-[160px]',
    render: (value) => (
      <span className="block w-[160px] truncate" title={value || '—'}>
        {value || '—'}
      </span>
    ),
  },
  {
    key: 'total',
    header: 'TOTAL',
    headerClassName: 'text-right',
    className: 'min-w-[110px] text-right whitespace-nowrap',
  },
]

const BREAKDOWN_COLS = [
  {
    key: 'product',
    header: 'PRODUCT',
    className: 'max-w-[200px] whitespace-normal',
  },
  { key: 'category', header: 'CATEGORY' },
  { key: 'material', header: 'MATERIAL' },
  {
    key: 'weightSize',
    header: 'WEIGHT / SIZE',
    className: 'max-w-[180px] whitespace-normal',
  },
  { key: 'qty', header: 'QTY' },
  {
    key: 'warehouse',
    header: 'WAREHOUSE LOCATION',
    className: 'w-[160px]',
    render: (value) => (
      <span className="block w-[160px] truncate" title={value || '—'}>
        {value || '—'}
      </span>
    ),
  },
  {
    key: 'installmentNumber',
    header: 'INSTALLMENT NUMBER',
    className: 'min-w-[170px] whitespace-nowrap',
  },
  {
    key: 'amount',
    header: 'AMOUNT',
    headerClassName: 'text-right',
    className: 'min-w-[110px] text-right whitespace-nowrap',
  },
]

export function ProductsTable({ products = [] }) {
  return (
    <DataTable
      showCard
      bgClassName="bg-white"
      columns={PRODUCT_COLS}
      data={products}
      emptyMessage="No products"
      showTabs={false}
      showSearch={false}
      showFilters={false}
      showActions={false}
      showPagination={false}
    />
  )
}

export function InstallmentBreakdownTable({ rows = [] }) {
  return (
    <DataTable
      showCard
      bgClassName="bg-white"
      columns={BREAKDOWN_COLS}
      data={rows}
      emptyMessage="No installments"
      showTabs={false}
      showSearch={false}
      showFilters={false}
      showActions={false}
      showPagination={false}
    />
  )
}

export function PriceSummary({ totals = {} }) {
  return (
    <div className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[var(--secondary-text)]">Grand total</span>
        <span className="font-semibold text-[var(--active)]">
          {totals.grandTotal}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[var(--secondary-text)]">Shipping</span>
        <span className="font-semibold text-[var(--active)]">
          {totals.shipping}
        </span>
      </div>
      <div className="mt-1 border-t border-gray-200 pt-2">
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium text-[var(--secondary-text)]">Total</span>
          <span className="text-lg font-bold text-[var(--active)]">
            {totals.total}
          </span>
        </div>
      </div>
    </div>
  )
}
