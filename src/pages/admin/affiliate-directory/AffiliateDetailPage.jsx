import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import SupplierRowActionMenu from '../supplier-management/components/SupplierRowActionMenu'
import PayoutStatusBadge from '../finance-payments/components/PayoutStatusBadge'
import AccountStatusBadge from '../user-management/components/AccountStatusBadge'
import TypeBadge from '../user-management/components/TypeBadge'
import AffiliateDetailTabs from './components/AffiliateDetailTabs'
import AffiliateProfileCard from './components/AffiliateProfileCard'
import CommissionStatusBadge from './components/CommissionStatusBadge'
import AffiliateRevenueChartSection from './sections/AffiliateRevenueChartSection'
import {
  ADMIN_AFFILIATE_DETAIL_TABS,
  filterClientsByPlan,
  filterClientsByStatus,
  filterCommissionsByStatus,
  filterPayoutHistoryByStatus,
  getAdminAffiliateDetail,
  getAdminAffiliateRow,
} from './data/affiliatesAdminDemo'

const I18N_KEY = 'adminAffiliateDirectory'
const PAGE_SIZE = 7

export default function AffiliateDetailPage() {
  const { t } = useTranslation()
  const { affiliateId } = useParams()
  const [activeTab, setActiveTab] = useState('clients')
  const [clientPlanFilter, setClientPlanFilter] = useState('all')
  const [clientStatusFilter, setClientStatusFilter] = useState('all')
  const [commissionStatusFilter, setCommissionStatusFilter] = useState('all')
  const [payoutStatusFilter, setPayoutStatusFilter] = useState('all')
  const [clientsPage, setClientsPage] = useState(1)
  const [commissionsPage, setCommissionsPage] = useState(1)
  const [payoutsPage, setPayoutsPage] = useState(1)

  const row = useMemo(
    () => getAdminAffiliateRow(affiliateId ?? ''),
    [affiliateId],
  )
  const detail = useMemo(
    () => getAdminAffiliateDetail(affiliateId ?? ''),
    [affiliateId],
  )

  const detailTabs = useMemo(
    () =>
      ADMIN_AFFILIATE_DETAIL_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const filteredClients = useMemo(() => {
    if (!detail) return []
    const byPlan = filterClientsByPlan(detail.referredClients, clientPlanFilter)
    return filterClientsByStatus(byPlan, clientStatusFilter)
  }, [detail, clientPlanFilter, clientStatusFilter])

  const clientsPageCount = Math.max(
    1,
    Math.ceil(filteredClients.length / PAGE_SIZE),
  )
  const safeClientsPage = Math.min(clientsPage, clientsPageCount)
  const pagedClients = useMemo(
    () =>
      filteredClients.slice(
        (safeClientsPage - 1) * PAGE_SIZE,
        safeClientsPage * PAGE_SIZE,
      ),
    [filteredClients, safeClientsPage],
  )
  const clientsFrom =
    filteredClients.length === 0 ? 0 : (safeClientsPage - 1) * PAGE_SIZE + 1
  const clientsTo = Math.min(safeClientsPage * PAGE_SIZE, filteredClients.length)

  const filteredCommissions = useMemo(() => {
    if (!detail) return []
    return filterCommissionsByStatus(
      detail.commissionLog,
      commissionStatusFilter,
    )
  }, [detail, commissionStatusFilter])

  const commissionsPageCount = Math.max(
    1,
    Math.ceil(filteredCommissions.length / PAGE_SIZE),
  )
  const safeCommissionsPage = Math.min(commissionsPage, commissionsPageCount)
  const pagedCommissions = useMemo(
    () =>
      filteredCommissions.slice(
        (safeCommissionsPage - 1) * PAGE_SIZE,
        safeCommissionsPage * PAGE_SIZE,
      ),
    [filteredCommissions, safeCommissionsPage],
  )
  const commissionsFrom =
    filteredCommissions.length === 0
      ? 0
      : (safeCommissionsPage - 1) * PAGE_SIZE + 1
  const commissionsTo = Math.min(
    safeCommissionsPage * PAGE_SIZE,
    filteredCommissions.length,
  )

  const filteredPayouts = useMemo(() => {
    if (!detail) return []
    return filterPayoutHistoryByStatus(detail.payoutHistory, payoutStatusFilter)
  }, [detail, payoutStatusFilter])

  const payoutsPageCount = Math.max(
    1,
    Math.ceil(filteredPayouts.length / PAGE_SIZE),
  )
  const safePayoutsPage = Math.min(payoutsPage, payoutsPageCount)
  const pagedPayouts = useMemo(
    () =>
      filteredPayouts.slice(
        (safePayoutsPage - 1) * PAGE_SIZE,
        safePayoutsPage * PAGE_SIZE,
      ),
    [filteredPayouts, safePayoutsPage],
  )
  const payoutsFrom =
    filteredPayouts.length === 0 ? 0 : (safePayoutsPage - 1) * PAGE_SIZE + 1
  const payoutsTo = Math.min(safePayoutsPage * PAGE_SIZE, filteredPayouts.length)

  const clientColumns = useMemo(
    () => [
      {
        key: 'name',
        header: t(`${I18N_KEY}.detail.clients.columns.clientInfo`),
        render: (_, clientRow) => (
          <div>
            <p className="font-medium text-[var(--primary-text)]">
              {clientRow.name}
            </p>
            <p className="text-xs text-[var(--secondary-text)]">
              {clientRow.email}
            </p>
          </div>
        ),
      },
      {
        key: 'phone',
        header: t(`${I18N_KEY}.detail.clients.columns.phone`),
      },
      {
        key: 'joinDate',
        header: t(`${I18N_KEY}.detail.clients.columns.joinDate`),
      },
      {
        key: 'plan',
        header: t(`${I18N_KEY}.detail.clients.columns.plan`),
        render: (value) => <TypeBadge label={value} />,
      },
      {
        key: 'generatedRevenue',
        header: t(`${I18N_KEY}.detail.clients.columns.generatedRevenue`),
      },
      {
        key: 'affiliateCommission',
        header: t(`${I18N_KEY}.detail.clients.columns.affiliateCommission`),
      },
      {
        key: 'expiryDate',
        header: t(`${I18N_KEY}.detail.clients.columns.expiryDate`),
      },
      {
        key: 'status',
        header: t(`${I18N_KEY}.detail.clients.columns.status`),
        render: (value) => (
          <AccountStatusBadge
            status={t(`${I18N_KEY}.clientStatus.${value}`)}
          />
        ),
      },
      {
        key: 'action',
        header: t(`${I18N_KEY}.detail.clients.columns.action`),
        render: (_, clientRow) => (
          <SupplierRowActionMenu
            row={clientRow}
            actions={[
              {
                id: 'view',
                label: t(`${I18N_KEY}.actions.seeDetails`),
                onClick: () => {},
              },
            ]}
          />
        ),
      },
    ],
    [t],
  )

  const commissionColumns = useMemo(
    () => [
      {
        key: 'transactionLabel',
        header: t(`${I18N_KEY}.detail.commissions.columns.transactionId`),
      },
      { key: 'date', header: t(`${I18N_KEY}.detail.commissions.columns.date`) },
      {
        key: 'sourceName',
        header: t(`${I18N_KEY}.detail.commissions.columns.sourceClient`),
        render: (_, commissionRow) => (
          <div>
            <p className="font-medium text-[var(--primary-text)]">
              {commissionRow.sourceName}
            </p>
            <p className="text-xs text-[var(--secondary-text)]">
              {commissionRow.sourceEmail}
            </p>
          </div>
        ),
      },
      {
        key: 'purchaseSize',
        header: t(`${I18N_KEY}.detail.commissions.columns.purchaseSize`),
      },
      {
        key: 'rate',
        header: t(`${I18N_KEY}.detail.commissions.columns.rate`),
      },
      {
        key: 'earned',
        header: t(`${I18N_KEY}.detail.commissions.columns.earned`),
      },
      {
        key: 'status',
        header: t(`${I18N_KEY}.detail.commissions.columns.status`),
        render: (value) => (
          <CommissionStatusBadge
            status={value}
            label={t(`${I18N_KEY}.commissionStatus.${value}`)}
          />
        ),
      },
    ],
    [t],
  )

  const payoutColumns = useMemo(
    () => [
      {
        key: 'referenceId',
        header: t(`${I18N_KEY}.detail.payouts.columns.referenceId`),
      },
      {
        key: 'requestedDate',
        header: t(`${I18N_KEY}.detail.payouts.columns.requestedDate`),
      },
      {
        key: 'method',
        header: t(`${I18N_KEY}.detail.payouts.columns.method`),
      },
      {
        key: 'accountNumber',
        header: t(`${I18N_KEY}.detail.payouts.columns.accountNumber`),
      },
      {
        key: 'amount',
        header: t(`${I18N_KEY}.detail.payouts.columns.amount`),
      },
      {
        key: 'status',
        header: t(`${I18N_KEY}.detail.payouts.columns.status`),
        render: (value) => (
          <PayoutStatusBadge
            status={value}
            label={t(`${I18N_KEY}.payoutStatus.${value}`)}
          />
        ),
      },
    ],
    [t],
  )

  if (!row || !detail) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.notFound`)} />
        <p className="text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.detail.notFound`)}
        </p>
        <Link
          to="/admin/affiliate-directory"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t(`${I18N_KEY}.detail.back`)}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo
        title={t(`${I18N_KEY}.detail.title`, { name: row.name })}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <Link
        to="/admin/affiliate-directory"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)] hover:underline"
      >
        <FiArrowLeft className="size-4" aria-hidden />
        {t(`${I18N_KEY}.detail.back`)}
      </Link>

      <AffiliateProfileCard affiliate={detail} t={t} />

      <AffiliateDetailTabs
        tabs={detailTabs}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id)
          setClientsPage(1)
          setCommissionsPage(1)
          setPayoutsPage(1)
        }}
      />

      {activeTab === 'clients' ? (
        <>
          <p className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
            {t(`${I18N_KEY}.detail.clients.sectionTitle`)}
          </p>
          <DataTable
          showFilters
          filterLabel={t(`${I18N_KEY}.sortLabel`)}
          filters={[
            {
              id: 'plan',
              value: clientPlanFilter,
              onChange: (value) => {
                setClientPlanFilter(value)
                setClientsPage(1)
              },
              options: [
                { value: 'all', label: t(`${I18N_KEY}.filters.allPlans`) },
                {
                  value: 'customer',
                  label: t(`${I18N_KEY}.filters.customer`),
                },
                {
                  value: 'company',
                  label: t(`${I18N_KEY}.filters.company`),
                },
              ],
            },
            {
              id: 'status',
              value: clientStatusFilter,
              onChange: (value) => {
                setClientStatusFilter(value)
                setClientsPage(1)
              },
              options: [
                { value: 'all', label: t(`${I18N_KEY}.filters.allStatus`) },
                {
                  value: 'active',
                  label: t(`${I18N_KEY}.clientStatus.active`),
                },
                {
                  value: 'suspended',
                  label: t(`${I18N_KEY}.clientStatus.suspended`),
                },
              ],
            },
          ]}
          columns={clientColumns}
          data={pagedClients}
          emptyMessage={t(`${I18N_KEY}.empty`)}
          showPagination
          pagination={{
            page: safeClientsPage,
            pageSize: PAGE_SIZE,
            total: filteredClients.length,
            from: clientsFrom,
            to: clientsTo,
            hasPrevious: safeClientsPage > 1,
            hasNext: safeClientsPage < clientsPageCount,
            onPageChange: setClientsPage,
            summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
              from: clientsFrom,
              to: clientsTo,
              total: filteredClients.length,
            }),
            previousLabel: t(`${I18N_KEY}.pagination.previous`),
            nextLabel: t(`${I18N_KEY}.pagination.next`),
          }}
        />
        </>
      ) : null}

      {activeTab === 'analytics' ? <AffiliateRevenueChartSection /> : null}

      {activeTab === 'commissions' ? (
        <>
          <p className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
            {t(`${I18N_KEY}.detail.commissions.sectionTitle`)}
          </p>
          <DataTable
          showFilters
          filterLabel={t(`${I18N_KEY}.sortLabel`)}
          filters={[
            {
              id: 'status',
              value: commissionStatusFilter,
              onChange: (value) => {
                setCommissionStatusFilter(value)
                setCommissionsPage(1)
              },
              options: [
                { value: 'all', label: t(`${I18N_KEY}.filters.allStatus`) },
                {
                  value: 'approved',
                  label: t(`${I18N_KEY}.commissionStatus.approved`),
                },
              ],
            },
          ]}
          columns={commissionColumns}
          data={pagedCommissions}
          emptyMessage={t(`${I18N_KEY}.empty`)}
          showPagination
          pagination={{
            page: safeCommissionsPage,
            pageSize: PAGE_SIZE,
            total: filteredCommissions.length,
            from: commissionsFrom,
            to: commissionsTo,
            hasPrevious: safeCommissionsPage > 1,
            hasNext: safeCommissionsPage < commissionsPageCount,
            onPageChange: setCommissionsPage,
            summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
              from: commissionsFrom,
              to: commissionsTo,
              total: filteredCommissions.length,
            }),
            previousLabel: t(`${I18N_KEY}.pagination.previous`),
            nextLabel: t(`${I18N_KEY}.pagination.next`),
          }}
        />
        </>
      ) : null}

      {activeTab === 'payouts' ? (
        <>
          <p className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
            {t(`${I18N_KEY}.detail.payouts.sectionTitle`)}
          </p>
          <DataTable
          showFilters
          filterLabel={t(`${I18N_KEY}.sortLabel`)}
          filters={[
            {
              id: 'status',
              value: payoutStatusFilter,
              onChange: (value) => {
                setPayoutStatusFilter(value)
                setPayoutsPage(1)
              },
              options: [
                { value: 'all', label: t(`${I18N_KEY}.filters.allStatus`) },
                {
                  value: 'pending',
                  label: t(`${I18N_KEY}.payoutStatus.pending`),
                },
                { value: 'paid', label: t(`${I18N_KEY}.payoutStatus.paid`) },
              ],
            },
          ]}
          columns={payoutColumns}
          data={pagedPayouts}
          emptyMessage={t(`${I18N_KEY}.empty`)}
          showPagination
          pagination={{
            page: safePayoutsPage,
            pageSize: PAGE_SIZE,
            total: filteredPayouts.length,
            from: payoutsFrom,
            to: payoutsTo,
            hasPrevious: safePayoutsPage > 1,
            hasNext: safePayoutsPage < payoutsPageCount,
            onPageChange: setPayoutsPage,
            summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
              from: payoutsFrom,
              to: payoutsTo,
              total: filteredPayouts.length,
            }),
            previousLabel: t(`${I18N_KEY}.pagination.previous`),
            nextLabel: t(`${I18N_KEY}.pagination.next`),
          }}
        />
        </>
      ) : null}
    </div>
  )
}
