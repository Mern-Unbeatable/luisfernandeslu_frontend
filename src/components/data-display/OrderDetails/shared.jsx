import { FiDownload, FiMapPin, FiPhone } from 'react-icons/fi'
import DataTable from '../DataTable/DataTable'

export function normalizeStatus(status = '') {
  const s = String(status).toLowerCase().trim()
  if (s === 'cancelled' || s === 'canceled' || s === 'cancel') return 'cancel'
  if (s === 'in_transit' || s === 'in transit') return 'assigned'
  if (s === 'assigned') return 'assigned'
  if (s === 'pending') return 'pending'
  if (s === 'new') return 'new'
  if (s === 'processing') return 'processing'
  if (s === 'paid') return 'paid'
  if (s === 'produced') return 'produced'
  if (s === 'in production' || s === 'in-production') return 'in-production'
  if (s === 'ready') return 'ready'
  if (s === 'completed') return 'completed'
  return s || 'pending'
}

const BADGE = {
  pending: 'bg-amber-100 text-amber-700',
  assigned: 'bg-gray-700 text-white',
  cancel: 'bg-red-100 text-red-600',
  new: 'bg-sky-100 text-sky-700',
  processing: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  produced: 'bg-sky-100 text-sky-700',
  'in-production': 'bg-[color-mix(in_srgb,var(--active)_15%,transparent)] text-[var(--active)]',
  ready: 'bg-pink-100 text-pink-700',
  completed: 'bg-emerald-100 text-emerald-700',
}

const BADGE_LABELS = {
  cancel: 'Cancel',
  'in-production': 'In Production',
  produced: 'Produced',
  ready: 'Ready',
  completed: 'Completed',
}

export function StatusBadge({ status, label }) {
  const key = normalizeStatus(status)
  const resolvedLabel =
    label ||
    BADGE_LABELS[key] ||
    (key === 'cancel' ? 'Cancel' : key.charAt(0).toUpperCase() + key.slice(1))
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${BADGE[key] || BADGE.pending}`}
    >
      {resolvedLabel}
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

export function IconLabel({
  icon: Icon = FiMapPin,
  label,
  value,
  valueClassName = 'text-sm font-medium break-words text-[var(--primary-text)]',
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1.5 text-xs text-[var(--secondary-text)]">
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {label}
      </p>
      <p className={valueClassName}>{value || '—'}</p>
    </div>
  )
}

export function StackLabel({ label, value, valueClassName = 'mt-0.5 text-sm font-bold text-[var(--primary-text)]' }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-[var(--secondary-text)]">{label}</p>
      <p className={valueClassName}>{value || '—'}</p>
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

const FACTORY_PRODUCT_COLS = [
  {
    key: 'product',
    header: 'PRODUCT',
    className: 'max-w-[200px] whitespace-normal font-semibold',
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
    key: 'total',
    header: 'TOTAL',
    className: 'min-w-[110px] whitespace-nowrap font-semibold',
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

const FACTORY_BREAKDOWN_COLS = [
  {
    key: 'product',
    header: 'PRODUCT',
    className: 'max-w-[200px] whitespace-normal font-semibold',
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
    key: 'installmentNumber',
    header: 'INSTALLMENT NUMBER',
    className: 'min-w-[170px] whitespace-nowrap',
  },
  {
    key: 'amount',
    header: 'AMOUNT',
    className: 'min-w-[110px] whitespace-nowrap font-semibold',
  },
]

const DEFAULT_PRODUCT_COLS = [
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

export function ProductsTable({ products = [], variant = 'default' }) {
  const columns = variant === 'factory' ? FACTORY_PRODUCT_COLS : DEFAULT_PRODUCT_COLS

  return (
    <DataTable
      showCard
      bgClassName="bg-white"
      columns={columns}
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

export function InstallmentBreakdownTable({ rows = [], variant = 'default' }) {
  const columns =
    variant === 'factory' ? FACTORY_BREAKDOWN_COLS : BREAKDOWN_COLS
  return (
    <DataTable
      showCard
      bgClassName="bg-white"
      columns={columns}
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

function formatMoney(value) {
  if (value == null || value === '') return '—'
  if (typeof value === 'string') return value
  const amount = Number(value)
  if (Number.isNaN(amount)) return String(value)
  return `€${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function PriceSummary({ totals = {}, variant = 'full' }) {
  const isSupplier = variant === 'supplier'

  return (
    <div className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
      {isSupplier ? (
        <>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[var(--secondary-text)]">Subtotal</span>
            <span className="font-semibold text-[var(--active)]">
              {formatMoney(totals.subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[var(--secondary-text)]">Discount</span>
            <span className="font-semibold text-[var(--active)]">
              {formatMoney(totals.discount ?? 0)}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[var(--secondary-text)]">Grand total</span>
            <span className="font-semibold text-[var(--active)]">
              {formatMoney(totals.grandTotal)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[var(--secondary-text)]">Shipping</span>
            <span className="font-semibold text-[var(--active)]">
              {formatMoney(totals.shipping)}
            </span>
          </div>
        </>
      )}
      <div className="mt-1 border-t border-gray-200 pt-2">
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium text-[var(--secondary-text)]">Total</span>
          <span className="text-lg font-bold text-[var(--active)]">
            {formatMoney(totals.total)}
          </span>
        </div>
      </div>
    </div>
  )
}
