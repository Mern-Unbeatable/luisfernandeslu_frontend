import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import {
  useDeleteAdminAffiliateMutation,
  useGetAdminAffiliateByIdQuery,
  useGetAdminAffiliateClientsQuery,
  useGetAdminAffiliateCommissionsQuery,
  useGetAdminAffiliatePayoutsQuery,
} from '@/features/admin/adminAffiliateApi'
import {
  mapAdminAffiliateDetail,
  mapAdminAffiliateClient,
  mapAdminAffiliateCommission,
  mapAdminAffiliatePayout,
} from '@/features/admin/adminAffiliateMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import { confirmDelete } from '@/utils/confirmDialog'
import SupplierRowActionMenu from '../supplier-management/components/SupplierRowActionMenu'
import PayoutStatusBadge from '../finance-payments/components/PayoutStatusBadge'
import AccountStatusBadge from '../user-management/components/AccountStatusBadge'
import TypeBadge from '../user-management/components/TypeBadge'
import AffiliateDetailTabs from './components/AffiliateDetailTabs'
import AffiliateProfileCard from './components/AffiliateProfileCard'
import CommissionStatusBadge from './components/CommissionStatusBadge'
import AffiliateRevenueChartSection from './sections/AffiliateRevenueChartSection'
import { ADMIN_AFFILIATE_DETAIL_TABS } from './data/affiliatesAdminDemo'

const I18N_KEY = 'adminAffiliateDirectory'
const PAGE_SIZE = 7

