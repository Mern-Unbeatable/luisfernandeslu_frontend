import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FiClock,
  FiDollarSign,
  FiFileText,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'
import {
  useGetAdminAffiliateStatsQuery,
  useGetAdminAffiliatesQuery,
  useDeleteAdminAffiliateMutation,
  useUpdateAdminAffiliateStatusMutation,
} from '@/features/admin/adminAffiliateApi'
import {
  mapAdminAffiliate,
  mapAdminAffiliateStats,
} from '@/features/admin/adminAffiliateMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import { confirmDelete } from '@/utils/confirmDialog'
import SupplierRowActionMenu from '../supplier-management/components/SupplierRowActionMenu'
import AffiliateStatusBadge from './components/AffiliateStatusBadge'
import LevelControlSection from './sections/LevelControlSection'
import PayoutControlSection from './sections/PayoutControlSection'
import {
  ADMIN_AFFILIATE_MAIN_TABS,
} from './data/affiliatesAdminDemo'

const I18N_KEY = 'adminAffiliateDirectory'
const PAGE_SIZE = 7
const VALID_MAIN_TABS = new Set(['members', 'payout', 'level'])

function resolveMainTab(tabParam) {
  return VALID_MAIN_TABS.has(tabParam) ? tabParam : 'members'
}

function ActiveClientsCell({ active, cap }) {
  return (
    <span>
      <span className="font-semibold text-emerald-600">{active}</span>
      <span className="text-[var(--secondary-text)]"> ({cap})</span>
    </span>
  )
}

function CommissionEarnedCell({ earned, pending, pendingLabel }) {
  return (
    <div className="min-w-[7rem]">
      <p className="font-medium text-[var(--primary-text)]">{earned}</p>
      {pending && pending !== '—' ? (
        <p className="text-xs text-[var(--active)]">
          {pendingLabel}: {pending}
        </p>
      ) : null}
    </div>
  )
}

