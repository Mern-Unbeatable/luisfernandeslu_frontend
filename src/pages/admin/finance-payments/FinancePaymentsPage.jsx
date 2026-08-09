import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCalendar, FiFileText } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'
import SupplierRowActionMenu from '../supplier-management/components/SupplierRowActionMenu'
import InvoiceRowActions from './components/InvoiceRowActions'
import InvoiceUserTypeBadge from './components/InvoiceUserTypeBadge'
import PayoutStatusBadge from './components/PayoutStatusBadge'
import RevenueTrendSection from './sections/RevenueTrendSection'
import {
  FINANCE_COMMISSION_INVOICES,
  FINANCE_PAYOUTS,
  FINANCE_STATS,
  filterInvoicesBySearch,
  filterInvoicesByUserType,
  filterPayoutsBySearch,
  filterPayoutsByStatus,
  formatFinanceCurrency,
} from './data/financeDemo'

const I18N_KEY = 'adminFinancePayments'
const PAYOUT_PAGE_SIZE = 7
const INVOICE_PAGE_SIZE = 7

export default function FinancePaymentsPage() {
  const { t } = useTranslation()
  const [payoutStatusFilter, setPayoutStatusFilter] = useState('all')
  const [payoutSearch, setPayoutSearch] = useState('')
  const [payoutPage, setPayoutPage] = useState(1)
  const [invoiceUserTypeFilter, setInvoiceUserTypeFilter] = useState('all')
  const [invoiceSearch, setInvoiceSearch] = useState('')
  const [invoicePage, setInvoicePage] = useState(1)

  const payoutMenuActions = useMemo(
    () => [
      {
        id: 'approve',
        label: t(`${I18N_KEY}.payoutActions.approve`),
        visible: (row) => row.status === 'pending',
        onClick: () => {},
      },
      {
        id: 'reject',
        label: t(`${I18N_KEY}.payoutActions.reject`),
        variant: 'danger',
        visible: (row) => row.status === 'pending' || row.status === 'approved',
        onClick: () => {},
      },
      {
        id: 'markPaid',
        label: t(`${I18N_KEY}.payoutActions.markPaid`),
        visible: (row) => row.status === 'approved',
        onClick: () => {},
      },
      {
        id: 'view',
        label: t(`${I18N_KEY}.payoutActions.viewDetails`),
        onClick: () => {},
      },
    ],
    [t],
  )

  const filteredPayouts = useMemo(() => {
    const byStatus = filterPayoutsByStatus(FINANCE_PAYOUTS, payoutStatusFilter)
    return filterPayoutsBySearch(byStatus, payoutSearch)
  }, [payoutStatusFilter, payoutSearch])

  const payoutPageCount = Math.max(
    1,
    Math.ceil(filteredPayouts.length / PAYOUT_PAGE_SIZE),
  )
  const safePayoutPage = Math.min(payoutPage, payoutPageCount)
  const pagedPayouts = useMemo(
    () =>
      filteredPayouts.slice(
        (safePayoutPage - 1) * PAYOUT_PAGE_SIZE,
        safePayoutPage * PAYOUT_PAGE_SIZE,
      ),
    [filteredPayouts, safePayoutPage],
  )

  const payoutFrom =
    filteredPayouts.length === 0
      ? 0
      : (safePayoutPage - 1) * PAYOUT_PAGE_SIZE + 1
  const payoutTo = Math.min(
    safePayoutPage * PAYOUT_PAGE_SIZE,
    filteredPayouts.length,
  )

  const filteredInvoices = useMemo(() => {
    const byType = filterInvoicesByUserType(
      FINANCE_COMMISSION_INVOICES,
      invoiceUserTypeFilter,
    )
    return filterInvoicesBySearch(byType, invoiceSearch)
  }, [invoiceUserTypeFilter, invoiceSearch])

  const invoicePageCount = Math.max(
    1,
    Math.ceil(filteredInvoices.length / INVOICE_PAGE_SIZE),
  )
  const safeInvoicePage = Math.min(invoicePage, invoicePageCount)
  const pagedInvoices = useMemo(
    () =>
      filteredInvoices.slice(
        (safeInvoicePage - 1) * INVOICE_PAGE_SIZE,
        safeInvoicePage * INVOICE_PAGE_SIZE,
      ),
    [filteredInvoices, safeInvoicePage],
  )

  const invoiceFrom =
    filteredInvoices.length === 0
      ? 0
      : (safeInvoicePage - 1) * INVOICE_PAGE_SIZE + 1
  const invoiceTo = Math.min(
    safeInvoicePage * INVOICE_PAGE_SIZE,
    filteredInvoices.length,
  )

  const payoutColumns = useMemo(
    () => [
      {
        key: 'name',
        header: t(`${I18N_KEY}.payoutColumns.transporter`),
        render: (_, row) => (
          <div className="min-w-0">
            <p className="font-semibold text-[var(--primary-text)]">
              {row.name}
            </p>
            <p className="text-xs text-[#6B7280]">{row.email}</p>
          </div>
        ),
      },
      {
        key: 'totalEarnings',
        header: t(`${I18N_KEY}.payoutColumns.totalEarnings`),
        render: (value) => formatFinanceCurrency(value),
      },
      {
        key: 'requested',
        header: t(`${I18N_KEY}.payoutColumns.requested`),
        render: (value) => formatFinanceCurrency(value),
      },
      {
        key: 'pending',
        header: t(`${I18N_KEY}.payoutColumns.pending`),
        render: (value) => (
          <span className="font-medium text-[var(--active)]">
            {formatFinanceCurrency(value)}
          </span>
        ),
      },
      {
        key: 'requestDate',
        header: t(`${I18N_KEY}.payoutColumns.requestDate`),
      },
      {
        key: 'status',
        header: t(`${I18N_KEY}.payoutColumns.status`),
        render: (value) => (
          <PayoutStatusBadge
            status={value}
            label={t(`${I18N_KEY}.payoutStatus.${value}`)}
          />
        ),
      },
      {
        key: 'action',
        header: t(`${I18N_KEY}.payoutColumns.action`),
        render: (_, row) => (
          <SupplierRowActionMenu row={row} actions={payoutMenuActions} />
        ),
      },
    ],
    [t, payoutMenuActions],
  )

  const invoiceColumns = useMemo(
    () => [
      {
        key: 'invoiceId',
        header: t(`${I18N_KEY}.invoiceColumns.invoiceId`),
        render: (value) => (
          <span className="inline-flex items-center gap-2 font-medium text-[var(--primary-text)]">
            <FiFileText className="h-4 w-4 shrink-0 text-[var(--secondary-text)]" />
            {value}
          </span>
        ),
      },
      {
        key: 'userType',
        header: t(`${I18N_KEY}.invoiceColumns.userType`),
        render: (value) => (
          <InvoiceUserTypeBadge
            userType={value}
            label={t(`${I18N_KEY}.userTypes.${value}`)}
          />
        ),
      },
      {
        key: 'orderId',
        header: t(`${I18N_KEY}.invoiceColumns.orderId`),
      },
      {
        key: 'participant',
        header: t(`${I18N_KEY}.invoiceColumns.participant`),
      },
      {
        key: 'amount',
        header: t(`${I18N_KEY}.invoiceColumns.amount`),
        render: (value) => (
          <span className="font-bold text-[var(--primary-text)]">
            {formatFinanceCurrency(value)}
          </span>
        ),
      },
      {
        key: 'date',
        header: t(`${I18N_KEY}.invoiceColumns.date`),
        render: (value) => (
          <span className="inline-flex items-center gap-2 text-[var(--primary-text)]">
            <FiCalendar className="h-4 w-4 shrink-0 text-[var(--secondary-text)]" />
            {value}
          </span>
        ),
      },
      {
        key: 'actions',
        header: t(`${I18N_KEY}.invoiceColumns.actions`),
        render: () => (
          <InvoiceRowActions
            viewLabel={t(`${I18N_KEY}.invoiceActions.view`)}
            downloadLabel={t(`${I18N_KEY}.invoiceActions.download`)}
            onView={() => {}}
            onDownload={() => {}}
          />
        ),
      },
    ],
    [t],
  )

  const statCards = [
    {
      label: t(`${I18N_KEY}.stats.totalRevenue`),
      value: FINANCE_STATS.totalRevenue,
    },
    {
      label: t(`${I18N_KEY}.stats.commissionRevenue`),
      value: FINANCE_STATS.commissionRevenue,
    },
    {
      label: t(`${I18N_KEY}.stats.pendingPayouts`),
      value: FINANCE_STATS.pendingPayouts,
    },
    {
      label: t(`${I18N_KEY}.stats.marketingRevenue`),
      value: FINANCE_STATS.marketingRevenue,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo
        title={t(`${I18N_KEY}.title`)}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t(`${I18N_KEY}.title`)}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t(`${I18N_KEY}.subtitle`)}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {statCards.map((card) => (
          <StatusCard
            key={card.label}
            variant="default"
            label={card.label}
            value={card.value}
          />
        ))}
      </div>

      <RevenueTrendSection />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t(`${I18N_KEY}.payoutSection.title`)}
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            {t(`${I18N_KEY}.payoutSection.subtitle`)}
          </p>
        </div>
        <DataTable
          showSearch
          searchValue={payoutSearch}
          onSearchChange={(value) => {
            setPayoutSearch(value)
            setPayoutPage(1)
          }}
          searchPlaceholder={t(`${I18N_KEY}.payoutSearchPlaceholder`)}
          showFilters
          filters={[
            {
              id: 'status',
              value: payoutStatusFilter,
              onChange: (value) => {
                setPayoutStatusFilter(value)
                setPayoutPage(1)
              },
              options: [
                {
                  value: 'all',
                  label: t(`${I18N_KEY}.payoutFilters.allRequests`),
                },
                {
                  value: 'paid',
                  label: t(`${I18N_KEY}.payoutStatus.paid`),
                },
                {
                  value: 'approved',
                  label: t(`${I18N_KEY}.payoutStatus.approved`),
                },
                {
                  value: 'rejected',
                  label: t(`${I18N_KEY}.payoutStatus.rejected`),
                },
                {
                  value: 'pending',
                  label: t(`${I18N_KEY}.payoutStatus.pending`),
                },
              ],
            },
          ]}
          columns={payoutColumns}
          data={pagedPayouts}
          emptyMessage={t(`${I18N_KEY}.payoutEmpty`)}
          showPagination
          pagination={{
            page: safePayoutPage,
            pageSize: PAYOUT_PAGE_SIZE,
            total: filteredPayouts.length,
            from: payoutFrom,
            to: payoutTo,
            hasPrevious: safePayoutPage > 1,
            hasNext: safePayoutPage < payoutPageCount,
            onPageChange: setPayoutPage,
            summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
              from: payoutFrom,
              to: payoutTo,
              total: filteredPayouts.length,
            }),
            previousLabel: t(`${I18N_KEY}.pagination.previous`),
            nextLabel: t(`${I18N_KEY}.pagination.next`),
          }}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t(`${I18N_KEY}.invoiceSection.title`)}
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            {t(`${I18N_KEY}.invoiceSection.subtitle`)}
          </p>
        </div>
        <DataTable
          showSearch
          searchValue={invoiceSearch}
          onSearchChange={(value) => {
            setInvoiceSearch(value)
            setInvoicePage(1)
          }}
          searchPlaceholder={t(`${I18N_KEY}.invoiceSearchPlaceholder`)}
          showFilters
          filterLabel={t(`${I18N_KEY}.invoiceFilters.sortLabel`)}
          filters={[
            {
              id: 'userType',
              value: invoiceUserTypeFilter,
              onChange: (value) => {
                setInvoiceUserTypeFilter(value)
                setInvoicePage(1)
              },
              options: [
                {
                  value: 'all',
                  label: t(`${I18N_KEY}.invoiceFilters.allTypes`),
                },
                {
                  value: 'supplier',
                  label: t(`${I18N_KEY}.userTypes.supplier`),
                },
                {
                  value: 'factory',
                  label: t(`${I18N_KEY}.userTypes.factory`),
                },
                {
                  value: 'transporter',
                  label: t(`${I18N_KEY}.userTypes.transporter`),
                },
              ],
            },
          ]}
          columns={invoiceColumns}
          data={pagedInvoices}
          emptyMessage={t(`${I18N_KEY}.invoiceEmpty`)}
          showPagination
          pagination={{
            page: safeInvoicePage,
            pageSize: INVOICE_PAGE_SIZE,
            total: filteredInvoices.length,
            from: invoiceFrom,
            to: invoiceTo,
            hasPrevious: safeInvoicePage > 1,
            hasNext: safeInvoicePage < invoicePageCount,
            onPageChange: setInvoicePage,
            summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
              from: invoiceFrom,
              to: invoiceTo,
              total: filteredInvoices.length,
            }),
            previousLabel: t(`${I18N_KEY}.pagination.previous`),
            nextLabel: t(`${I18N_KEY}.pagination.next`),
          }}
        />
      </section>
    </div>
  )
}
