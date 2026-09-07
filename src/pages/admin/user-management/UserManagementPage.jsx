import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'
import {
  useDeleteAdminUserMutation,
  useGetAdminUserStatsQuery,
  useGetAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
} from '@/features/admin/adminUserApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import UserDetailsModal from './components/UserDetailsModal'
import TypeBadge from './components/TypeBadge'
import AccountStatusBadge from './components/AccountStatusBadge'
import { ADMIN_USER_TABS } from './data/usersDemo'

const PAGE_SIZE = 20

function formatStatValue(value) {
  if (value == null || value === '') return '—'
  return typeof value === 'number' ? value.toLocaleString() : value
}

function isUserSuspended(row) {
  const statusCode = String(row?.statusCode || '').toUpperCase()
  const status = String(row?.status || '').toLowerCase()
  return statusCode === 'SUSPENDED' || status === 'suspended'
}

export default function UserManagementPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('customer')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detailUserId, setDetailUserId] = useState(null)

  const isCustomerTab = activeTab === 'customer'

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  const { data: statsResponse, isLoading: statsLoading } =
    useGetAdminUserStatsQuery()

  const { data: usersResponse, isLoading: usersLoading } = useGetAdminUsersQuery({
    type: activeTab,
    status: statusFilter,
    search: debouncedSearch,
    page,
    limit: PAGE_SIZE,
  })

  const [updateUserStatus] = useUpdateAdminUserStatusMutation()
  const [deleteUser] = useDeleteAdminUserMutation()

  const handleStatusChange = useCallback(
    async (row, status) => {
      try {
        const data = await updateUserStatus({ userId: row.id, status }).unwrap()
        if (data?.success === false) {
          toast.error(getAuthErrorMessage(data, t('adminUserManagement.actionFailed')))
          return
        }
        toast.success(data.message || t('adminUserManagement.statusUpdated'))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t('adminUserManagement.actionFailed')))
      }
    },
    [updateUserStatus, t],
  )

  const handleDeleteUser = useCallback(
    async (row) => {
      const confirmed = window.confirm(
        t('adminUserManagement.deleteConfirm', { name: row.name }),
      )
      if (!confirmed) return

      try {
        await deleteUser(row.id).unwrap()
        toast.success(t('adminUserManagement.deleteSuccess'))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t('adminUserManagement.actionFailed')))
      }
    },
    [deleteUser, t],
  )

  const getRowActions = useCallback(
    (row) => {
      const suspended = isUserSuspended(row)
      return [
        {
          id: 'details',
          label: t('adminUserManagement.actions.seeDetails'),
          onClick: () => setDetailUserId(row.id),
        },
        {
          id: 'status',
          label: suspended
            ? t('adminUserManagement.actions.activate')
            : t('adminUserManagement.actions.suspend'),
          onClick: () =>
            handleStatusChange(row, suspended ? 'active' : 'suspended'),
        },
        {
          id: 'delete',
          label: t('adminUserManagement.actions.delete'),
          variant: 'danger',
          onClick: () => handleDeleteUser(row),
        },
        {
          id: 'message',
          label: t('adminUserManagement.actions.message'),
          onClick: () => {},
        },
      ]
    },
    [handleDeleteUser, handleStatusChange, t],
  )

  const tabs = useMemo(
    () =>
      ADMIN_USER_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const tableRows = usersResponse?.users ?? []

  const paginationMeta = usersResponse?.pagination
  const total = paginationMeta?.total ?? 0
  const totalPages = Math.max(1, paginationMeta?.totalPages ?? 1)
  const paginationFrom =
    total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const paginationTo =
    total === 0 ? 0 : Math.min(page * PAGE_SIZE, total)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, activeTab, statusFilter])

  const columns = useMemo(
    () => [
      { key: 'name', header: t('adminUserManagement.columns.name') },
      {
        key: 'phone',
        header: t('adminUserManagement.columns.phone'),
        render: (value) => value || '—',
      },
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
      {
        key: 'registered',
        header: t('adminUserManagement.columns.registered'),
      },
    ],
    [t],
  )

  const stats = statsResponse?.stats

  const statCards = isCustomerTab
    ? [
        {
          label: t('adminUserManagement.stats.totalUsers'),
          value: statsLoading ? '…' : formatStatValue(stats?.totalUsers),
        },
        {
          label: t('adminUserManagement.stats.b2cCustomers'),
          value: statsLoading ? '…' : formatStatValue(stats?.b2cCustomers),
        },
        {
          label: t('adminUserManagement.stats.pendingVerification'),
          value: statsLoading ? '…' : formatStatValue(stats?.pendingVerification),
        },
      ]
    : [
        {
          label: t('adminUserManagement.stats.totalUsers'),
          value: statsLoading ? '…' : formatStatValue(stats?.totalUsers),
        },
        {
          label: t('adminUserManagement.stats.b2bCompanies'),
          value: statsLoading
            ? '…'
            : formatStatValue(stats?.b2bCompanies ?? total),
        },
        {
          label: t('adminUserManagement.stats.pendingVerification'),
          value: statsLoading ? '…' : formatStatValue(stats?.pendingVerification),
        },
      ]

  const resetFilters = () => {
    setStatusFilter('all')
    setSearchQuery('')
    setDebouncedSearch('')
    setPage(1)
  }

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
          resetFilters()
        }}
        showSearch
        searchValue={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value)
          setPage(1)
        }}
        searchPlaceholder={t('adminUserManagement.searchPlaceholder')}
        showFilters
        filterLabel=""
        filters={[
          {
            id: 'status',
            value: statusFilter,
            onChange: (value) => {
              setStatusFilter(value)
              setPage(1)
            },
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
        data={tableRows}
        emptyMessage={t('adminUserManagement.empty')}
        loading={usersLoading && !usersResponse}
        showActions
        actionType="menu"
        getActions={getRowActions}
        showPagination
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          total,
          from: paginationFrom,
          to: paginationTo,
          hasPrevious: page > 1,
          hasNext: page < totalPages,
          onPageChange: setPage,
          summaryLabel: t('adminUserManagement.pagination.summary', {
            from: paginationFrom,
            to: paginationTo,
            total,
          }),
          previousLabel: t('adminUserManagement.pagination.previous'),
          nextLabel: t('adminUserManagement.pagination.next'),
        }}
      />

      <UserDetailsModal
        open={Boolean(detailUserId)}
        userId={detailUserId}
        onClose={() => setDetailUserId(null)}
      />
    </div>
  )
}
