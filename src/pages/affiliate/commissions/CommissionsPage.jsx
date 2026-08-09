import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  FiArrowDownLeft,
  FiBarChart2,
  FiDollarSign,
  FiX,
} from 'react-icons/fi'
import StatusCard from '@/components/data-display/StatusCard'
import DataTable from '@/components/data-display/DataTable/DataTable'

const INITIAL_HISTORY = [
  {
    id: 1,
    date: 'Jul 5, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0122',
    amount: '$1,250.00',
    status: 'Approved',
  },
  {
    id: 2,
    date: 'Jul 6, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0120',
    amount: '$1,250.00',
    status: 'Approved',
  },
  {
    id: 3,
    date: 'Jul 7, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0100',
    amount: '$1,250.00',
    status: 'Approved',
  },
  {
    id: 4,
    date: 'Jul 8, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0118',
    amount: '$1,250.00',
    status: 'Approved',
  },
  {
    id: 5,
    date: 'Jul 9, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0144',
    amount: '$1,250.00',
    status: 'Approved',
  },
  {
    id: 6,
    date: 'Jul 10, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0166',
    amount: '$1,250.00',
    status: 'Approved',
  },
  {
    id: 7,
    date: 'Jul 11, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0188',
    amount: '$1,250.00',
    status: 'Approved',
  },
  {
    id: 8,
    date: 'Jul 12, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0199',
    amount: '$980.00',
    status: 'Approved',
  },
  {
    id: 9,
    date: 'Jul 13, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0133',
    amount: '$2,100.00',
    status: 'Pending',
  },
  {
    id: 10,
    date: 'Jul 14, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0155',
    amount: '$750.00',
    status: 'Approved',
  },
  {
    id: 11,
    date: 'Jul 15, 2025',
    type: 'Withdrawal',
    accountType: 'Bank Transfer',
    accountNumber: '458721369845',
    amount: '$400.00',
    status: 'Approved',
  },
  {
    id: 12,
    date: 'Jul 16, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0177',
    amount: '$1,250.00',
    status: 'Approved',
  },
  {
    id: 13,
    date: 'Jul 17, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0201',
    amount: '$1,500.00',
    status: 'Pending',
  },
  {
    id: 14,
    date: 'Jul 18, 2025',
    type: 'Withdrawal',
    accountType: 'Stripe',
    accountNumber: '(702) 555-0212',
    amount: '$1,250.00',
    status: 'Approved',
  },
]

const PAGE_SIZE = 7

const EMPTY_WITHDRAW = {
  amount: '$ 400.00',
  businessName: 'Marlin Transport & Logistics',
  routingNumber: '021000021',
  accountNumber: '458721369845',
}

function StatusPill({ status }) {
  const key = String(status || '').toLowerCase()
  const styles =
    key === 'approved'
      ? 'bg-emerald-100 text-emerald-700'
      : key === 'pending'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-gray-100 text-[var(--secondary-text)]'

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  )
}

const COLUMNS = [
  { key: 'date', header: 'Date' },
  { key: 'type', header: 'Type' },
  { key: 'accountType', header: 'Account Type' },
  { key: 'accountNumber', header: 'Account Number' },
  { key: 'amount', header: 'Amount' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <StatusPill status={value} />,
  },
]

function WithdrawModal({ open, form, onChange, onClose, onSubmit }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const setField = (key) => (event) => {
    onChange?.({ ...form, [key]: event.target.value })
  }

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdraw-funds-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2
            id="withdraw-funds-title"
            className="text-lg font-bold text-[var(--primary-text)]"
          >
            Withdraw Funds
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-full bg-gray-100 text-[var(--secondary-text)] hover:bg-gray-200"
          >
            <FiX className="size-4" />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit?.(form)
          }}
          className="space-y-4"
        >
          <Field label="Amount">
            <input
              type="text"
              value={form.amount}
              onChange={setField('amount')}
              className={inputClass}
            />
          </Field>
          <Field label="Name of the business/organisation">
            <input
              type="text"
              value={form.businessName}
              onChange={setField('businessName')}
              className={inputClass}
            />
          </Field>
          <Field label="Routing Number">
            <input
              type="text"
              value={form.routingNumber}
              onChange={setField('routingNumber')}
              className={inputClass}
            />
          </Field>
          <Field label="Account Number">
            <input
              type="text"
              value={form.accountNumber}
              onChange={setField('accountNumber')}
              className={inputClass}
            />
          </Field>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[var(--active)] bg-white text-sm font-semibold text-[var(--active)] transition hover:bg-[#FFFBF5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--active)] text-sm font-semibold text-white transition hover:brightness-95"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--primary-text)]">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-[var(--primary-text)] outline-none transition focus:border-[var(--active)] focus:ring-1 focus:ring-[var(--active)]'

export default function CommissionsPage() {
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawForm, setWithdrawForm] = useState(EMPTY_WITHDRAW)

  const filtered = history.filter((row) => {
    const q = search.trim().toLowerCase()
    if (!q) return true

    return (
      String(row.date).toLowerCase().includes(q) ||
      String(row.type).toLowerCase().includes(q) ||
      String(row.accountType).toLowerCase().includes(q) ||
      String(row.accountNumber).toLowerCase().includes(q) ||
      String(row.amount).toLowerCase().includes(q) ||
      String(row.status).toLowerCase().includes(q)
    )
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const openWithdraw = () => {
    setWithdrawForm(EMPTY_WITHDRAW)
    setWithdrawOpen(true)
  }

  const closeWithdraw = () => setWithdrawOpen(false)

  const submitWithdraw = (form) => {
    const next = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      type: 'Withdrawal',
      accountType: 'Bank Transfer',
      accountNumber: form.accountNumber || '—',
      amount: form.amount || '$0.00',
      status: 'Pending',
    }
    setHistory((prev) => [next, ...prev])
    setPage(1)
    setWithdrawOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          Earnings & Payment
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          Manage your earnings and payment information
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          label="Total Earnings"
          value="$84250.00"
          description="This Month"
          icon={FiArrowDownLeft}
          iconTone="brand"
        />
        <StatusCard
          variant="action"
          label="Available Balance"
          value="$67,400.00"
          icon={FiDollarSign}
          iconTone="brand"
          actionLabel="Withdraw Funds"
          onAction={openWithdraw}
        />
        <StatusCard
          label="Pending Amount"
          value="$250.00"
          icon={FiBarChart2}
          iconTone="brand"
        />
        <StatusCard
          label="Total Earnings"
          value="$84250.00"
          description="Life Time"
          icon={FiArrowDownLeft}
          iconTone="brand"
        />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          Payment History
        </h2>

        <DataTable
          columns={COLUMNS}
          data={paged}
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          searchPlaceholder="Search date, type, account, amount, status..."
          showPagination
          pagination={{
            page: safePage,
            pageSize: PAGE_SIZE,
            total: filtered.length,
            onPageChange: setPage,
          }}
        />
      </section>

      <WithdrawModal
        open={withdrawOpen}
        form={withdrawForm}
        onChange={setWithdrawForm}
        onClose={closeWithdraw}
        onSubmit={submitWithdraw}
      />
    </div>
  )
}