export default function AffiliateDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { affiliateId } = useParams()
  const [activeTab, setActiveTab] = useState('clients')
  const [clientPlanFilter, setClientPlanFilter] = useState('all')
  const [clientStatusFilter, setClientStatusFilter] = useState('all')
  const [commissionStatusFilter, setCommissionStatusFilter] = useState('all')
  const [payoutStatusFilter, setPayoutStatusFilter] = useState('all')
  const [clientsPage, setClientsPage] = useState(1)
  const [commissionsPage, setCommissionsPage] = useState(1)
  const [payoutsPage, setPayoutsPage] = useState(1)

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAdminAffiliateByIdQuery(affiliateId ?? '', {
    skip: !affiliateId,
  })

  const [deleteAffiliate, { isLoading: isDeleting }] =
    useDeleteAdminAffiliateMutation()

  const detail = useMemo(
    () => mapAdminAffiliateDetail(data?.affiliate),
    [data?.affiliate],
  )

  const handleDelete = useCallback(async () => {
    if (!detail) return

    const confirmed = await confirmDelete({
      title: t(`${I18N_KEY}.deleteConfirmTitle`),
      text: t(`${I18N_KEY}.deleteConfirm`, { name: detail.name }),
      confirmText: t(`${I18N_KEY}.deleteConfirmButton`),
      cancelText: t(`${I18N_KEY}.deleteCancelButton`),
    })
    if (!confirmed) return

    try {
      const result = await deleteAffiliate(detail.id).unwrap()
      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.actionFailed`)))
        return
      }
      toast.success(result?.message || t(`${I18N_KEY}.deleteSuccess`))
      navigate('/admin/affiliate-directory')
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
    }
  }, [detail, deleteAffiliate, navigate, t])

  useEffect(() => {
    setClientsPage(1)
  }, [clientPlanFilter, clientStatusFilter])

  useEffect(() => {
    setCommissionsPage(1)
  }, [commissionStatusFilter])

  useEffect(() => {
    setPayoutsPage(1)
  }, [payoutStatusFilter])

  const isClientsTab = activeTab === 'clients'
  const isCommissionsTab = activeTab === 'commissions'
  const isPayoutsTab = activeTab === 'payouts'

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsError,
    error: clientsErrorData,
    isFetching: clientsFetching,
    refetch: refetchClients,
  } = useGetAdminAffiliateClientsQuery(
    {
      affiliateId: affiliateId ?? '',
      status: clientStatusFilter,
      plan: clientPlanFilter,
      sort: 'latest',
      search: '',
      page: clientsPage,
      limit: PAGE_SIZE,
    },
    {
      skip: !affiliateId || !isClientsTab,
    },
  )

  const referredClients = useMemo(
    () => (clientsData?.clients ?? []).map(mapAdminAffiliateClient),
    [clientsData?.clients],
  )

  const clientsPagination = clientsData?.pagination
  const clientsTotal = clientsPagination?.total ?? 0
  const clientsTotalPages = Math.max(1, clientsPagination?.totalPages ?? 1)
  const safeClientsPage = Math.min(clientsPage, clientsTotalPages)
  const clientsFrom =
    clientsTotal === 0 ? 0 : (safeClientsPage - 1) * PAGE_SIZE + 1
  const clientsTo =
    clientsTotal === 0 ? 0 : Math.min(safeClientsPage * PAGE_SIZE, clientsTotal)

  useEffect(() => {
    if (clientsPage > clientsTotalPages) {
      setClientsPage(clientsTotalPages)
    }
  }, [clientsPage, clientsTotalPages])

  const showClientsInitialLoading = clientsLoading && !clientsData

  const {
    data: commissionsData,
    isLoading: commissionsLoading,
    isError: commissionsError,
    error: commissionsErrorData,
    isFetching: commissionsFetching,
    refetch: refetchCommissions,
  } = useGetAdminAffiliateCommissionsQuery(
    {
      affiliateId: affiliateId ?? '',
      status: commissionStatusFilter,
      page: commissionsPage,
      limit: PAGE_SIZE,
    },
    {
      skip: !affiliateId || !isCommissionsTab,
    },
  )

  const commissionRows = useMemo(
    () => (commissionsData?.commissions ?? []).map(mapAdminAffiliateCommission),
    [commissionsData?.commissions],
  )

  const commissionsPagination = commissionsData?.pagination
  const commissionsTotal = commissionsPagination?.total ?? 0
  const commissionsTotalPages = Math.max(
    1,
    commissionsPagination?.totalPages ?? 1,
  )
  const safeCommissionsPage = Math.min(commissionsPage, commissionsTotalPages)
  const commissionsFrom =
    commissionsTotal === 0 ? 0 : (safeCommissionsPage - 1) * PAGE_SIZE + 1
  const commissionsTo =
    commissionsTotal === 0
      ? 0
      : Math.min(safeCommissionsPage * PAGE_SIZE, commissionsTotal)

  useEffect(() => {
    if (commissionsPage > commissionsTotalPages) {
      setCommissionsPage(commissionsTotalPages)
    }
  }, [commissionsPage, commissionsTotalPages])

  const showCommissionsInitialLoading =
    commissionsLoading && !commissionsData

  const {
    data: payoutsData,
    isLoading: payoutsLoading,
    isError: payoutsError,
    error: payoutsErrorData,
    isFetching: payoutsFetching,
    refetch: refetchPayouts,
  } = useGetAdminAffiliatePayoutsQuery(
    {
      affiliateId: affiliateId ?? '',
      status: payoutStatusFilter,
      page: payoutsPage,
      limit: PAGE_SIZE,
    },
    {
      skip: !affiliateId || !isPayoutsTab,
    },
  )

  const payoutRows = useMemo(
    () => (payoutsData?.payouts ?? []).map(mapAdminAffiliatePayout),
    [payoutsData?.payouts],
  )

  const payoutsPagination = payoutsData?.pagination
  const payoutsTotal = payoutsPagination?.total ?? 0
  const payoutsTotalPages = Math.max(1, payoutsPagination?.totalPages ?? 1)
  const safePayoutsPage = Math.min(payoutsPage, payoutsTotalPages)
  const payoutsFrom =
    payoutsTotal === 0 ? 0 : (safePayoutsPage - 1) * PAGE_SIZE + 1
  const payoutsTo =
    payoutsTotal === 0
      ? 0
      : Math.min(safePayoutsPage * PAGE_SIZE, payoutsTotal)

  useEffect(() => {
    if (payoutsPage > payoutsTotalPages) {
      setPayoutsPage(payoutsTotalPages)
    }
  }, [payoutsPage, payoutsTotalPages])

  const showPayoutsInitialLoading = payoutsLoading && !payoutsData

  const detailTabs = useMemo(
    () =>
      ADMIN_AFFILIATE_DETAIL_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.loading`)} />
        <p className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.detail.loading`)}
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.loadFailed`)} />
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, t(`${I18N_KEY}.detail.loadFailed`))}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t(`${I18N_KEY}.retry`)}
          </button>
        </div>
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

  if (!detail) {
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
        title={t(`${I18N_KEY}.detail.title`, { name: detail.name })}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/admin/affiliate-directory"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)] hover:underline"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t(`${I18N_KEY}.detail.back`)}
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex h-10 items-center rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t(`${I18N_KEY}.detail.delete`)}
        </button>
      </div>

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

          {clientsError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <p>
                {getAuthErrorMessage(
                  clientsErrorData,
                  t(`${I18N_KEY}.detail.clients.loadFailed`),
                )}
              </p>
              <button
                type="button"
                onClick={() => refetchClients()}
                className="mt-2 font-semibold underline"
              >
                {t(`${I18N_KEY}.retry`)}
              </button>
            </div>
          ) : null}

          <div
            className={
              clientsFetching && clientsData ? 'opacity-60 transition-opacity' : ''
            }
          >
            <DataTable
              showFilters
              filterLabel={t(`${I18N_KEY}.sortLabel`)}
              filters={[
                {
                  id: 'plan',
                  value: clientPlanFilter,
                  onChange: setClientPlanFilter,
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
                  onChange: setClientStatusFilter,
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
              data={referredClients}
              loading={showClientsInitialLoading}
              emptyMessage={t(`${I18N_KEY}.empty`)}
              showPagination
              pagination={{
                page: safeClientsPage,
                pageSize: PAGE_SIZE,
                total: clientsTotal,
                from: clientsFrom,
                to: clientsTo,
                hasPrevious: safeClientsPage > 1,
                hasNext: safeClientsPage < clientsTotalPages,
                onPageChange: setClientsPage,
                summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
                  from: clientsFrom,
                  to: clientsTo,
                  total: clientsTotal,
                }),
                previousLabel: t(`${I18N_KEY}.pagination.previous`),
                nextLabel: t(`${I18N_KEY}.pagination.next`),
              }}
            />
          </div>
        </>
      ) : null}

      {activeTab === 'analytics' ? (
        <AffiliateRevenueChartSection affiliateId={affiliateId} />
      ) : null}

      {activeTab === 'commissions' ? (
        <>
          <p className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
            {t(`${I18N_KEY}.detail.commissions.sectionTitle`)}
          </p>

          {commissionsError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <p>
                {getAuthErrorMessage(
                  commissionsErrorData,
                  t(`${I18N_KEY}.detail.commissions.loadFailed`),
                )}
              </p>
              <button
                type="button"
                onClick={() => refetchCommissions()}
                className="mt-2 font-semibold underline"
              >
                {t(`${I18N_KEY}.retry`)}
              </button>
            </div>
          ) : null}

          <div
            className={
              commissionsFetching && commissionsData
                ? 'opacity-60 transition-opacity'
                : ''
            }
          >
            <DataTable
              showFilters
              filterLabel={t(`${I18N_KEY}.sortLabel`)}
              filters={[
                {
                  id: 'status',
                  value: commissionStatusFilter,
                  onChange: setCommissionStatusFilter,
                  options: [
                    { value: 'all', label: t(`${I18N_KEY}.filters.allStatus`) },
                    {
                      value: 'approved',
                      label: t(`${I18N_KEY}.commissionStatus.approved`),
                    },
                    {
                      value: 'pending',
                      label: t(`${I18N_KEY}.commissionStatus.pending`),
                    },
                  ],
                },
              ]}
              columns={commissionColumns}
              data={commissionRows}
              loading={showCommissionsInitialLoading}
              emptyMessage={t(`${I18N_KEY}.empty`)}
              showPagination
              pagination={{
                page: safeCommissionsPage,
                pageSize: PAGE_SIZE,
                total: commissionsTotal,
                from: commissionsFrom,
                to: commissionsTo,
                hasPrevious: safeCommissionsPage > 1,
                hasNext: safeCommissionsPage < commissionsTotalPages,
                onPageChange: setCommissionsPage,
                summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
                  from: commissionsFrom,
                  to: commissionsTo,
                  total: commissionsTotal,
                }),
                previousLabel: t(`${I18N_KEY}.pagination.previous`),
                nextLabel: t(`${I18N_KEY}.pagination.next`),
              }}
            />
          </div>
        </>
      ) : null}

      {activeTab === 'payouts' ? (
        <>
          <p className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
            {t(`${I18N_KEY}.detail.payouts.sectionTitle`)}
          </p>

          {payoutsError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <p>
                {getAuthErrorMessage(
                  payoutsErrorData,
                  t(`${I18N_KEY}.detail.payouts.loadFailed`),
                )}
              </p>
              <button
                type="button"
                onClick={() => refetchPayouts()}
                className="mt-2 font-semibold underline"
              >
                {t(`${I18N_KEY}.retry`)}
              </button>
            </div>
          ) : null}

          <div
            className={
              payoutsFetching && payoutsData ? 'opacity-60 transition-opacity' : ''
            }
          >
            <DataTable
              showFilters
              filterLabel={t(`${I18N_KEY}.sortLabel`)}
              filters={[
                {
                  id: 'status',
                  value: payoutStatusFilter,
                  onChange: setPayoutStatusFilter,
                  options: [
                    { value: 'all', label: t(`${I18N_KEY}.filters.allStatus`) },
                    {
                      value: 'pending',
                      label: t(`${I18N_KEY}.payoutStatus.pending`),
                    },
                    {
                      value: 'approved',
                      label: t(`${I18N_KEY}.payoutStatus.approved`),
                    },
                    { value: 'paid', label: t(`${I18N_KEY}.payoutStatus.paid`) },
                    {
                      value: 'rejected',
                      label: t(`${I18N_KEY}.payoutStatus.rejected`),
                    },
                  ],
                },
              ]}
              columns={payoutColumns}
              data={payoutRows}
              loading={showPayoutsInitialLoading}
              emptyMessage={t(`${I18N_KEY}.empty`)}
              showPagination
              pagination={{
                page: safePayoutsPage,
                pageSize: PAGE_SIZE,
                total: payoutsTotal,
                from: payoutsFrom,
                to: payoutsTo,
                hasPrevious: safePayoutsPage > 1,
                hasNext: safePayoutsPage < payoutsTotalPages,
                onPageChange: setPayoutsPage,
                summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
                  from: payoutsFrom,
                  to: payoutsTo,
                  total: payoutsTotal,
                }),
                previousLabel: t(`${I18N_KEY}.pagination.previous`),
                nextLabel: t(`${I18N_KEY}.pagination.next`),
              }}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
