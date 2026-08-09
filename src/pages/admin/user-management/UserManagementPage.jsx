import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'
import UserDetailsModal from './components/UserDetailsModal'
import UserVatRateCell from './components/UserVatRateCell'
import TypeBadge from './components/TypeBadge'
import AccountStatusBadge from './components/AccountStatusBadge'
import {
  ADMIN_COMPANY_USERS,
  ADMIN_CUSTOMER_USERS,
  ADMIN_USER_STATS,
  ADMIN_USER_TABS,
  filterUsersByStatus,
  filterUsersBySearch,
} from './data/usersDemo'

export default function UserManagementPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('customer')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [detailUser, setDetailUser] = useState(null)
  const [companyRows, setCompanyRows] = useState(ADMIN_COMPANY_USERS)

  const tabs = useMemo(
    () =>
      ADMIN_USER_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const sourceRows =
    activeTab === 'customer' ? ADMIN_CUSTOMER_USERS : companyRows

  const filteredRows = useMemo(() => {
    const byStatus = filterUsersByStatus(sourceRows, statusFilter)
    return filterUsersBySearch(byStatus, searchQuery)
  }, [sourceRows, statusFilter, searchQuery])

  const handleVatChange = useCallback((rowId, vatRate) => {
    setCompanyRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, vatRate } : row)),
    )
  }, [])

  const columns = useMemo(() => {
    const base = [
      { key: 'name', header: t('adminUserManagement.columns.name') },
      { key: 'phone', header: t('adminUserManagement.columns.phone') },
      { key: 'email', header: t('adminUserManagement.columns.email') },
      {
        key: 'type',
        header: t('adminUserManagement.columns.type'),
        render: (value) => <TypeBadge label={value} />,
      },
      {
        key: 'status',
        header: t('adminUserManagement.columns.status'),
        render: (value) => <AccountStatusBadge status={value} />,
      },
    ]

    if (activeTab === 'company') {
      base.push({
        key: 'vatRate',
        header: t('adminUserManagement.columns.vatRate'),
        render: (value, row) => (
          <UserVatRateCell
            value={value}
            onChange={(next) => handleVatChange(row.id, next)}
          />
        ),
      })
    }

    base.push({
      key: 'registered',
      header: t('adminUserManagement.columns.registered'),
    })

    return base
  }, [activeTab, t, handleVatChange])

  const rowActions = useMemo(
    () => [
      {
        id: 'details',
        label: t('adminUserManagement.actions.seeDetails'),
        onClick: (row) => setDetailUser(row),
      },
      {
        id: 'suspend',
        label: t('adminUserManagement.actions.suspend'),
        onClick: () => {},
      },
      {
        id: 'delete',
        label: t('adminUserManagement.actions.delete'),
        variant: 'danger',
        onClick: () => {},
      },
      {
        id: 'message',
        label: t('adminUserManagement.actions.message'),
        onClick: () => {},
      },
    ],
    [t],
  )

  const statCards =
    activeTab === 'customer'
      ? [
          {
            label: t('adminUserManagement.stats.totalUsers'),
            value: ADMIN_USER_STATS.totalUsers,
          },
          {
            label: t('adminUserManagement.stats.b2cCustomers'),
            value: ADMIN_USER_STATS.b2cCustomers,
          },
          {
            label: t('adminUserManagement.stats.pendingVerification'),
            value: ADMIN_USER_STATS.pendingVerification,
          },
        ]
      : [
          {
            label: t('adminUserManagement.stats.totalUsers'),
            value: ADMIN_USER_STATS.totalUsers,
          },
          {
            label: t('adminUserManagement.stats.b2bCompanies'),
            value: ADMIN_USER_STATS.b2bCompanies,
          },
          {
            label: t('adminUserManagement.stats.pendingVerification'),
            value: ADMIN_USER_STATS.pendingVerification,
          },
        ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo
        title={t('adminUserManagement.title')}
        description={t('adminUserManagement.subtitle')}
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t('adminUserManagement.title')}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t('adminUserManagement.subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {statCards.map((card) => (
          <StatusCard
            key={card.label}
            variant="default"
            label={card.label}
            value={card.value}
          />
        ))}
      </div>

      <DataTable
        showTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id)
          setStatusFilter('all')
          setSearchQuery('')
        }}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t('adminUserManagement.searchPlaceholder')}
        showFilters
        filterLabel=""
        filters={[
          {
            id: 'status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all', label: t('adminUserManagement.filters.allStatus') },
              { value: 'active', label: t('adminUserManagement.filters.active') },
              {
                value: 'suspended',
                label: t('adminUserManagement.filters.suspended'),
              },
            ],
          },
        ]}
        columns={columns}
        data={filteredRows}
        showActions
        actionType="menu"
        actions={rowActions}
        showPagination
        pagination={{
          page: 1,
          pageSize: filteredRows.length || 1,
          total: filteredRows.length,
          hasPrevious: false,
          hasNext: false,
        }}
      />

      <UserDetailsModal
        open={Boolean(detailUser)}
        user={detailUser}
        onClose={() => setDetailUser(null)}
      />
    </div>
  )
}