export default function AffiliateDirectoryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = resolveMainTab(searchParams.get('tab'))
  const isMembersTab = activeTab === 'members'
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, debouncedSearch])

  const {
    data: statsResponse,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorData,
    refetch: refetchStats,
  } = useGetAdminAffiliateStatsQuery(undefined, {
    skip: !isMembersTab,
  })

  const {
    data: affiliatesResponse,
    isLoading: affiliatesLoading,
    isError: affiliatesError,
    error: affiliatesErrorData,
    isFetching,
    refetch: refetchAffiliates,
  } = useGetAdminAffiliatesQuery(
    {
      status: statusFilter,
      search: debouncedSearch,
      page,
      limit: PAGE_SIZE,
    },
    { skip: !isMembersTab },
  )

  const [updateAffiliateStatus] = useUpdateAdminAffiliateStatusMutation()
  const [deleteAffiliate] = useDeleteAdminAffiliateMutation()

  const mappedStats = useMemo(
    () => mapAdminAffiliateStats(statsResponse?.stats),
    [statsResponse?.stats],
  )

  const rows = useMemo(
    () => (affiliatesResponse?.affiliates ?? []).map(mapAdminAffiliate),
    [affiliatesResponse?.affiliates],
  )

  const paginationMeta = affiliatesResponse?.pagination
  const total = paginationMeta?.total ?? 0
  const totalPages = Math.max(1, paginationMeta?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)
  const paginationFrom = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const paginationTo = total === 0 ? 0 : Math.min(safePage * PAGE_SIZE, total)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const handleToggleStatus = useCallback(
    async (row) => {
      const nextStatus = row.status === 'suspended' ? 'active' : 'suspended'

      try {
        const result = await updateAffiliateStatus({
          affiliateId: row.id,
          status: nextStatus,
        }).unwrap()

        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.actionFailed`)))
          return
        }

        toast.success(result?.message || t(`${I18N_KEY}.statusUpdated`))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
      }
    },
    [updateAffiliateStatus, t],
  )

  const handleDelete = useCallback(
    async (row) => {
      const confirmed = await confirmDelete({
        title: t(`${I18N_KEY}.deleteConfirmTitle`),
        text: t(`${I18N_KEY}.deleteConfirm`, { name: row.name }),
        confirmText: t(`${I18N_KEY}.deleteConfirmButton`),
        cancelText: t(`${I18N_KEY}.deleteCancelButton`),
      })
      if (!confirmed) return

      try {
        const result = await deleteAffiliate(row.id).unwrap()
        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.actionFailed`)))
          return
        }
        toast.success(result?.message || t(`${I18N_KEY}.deleteSuccess`))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
      }
    },
    [deleteAffiliate, t],
  )

  const mainTabs = useMemo(
    () =>
      ADMIN_AFFILIATE_MAIN_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const pendingLabel = t(`${I18N_KEY}.columns.pending`)

  const memberMenuActions = useMemo(
    () => [
      {
        id: 'details',
        label: t(`${I18N_KEY}.actions.seeDetails`),
        variant: 'primary',
        onClick: (row) => navigate(`/admin/affiliate-directory/${row.id}`),
      },
      {
        id: 'toggle-status',
        label: t(`${I18N_KEY}.actions.suspend`),
        visible: (row) => row.status !== 'suspended',
        onClick: handleToggleStatus,
      },
      {
        id: 'activate',
        label: t(`${I18N_KEY}.actions.activate`),
        visible: (row) => row.status === 'suspended',
        onClick: handleToggleStatus,
      },
      {
        id: 'delete',
        label: t(`${I18N_KEY}.actions.delete`),
        variant: 'danger',
        onClick: handleDelete,
      },
    ],
    [t, navigate, handleToggleStatus, handleDelete],
  )

  const memberColumns = useMemo(
    () => [
      {
        key: 'name',
        header: t(`${I18N_KEY}.columns.affiliateName`),
        render: (_, row) => (
          <div className="min-w-[10rem]">
            <p className="font-medium text-[var(--primary-text)]">{row.name}</p>
            <p className="text-xs text-[var(--secondary-text)]">{row.email}</p>
          </div>
        ),
      },
      {
        key: 'affiliateId',
        header: t(`${I18N_KEY}.columns.affiliateId`),
        render: (_, row) => (
          <div>
            <p className="font-medium text-[var(--primary-text)]">
              {row.affiliateId}
            </p>
            <p className="text-xs text-[var(--secondary-text)]">
              {t(`${I18N_KEY}.columns.code`)}: {row.referralCode}
            </p>
          </div>
        ),
      },
      {
        key: 'level',
        header: t(`${I18N_KEY}.columns.level`),
        render: (_, row) => (
          <div>
            <p className="font-medium text-[var(--primary-text)]">{row.level}</p>
            <p className="text-xs text-[var(--secondary-text)]">
              {row.tierRate}% {t(`${I18N_KEY}.columns.tierRate`)}
            </p>
          </div>
        ),
      },
      {
        key: 'totalClients',
        header: t(`${I18N_KEY}.columns.totalClients`),
      },
      {
        key: 'activeClients',
        header: t(`${I18N_KEY}.columns.activeClients`),
        render: (_, row) => (
          <ActiveClientsCell active={row.activeClients} cap={row.clientCap} />
        ),
      },
      {
        key: 'revenueGenerated',
        header: t(`${I18N_KEY}.columns.revenueGenerated`),
      },
      {
        key: 'commissionEarned',
        header: t(`${I18N_KEY}.columns.commissionEarned`),
        render: (_, row) => (
          <CommissionEarnedCell
            earned={row.commissionEarned}
            pending={row.pendingCommission}
            pendingLabel={pendingLabel}
          />
        ),
      },
      {
        key: 'status',
        header: t(`${I18N_KEY}.columns.status`),
        render: (value) => (
          <AffiliateStatusBadge
            status={value}
            label={t(`${I18N_KEY}.status.${value}`)}
          />
        ),
      },
      {
        key: 'action',
        header: t(`${I18N_KEY}.columns.action`),
        render: (_, row) => (
          <SupplierRowActionMenu row={row} actions={memberMenuActions} />
        ),
      },
    ],
    [t, memberMenuActions, pendingLabel],
  )

  const statCards = useMemo(
    () => [
      {
        label: t(`${I18N_KEY}.stats.totalAffiliates`),
        value: statsLoading ? '—' : mappedStats.totalAffiliates ?? '—',
        footer: t(`${I18N_KEY}.stats.totalAffiliatesHint`),
        icon: FiUsers,
        iconTone: 'teal',
      },
      {
        label: t(`${I18N_KEY}.stats.activeAffiliates`),
        value: statsLoading ? '—' : mappedStats.activeAffiliates ?? '—',
        footer: t(`${I18N_KEY}.stats.activeAffiliatesHint`),
        icon: FiUserCheck,
        iconTone: 'brand',
      },
      {
        label: t(`${I18N_KEY}.stats.referredClients`),
        value: statsLoading ? '—' : mappedStats.referredClients ?? '—',
        footer: t(`${I18N_KEY}.stats.referredClientsHint`),
        icon: FiFileText,
        iconTone: 'brand',
      },
      {
        label: t(`${I18N_KEY}.stats.marketplaceRevenue`),
        value: statsLoading ? '—' : mappedStats.marketplaceRevenue ?? '—',
        footer: t(`${I18N_KEY}.stats.marketplaceRevenueHint`),
        icon: FiDollarSign,
        iconTone: 'purple',
      },
      {
        label: t(`${I18N_KEY}.stats.totalCommissionPaid`),
        value: statsLoading ? '—' : mappedStats.totalCommissionPaid ?? '—',
        footer: t(`${I18N_KEY}.stats.totalCommissionPaidHint`),
        icon: FiDollarSign,
        iconTone: 'purple',
      },
      {
        label: t(`${I18N_KEY}.stats.pendingCommission`),
        value: statsLoading ? '—' : mappedStats.pendingCommission ?? '—',
        footer: t(`${I18N_KEY}.stats.pendingCommissionHint`),
        icon: FiClock,
        iconTone: 'gray',
      },
    ],
    [t, statsLoading, mappedStats],
  )

  const statusFilterOptions = [
    { value: 'all', label: t(`${I18N_KEY}.filters.allStatus`) },
    { value: 'active', label: t(`${I18N_KEY}.status.active`) },
    { value: 'suspended', label: t(`${I18N_KEY}.status.suspended`) },
  ]

  const pageTitle =
    activeTab === 'payout'
      ? t(`${I18N_KEY}.payoutControl.pageTitle`)
      : activeTab === 'level'
        ? t(`${I18N_KEY}.levelControl.pageTitle`)
        : t(`${I18N_KEY}.title`)

  const pageSubtitle =
    activeTab === 'payout'
      ? t(`${I18N_KEY}.payoutControl.pageSubtitle`)
      : activeTab === 'level'
        ? t(`${I18N_KEY}.levelControl.pageSubtitle`)
        : t(`${I18N_KEY}.subtitle`)

  const showInitialLoading = affiliatesLoading && !affiliatesResponse

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo title={pageTitle} description={pageSubtitle} />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {pageTitle}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {pageSubtitle}
        </p>
      </header>

      <SegmentedTabs
        standalone
        tabs={mainTabs}
        activeTab={activeTab}
        onTabChange={(id) => {
          setPage(1)
          setSearchQuery('')
          if (id === 'members') {
            setSearchParams({}, { replace: true })
          } else {
            setSearchParams({ tab: id }, { replace: true })
          }
        }}
      />

      {isMembersTab && statsError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(statsErrorData, t(`${I18N_KEY}.loadFailed`))}</p>
          <button
            type="button"
            onClick={() => refetchStats()}
            className="mt-2 font-semibold underline"
          >
            {t(`${I18N_KEY}.retry`)}
          </button>
        </div>
      ) : null}

      {isMembersTab ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {statCards.map((card) => (
            <StatusCard
              key={card.label}
              variant="default"
              label={card.label}
              value={card.value}
              description={card.footer}
              icon={card.icon}
              iconTone={card.iconTone}
            />
          ))}
        </div>
      ) : null}

      {isMembersTab ? (
        <>
          {affiliatesError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <p>
                {getAuthErrorMessage(
                  affiliatesErrorData,
                  t(`${I18N_KEY}.loadFailed`),
                )}
              </p>
              <button
                type="button"
                onClick={() => refetchAffiliates()}
                className="mt-2 font-semibold underline"
              >
                {t(`${I18N_KEY}.retry`)}
              </button>
            </div>
          ) : null}

          <div className={isFetching && affiliatesResponse ? 'opacity-60 transition-opacity' : ''}>
            <DataTable
              showFilters
              filterLabel={t(`${I18N_KEY}.sortLabel`)}
              filters={[
                {
                  id: 'status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: statusFilterOptions,
                },
              ]}
              showSearch
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder={t(`${I18N_KEY}.searchPlaceholder`)}
              columns={memberColumns}
              data={rows}
              loading={showInitialLoading}
              emptyMessage={t(`${I18N_KEY}.empty`)}
              showPagination
              pagination={{
                page: safePage,
                pageSize: PAGE_SIZE,
                total,
                from: paginationFrom,
                to: paginationTo,
                hasPrevious: safePage > 1,
                hasNext: safePage < totalPages,
                onPageChange: setPage,
                summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
                  from: paginationFrom,
                  to: paginationTo,
                  total,
                }),
                previousLabel: t(`${I18N_KEY}.pagination.previous`),
                nextLabel: t(`${I18N_KEY}.pagination.next`),
              }}
            />
          </div>
        </>
      ) : null}

      {activeTab === 'payout' ? <PayoutControlSection /> : null}

      {activeTab === 'level' ? <LevelControlSection /> : null}
    </div>
  )
}
