import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import {
  FiArrowDownLeft,
  FiBarChart2,
  FiX,
} from 'react-icons/fi'
import { FaEuroSign } from 'react-icons/fa'
import StatusCard from '@/components/data-display/StatusCard'
import DataTable from '@/components/data-display/DataTable/DataTable'
import {
  useCreateAffiliateWithdrawalMutation,
  useGetAffiliateEarningsQuery,
} from '@/features/affiliate/affiliateEarningsApi'

const PAGE_SIZE = 20

const EMPTY_WITHDRAW = {
  amount: '',
  businessName: '',
  accountNumber: '',
}

function getTypeLabel(type, t) {
  const key = String(type || '').toLowerCase()
  if (key === 'withdrawal') {
    return t('affiliateCommissions.type.withdrawal')
  }
  return type
}

function getAccountTypeLabel(accountType, t) {
  const key = String(accountType || '')
    .toLowerCase()
    .replace(/\s+/g, '')
  if (key === 'stripe') return t('affiliateCommissions.accountType.stripe')
  if (key === 'banktransfer') {
    return t('affiliateCommissions.accountType.bankTransfer')
  }
  return accountType
}

function getStatusLabel(status, t) {
  const key = String(status || '').toLowerCase()
  if (key === 'approved' || key === 'pending') {
    return t(`affiliateCommissions.status.${key}`)
  }
  return status
}

function StatusPill({ status, label }) {
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
      {label || status}
    </span>
  )
}

function getColumns(t) {
  return [
    { key: 'date', header: t('affiliateCommissions.columns.date') },
    {
      key: 'type',
      header: t('affiliateCommissions.columns.type'),
      render: (value) => getTypeLabel(value, t),
    },
    {
      key: 'accountType',
      header: t('affiliateCommissions.columns.accountType'),
      render: (value) => getAccountTypeLabel(value, t),
    },
    {
      key: 'accountNumber',
      header: t('affiliateCommissions.columns.accountNumber'),
    },
    { key: 'amount', header: t('affiliateCommissions.columns.amount') },
    {
      key: 'status',
      header: t('affiliateCommissions.columns.status'),
      render: (value) => (
        <StatusPill status={value} label={getStatusLabel(value, t)} />
      ),
    },
  ]
}

function formatEuro(value) {
  if (value == null || value === '') return '—'
  const amount = Number(value)
  if (!Number.isFinite(amount)) return String(value)
  return `€${amount.toFixed(2)}`
}

function mapPaymentRow(item) {
  return {
    id: item.id,
    date: item.date ?? item.createdAt ?? item.paymentDate ?? '',
    type: item.type ?? '',
    accountType: item.accountType ?? '',
    accountNumber: item.accountNumber ?? item.ibanNumber ?? '',
    amount: formatEuro(item.amount),
    status: item.status ?? '',
  }
}

function parseAmount(value) {
  const amount = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(amount) ? amount : NaN
}

