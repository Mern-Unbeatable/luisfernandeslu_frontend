import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
import SupplierRowActionMenu from '../supplier-management/components/SupplierRowActionMenu'
import AffiliateStatusBadge from './components/AffiliateStatusBadge'
import LevelControlSection from './sections/LevelControlSection'
import PayoutControlSection from './sections/PayoutControlSection'
import {
  ADMIN_AFFILIATE_MAIN_TABS,
  ADMIN_AFFILIATE_STATS,
  ADMIN_AFFILIATES,
  ADMIN_COMMISSION_LEVELS,
  filterAffiliatesBySearch,
  filterAffiliatesByStatus,
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
      {pending ? (
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
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(ADMIN_AFFILIATES)
  const [commissionLevels, setCommissionLevels] = useState(
    ADMIN_COMMISSION_LEVELS,
  )

  const mainTabs = useMemo(
    () =>
      ADMIN_AFFILIATE_MAIN_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const filteredMembers = useMemo(() => {
    const byStatus = filterAffiliatesByStatus(rows, statusFilter)
    return filterAffiliatesBySearch(byStatus, searchQuery)
  }, [rows, statusFilter, searchQuery])

  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pagedMembers = useMemo(
    () =>
      filteredMembers.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE,
      ),
    [filteredMembers, safePage],
  )

  const paginationFrom =
    filteredMembers.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const paginationTo = Math.min(safePage * PAGE_SIZE, filteredMembers.length)

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
        id: 'suspend',
        label: t(`${I18N_KEY}.actions.suspend`),
        onClick: (row) => {
          setRows((prev) =>
            prev.map((item) =>
              item.id === row.id
                ? {
                    ...item,
                    status:
                      item.status === 'suspended' ? 'active' : 'suspended',
                  }
                : item,
            ),
          )
        },
      },
      {
        id: 'delete',
        label: t(`${I18N_KEY}.actions.delete`),
        variant: 'danger',
        onClick: (row) => {
          setRows((prev) => prev.filter((item) => item.id !== row.id))
        },
      },
    ],
    [t, navigate],
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

  const statCards = [
    {
      label: t(`${I18N_KEY}.stats.totalAffiliates`),
      value: ADMIN_AFFILIATE_STATS.totalAffiliates,
      footer: t(`${I18N_KEY}.stats.totalAffiliatesHint`),
      icon: FiUsers,
      iconTone: 'teal',
    },
    {
      label: t(`${I18N_KEY}.stats.activeAffiliates`),
      value: ADMIN_AFFILIATE_STATS.activeAffiliates,
      footer: t(`${I18N_KEY}.stats.activeAffiliatesHint`),
      icon: FiUserCheck,
      iconTone: 'brand',
    },
    {
      label: t(`${I18N_KEY}.stats.referredClients`),
      value: ADMIN_AFFILIATE_STATS.referredClients,
      footer: t(`${I18N_KEY}.stats.referredClientsHint`),
      icon: FiFileText,
      iconTone: 'brand',
    },
    {
      label: t(`${I18N_KEY}.stats.marketplaceRevenue`),
      value: ADMIN_AFFILIATE_STATS.marketplaceRevenue,
      footer: t(`${I18N_KEY}.stats.marketplaceRevenueHint`),
      icon: FiDollarSign,
      iconTone: 'purple',
    },
    {
      label: t(`${I18N_KEY}.stats.totalCommissionPaid`),
      value: ADMIN_AFFILIATE_STATS.totalCommissionPaid,
      footer: t(`${I18N_KEY}.stats.totalCommissionPaidHint`),
      icon: FiDollarSign,
      iconTone: 'purple',
    },
    {
      label: t(`${I18N_KEY}.stats.pendingCommission`),
      value: ADMIN_AFFILIATE_STATS.pendingCommission,
      footer: t(`${I18N_KEY}.stats.pendingCommissionHint`),
      icon: FiClock,
      iconTone: 'gray',
    },
  ]

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

      {activeTab === 'members' ? (
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

      {activeTab === 'members' ? (
        <DataTable
          showFilters
          filterLabel={t(`${I18N_KEY}.sortLabel`)}
          filters={[
            {
              id: 'status',
              value: statusFilter,
              onChange: (value) => {
                setStatusFilter(value)
                setPage(1)
              },
              options: statusFilterOptions,
            },
          ]}
          showSearch
          searchValue={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value)
            setPage(1)
          }}
          searchPlaceholder={t(`${I18N_KEY}.searchPlaceholder`)}
          columns={memberColumns}
          data={pagedMembers}
          emptyMessage={t(`${I18N_KEY}.empty`)}
          showPagination
          pagination={{
            page: safePage,
            pageSize: PAGE_SIZE,
            total: filteredMembers.length,
            from: paginationFrom,
            to: paginationTo,
            hasPrevious: safePage > 1,
            hasNext: safePage < pageCount,
            onPageChange: setPage,
            summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
              from: paginationFrom,
              to: paginationTo,
              total: filteredMembers.length,
            }),
            previousLabel: t(`${I18N_KEY}.pagination.previous`),
            nextLabel: t(`${I18N_KEY}.pagination.next`),
          }}
        />
      ) : null}

      {activeTab === 'payout' ? <PayoutControlSection /> : null}

      {activeTab === 'level' ? (
        <LevelControlSection
          levels={commissionLevels}
          onLevelsChange={setCommissionLevels}
        />
      ) : null}
    </div>
  )
}
