import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiArrowDownLeft,
  FiBarChart2,
  FiDollarSign,
} from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import StatusCard from '@/components/data-display/StatusCard'
import DataTable from '@/components/data-display/DataTable/DataTable'
import {
  DEMO_SUPPLIER_PAYMENTS_HISTORY,
  DEMO_SUPPLIER_PAYMENTS_STATS,
  DEMO_SUPPLIER_PAYMENTS_WITHDRAW_DEFAULT,
  SUPPLIER_PAYMENTS_PAGE_SIZE,
} from '@/data/demoData'
import WithdrawModal from './WithdrawModal'

const TYPE_I18N_KEYS = {
  Withdrawal: 'withdrawal',
}

const ACCOUNT_TYPE_I18N_KEYS = {
  Stripe: 'stripe',
  'Bank Transfer': 'bankTransfer',
}

const STATUS_I18N_KEYS = {
  Approved: 'approved',
  Pending: 'pending',
}

function getTypeLabel(type, t) {
  const key = TYPE_I18N_KEYS[type]
  return key ? t(`supplierPaymentsFinance.type.${key}`) : type
}

function getAccountTypeLabel(accountType, t) {
  const key = ACCOUNT_TYPE_I18N_KEYS[accountType]
  return key ? t(`supplierPaymentsFinance.accountType.${key}`) : accountType
}

function getStatusLabel(status, t) {
  const key = STATUS_I18N_KEYS[status]
  return key ? t(`supplierPaymentsFinance.status.${key}`) : status
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
    { key: 'date', header: t('supplierPaymentsFinance.columns.date') },
    {
      key: 'type',
      header: t('supplierPaymentsFinance.columns.type'),
      render: (value) => getTypeLabel(value, t),
    },
    {
      key: 'accountType',
      header: t('supplierPaymentsFinance.columns.accountType'),
      render: (value) => getAccountTypeLabel(value, t),
    },
    {
      key: 'accountNumber',
      header: t('supplierPaymentsFinance.columns.accountNumber'),
    },
    { key: 'amount', header: t('supplierPaymentsFinance.columns.amount') },
    {
      key: 'status',
      header: t('supplierPaymentsFinance.columns.status'),
      render: (value) => (
        <StatusPill status={value} label={getStatusLabel(value, t)} />
      ),
    },
  ]
}

export default function PaymentsFinancePage() {
  const { t, i18n } = useTranslation()
  const [history, setHistory] = useState(DEMO_SUPPLIER_PAYMENTS_HISTORY)
  const [page, setPage] = useState(1)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawForm, setWithdrawForm] = useState(
    DEMO_SUPPLIER_PAYMENTS_WITHDRAW_DEFAULT,
  )

  const columns = getColumns(t)
  const pageSize = SUPPLIER_PAYMENTS_PAGE_SIZE
  const pageCount = Math.max(1, Math.ceil(history.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const paged = history.slice((safePage - 1) * pageSize, safePage * pageSize)

  const openWithdraw = () => {
    setWithdrawForm(DEMO_SUPPLIER_PAYMENTS_WITHDRAW_DEFAULT)
    setWithdrawOpen(true)
  }

  const closeWithdraw = () => setWithdrawOpen(false)

  const submitWithdraw = (form) => {
    const next = {
      id: Date.now(),
      date: new Date().toLocaleDateString(i18n.language || 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      type: 'Withdrawal',
      accountType: 'Bank Transfer',
      accountNumber: form.accountNumber || '—',
      amount: form.amount || '€0.00',
      status: 'Pending',
    }
    setHistory((prev) => [next, ...prev])
    setPage(1)
    setWithdrawOpen(false)
  }

  return (
    <>
      <Seo title={t('supplierPaymentsFinance.title')} />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t('supplierPaymentsFinance.title')}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t('supplierPaymentsFinance.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatusCard
            label={t('supplierPaymentsFinance.cards.totalEarnings')}
            value={DEMO_SUPPLIER_PAYMENTS_STATS.totalEarnings}
            description={t('supplierPaymentsFinance.cards.thisMonth')}
            icon={FiArrowDownLeft}
            iconTone="brand"
          />
          <StatusCard
            label={t('supplierPaymentsFinance.cards.adminCommission')}
            value={DEMO_SUPPLIER_PAYMENTS_STATS.adminCommission}
            description={t('supplierPaymentsFinance.cards.adminCommissionDesc')}
            icon={FiArrowDownLeft}
            iconTone="brand"
          />
          {/* <StatusCard
            variant="action"
            label={t('supplierPaymentsFinance.cards.availableBalance')}
            value={DEMO_SUPPLIER_PAYMENTS_STATS.availableBalance}
            icon={FiDollarSign}
            iconTone="brand"
            actionLabel={t('supplierPaymentsFinance.cards.withdrawFunds')}
            onAction={openWithdraw}
          /> */}
          {/*<StatusCard
            label={t('supplierPaymentsFinance.cards.pendingAmount')}
            value={DEMO_SUPPLIER_PAYMENTS_STATS.pendingAmount}
            icon={FiBarChart2}
            iconTone="brand"
          />*/}
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t('supplierPaymentsFinance.paymentHistory')}
          </h2>

          <DataTable
            columns={columns}
            data={paged}
            showPagination
            pagination={{
              page: safePage,
              pageSize,
              total: history.length,
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
    </>
  )
}