function WithdrawModal({
  open,
  form,
  onChange,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const { t } = useTranslation()

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
        aria-label={t('affiliateCommissions.withdraw.closeOverlay')}
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
            {t('affiliateCommissions.withdraw.title')}
          </h2>
          <button
            type="button"
            aria-label={t('affiliateCommissions.withdraw.close')}
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
          <Field label={t('affiliateCommissions.withdraw.amount')}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={setField('amount')}
              className={inputClass}
              required
            />
          </Field>
          <Field label={t('affiliateCommissions.withdraw.businessName')}>
            <input
              type="text"
              value={form.businessName}
              onChange={setField('businessName')}
              className={inputClass}
              required
            />
          </Field>
          <Field label={t('affiliateCommissions.withdraw.accountNumber')}>
            <input
              type="text"
              value={form.accountNumber}
              onChange={setField('accountNumber')}
              className={inputClass}
              required
            />
          </Field>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[var(--active)] bg-white text-sm font-semibold text-[var(--active)] transition hover:bg-[#FFFBF5] disabled:opacity-60"
            >
              {t('affiliateCommissions.withdraw.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--active)] text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
            >
              {t('affiliateCommissions.withdraw.submit')}
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
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawForm, setWithdrawForm] = useState(EMPTY_WITHDRAW)

  const { data, isLoading } = useGetAffiliateEarningsQuery({
    page,
    limit: PAGE_SIZE,
  })
  const [createWithdrawal, { isLoading: isWithdrawing }] =
    useCreateAffiliateWithdrawalMutation()

  const summary = data?.summary
  const paymentHistory = data?.paymentHistory || []
  const pagination = data?.pagination || {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  }

  const columns = getColumns(t)

  const rows = useMemo(
    () => paymentHistory.map(mapPaymentRow),
    [paymentHistory],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows

    return rows.filter((row) => {
      return (
        String(row.date).toLowerCase().includes(q) ||
        String(row.type).toLowerCase().includes(q) ||
        getTypeLabel(row.type, t).toLowerCase().includes(q) ||
        String(row.accountType).toLowerCase().includes(q) ||
        getAccountTypeLabel(row.accountType, t).toLowerCase().includes(q) ||
        String(row.accountNumber).toLowerCase().includes(q) ||
        String(row.amount).toLowerCase().includes(q) ||
        String(row.status).toLowerCase().includes(q) ||
        getStatusLabel(row.status, t).toLowerCase().includes(q)
      )
    })
  }, [rows, search, t])

  const totalPages = Math.max(1, pagination.totalPages || 1)
  const safePage = Math.min(page, totalPages)

  const openWithdraw = () => {
    setWithdrawForm({
      amount: '',
      businessName: summary?.businessName ?? '',
      accountNumber: summary?.ibanNumber ?? '',
    })
    setWithdrawOpen(true)
  }

  const closeWithdraw = () => setWithdrawOpen(false)

  const submitWithdraw = async (form) => {
    const amount = parseAmount(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid amount')
      return
    }

    const businessName = String(form.businessName || '').trim()
    const accountNumber = String(form.accountNumber || '').trim()
    if (!businessName || !accountNumber) {
      toast.error('Business name and account number are required')
      return
    }

    try {
      const result = await createWithdrawal({
        amount,
        businessName,
        accountNumber,
      }).unwrap()
      toast.success(result?.message || 'Withdrawal submitted')
      setPage(1)
      setWithdrawOpen(false)
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || 'Withdrawal failed',
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          {t('affiliateCommissions.title')}
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t('affiliateCommissions.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          label={t('affiliateCommissions.cards.totalEarnings')}
          value={isLoading ? '—' : formatEuro(summary?.totalEarningsThisMonth)}
          description={t('affiliateCommissions.cards.thisMonth')}
          icon={FiArrowDownLeft}
          iconTone="brand"
        />
        <StatusCard
          variant="action"
          label={t('affiliateCommissions.cards.availableBalance')}
          value={isLoading ? '—' : formatEuro(summary?.availableBalance)}
          icon={FaEuroSign}
          iconTone="brand"
          actionLabel={t('affiliateCommissions.cards.withdrawFunds')}
          onAction={openWithdraw}
        />
        <StatusCard
          label={t('affiliateCommissions.cards.pendingAmount')}
          value={isLoading ? '—' : formatEuro(summary?.pendingAmount)}
          icon={FiBarChart2}
          iconTone="brand"
        />
        <StatusCard
          label={t('affiliateCommissions.cards.totalEarnings')}
          value={isLoading ? '—' : formatEuro(summary?.totalEarningsLifetime)}
          description={t('affiliateCommissions.cards.lifeTime')}
          icon={FiArrowDownLeft}
          iconTone="brand"
        />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          {t('affiliateCommissions.paymentHistory')}
        </h2>

        <DataTable
          columns={columns}
          data={isLoading ? [] : filtered}
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value)
          }}
          searchPlaceholder={t('affiliateCommissions.searchPlaceholder')}
          showPagination
          pagination={{
            page: safePage,
            pageSize: PAGE_SIZE,
            total: pagination.total || 0,
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
        isSubmitting={isWithdrawing}
      />
    </div>
  )
}
