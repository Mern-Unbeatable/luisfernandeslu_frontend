import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'
import {
  useApproveAdminFactoryMutation,
  useDeleteAdminFactoryMutation,
  useGetAdminFactoriesQuery,
  useGetAdminFactoryStatsQuery,
  useUpdateAdminFactoryCommissionMutation,
  useUpdateAdminFactoryStatusMutation,
} from '@/features/admin/adminFactoryApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import SupplierCommissionCell from '../supplier-management/components/SupplierCommissionCell'
import SupplierDetailsModal from '../supplier-management/components/SupplierDetailsModal'
import SupplierRowActionMenu from '../supplier-management/components/SupplierRowActionMenu'
import SupplierStatusBadge from '../supplier-management/components/SupplierStatusBadge'
import FactoryRejectModal from './components/FactoryRejectModal'
import {
  ADMIN_FACTORY_TABS,
  formatFactoryRegisteredDate,
} from './data/factoriesDemo'

const PAGE_SIZE = 20
const I18N_KEY = 'adminFactoryManagement'

function formatStatValue(value) {
  if (value == null || value === '') return '—'
  return typeof value === 'number' ? value.toLocaleString() : value
}

function formatCommissionPercent(value) {
  const num = Number(value)
  if (Number.isNaN(num)) return '0%'
  return `${num}%`
}

function parseCommissionPercent(value) {
  const num = Number.parseInt(String(value).replace('%', '').trim(), 10)
  return Number.isNaN(num) ? null : num
}

function getFactoryStatusCode(row) {
  return String(row?.statusCode || row?.status || '').toUpperCase()
}

function isFactoryActive(row) {
  return getFactoryStatusCode(row) === 'ACTIVE'
}

function isFactoryPending(row) {
  const code = getFactoryStatusCode(row)
  const verification = String(row?.verificationStatus || '').toUpperCase()
  return (
    code === 'PENDING' ||
    code === 'PENDING_VERIFICATION' ||
    code === 'UNDER_REVIEW' ||
    verification === 'PENDING_REVIEW' ||
    verification === 'UNDER_REVIEW'
  )
}

function isFactorySuspended(row) {
  return getFactoryStatusCode(row) === 'SUSPENDED'
}

function mapFactoryRow(factory) {
  return {
    ...factory,
    registered: factory.registeredDate ?? factory.registered,
    commission: formatCommissionPercent(factory.commissionPercent),
  }
}

function tabToApiStatus(tabId) {
  if (tabId === 'pending') return 'pending'
  if (tabId === 'suspended') return 'suspended'
  return 'all'
}

export default function FactoryManagementPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detailFactoryId, setDetailFactoryId] = useState(null)
  const [rejectFactoryId, setRejectFactoryId] = useState(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  const { data: statsResponse, isLoading: statsLoading } =
    useGetAdminFactoryStatsQuery()

  const { data: factoriesResponse, isLoading: factoriesLoading } =
    useGetAdminFactoriesQuery({
      status: tabToApiStatus(activeTab),
      search: debouncedSearch,
      page,
      limit: PAGE_SIZE,
    })

  const [approveFactory] = useApproveAdminFactoryMutation()
  const [updateFactoryStatus] = useUpdateAdminFactoryStatusMutation()
  const [updateFactoryCommission] = useUpdateAdminFactoryCommissionMutation()
  const [deleteFactory] = useDeleteAdminFactoryMutation()

  const runAction = useCallback(
    async (promise, fallbackSuccessKey) => {
      try {
        const data = await promise
        if (data?.success === false) {
          toast.error(getAuthErrorMessage(data, t(`${I18N_KEY}.actionFailed`)))
          return
        }
        toast.success(data?.message || t(fallbackSuccessKey))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
      }
    },
    [t],
  )

  const handleApprove = useCallback(
    (row) =>
      runAction(
        approveFactory(row.id).unwrap(),
        `${I18N_KEY}.approveSuccess`,
      ),
    [approveFactory, runAction],
  )

  const handleStatusChange = useCallback(
    (row, status) =>
      runAction(
        updateFactoryStatus({ factoryId: row.id, status }).unwrap(),
        status === 'active'
          ? `${I18N_KEY}.renewSuccess`
          : `${I18N_KEY}.statusUpdated`,
      ),
    [runAction, updateFactoryStatus],
  )

  const handleCommissionChange = useCallback(
    async (row, nextValue) => {
      const commissionPercent = parseCommissionPercent(nextValue)
      if (commissionPercent == null) {
        toast.error(t(`${I18N_KEY}.actionFailed`))
        return
      }

      await runAction(
        updateFactoryCommission({ factoryId: row.id, commissionPercent }).unwrap(),
        `${I18N_KEY}.commissionUpdated`,
      )
    },
    [runAction, t, updateFactoryCommission],
  )

  const handleDeleteFactory = useCallback(
    async (row) => {
      const confirmed = window.confirm(
        t(`${I18N_KEY}.deleteConfirm`, { name: row.name }),
      )
      if (!confirmed) return

      try {
        const data = await deleteFactory(row.id).unwrap()
        if (data?.success === false) {
          toast.error(getAuthErrorMessage(data, t(`${I18N_KEY}.actionFailed`)))
          return
        }
        if (detailFactoryId === row.id) {
          setDetailFactoryId(null)
        }
        if (rejectFactoryId === row.id) {
          setRejectFactoryId(null)
        }
        toast.success(data?.message || t(`${I18N_KEY}.deleteSuccess`))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
      }
    },
    [deleteFactory, detailFactoryId, rejectFactoryId, t],
  )

  const tabs = useMemo(
    () =>
      ADMIN_FACTORY_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const tableRows = useMemo(
    () => (factoriesResponse?.factories ?? []).map(mapFactoryRow),
    [factoriesResponse],
  )

  const paginationMeta = factoriesResponse?.pagination
  const total = paginationMeta?.total ?? 0
  const totalPages = Math.max(1, paginationMeta?.totalPages ?? 1)
  const paginationFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const paginationTo = total === 0 ? 0 : Math.min(page * PAGE_SIZE, total)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, activeTab])

  const menuActions = useMemo(
    () => [
      {
        id: 'details',
        label: t(`${I18N_KEY}.actions.seeDetails`),
        variant: 'primary',
        onClick: (row) => setDetailFactoryId(row.id),
      },
      {
        id: 'suspend',
        label: t(`${I18N_KEY}.actions.suspend`),
        visible: (row) => isFactoryActive(row) && !isFactoryPending(row),
        onClick: (row) => handleStatusChange(row, 'suspended'),
      },
      {
        id: 'approved',
        label: t(`${I18N_KEY}.actions.approved`),
        visible: (row) => isFactoryPending(row),
        onClick: handleApprove,
      },
      {
        id: 'reject',
        label: t(`${I18N_KEY}.actions.reject`),
        visible: (row) => isFactoryPending(row),
        onClick: (row) => setRejectFactoryId(row.id),
      },
      {
        id: 'renew',
        label: t(`${I18N_KEY}.actions.renew`),
        visible: (row) => isFactorySuspended(row),
        onClick: (row) => handleStatusChange(row, 'active'),
      },
      {
        id: 'delete',
        label: t(`${I18N_KEY}.actions.delete`),
        variant: 'danger',
        visible: (row) => !isFactoryPending(row),
        onClick: handleDeleteFactory,
      },
      {
        id: 'message',
        label: t(`${I18N_KEY}.actions.message`),
        onClick: () => {},
      },
    ],
    [handleApprove, handleDeleteFactory, handleStatusChange, t],
  )

  const columns = useMemo(
    () => [
      { key: 'name', header: t(`${I18N_KEY}.columns.name`) },
      { key: 'email', header: t(`${I18N_KEY}.columns.email`) },
      { key: 'phone', header: t(`${I18N_KEY}.columns.phone`) },
      {
        key: 'registered',
        header: t(`${I18N_KEY}.columns.registered`),
        render: (value) => formatFactoryRegisteredDate(value),
      },
      {
        key: 'commission',
        header: t(`${I18N_KEY}.columns.commission`),
        render: (value, row) => (
          <SupplierCommissionCell
            i18nKey={I18N_KEY}
            value={value}
            onChange={(next) => handleCommissionChange(row, next)}
          />
        ),
      },
      {
        key: 'status',
        header: t(`${I18N_KEY}.columns.status`),
        render: (value) => <SupplierStatusBadge status={value} />,
      },
      {
        key: 'action',
        header: t(`${I18N_KEY}.columns.action`),
        render: (_, row) => (
          <SupplierRowActionMenu row={row} actions={menuActions} />
        ),
      },
    ],
    [handleCommissionChange, menuActions, t],
  )

  const stats = statsResponse?.stats

  const statCards = [
    {
      label: t(`${I18N_KEY}.stats.totalFactories`),
      value: statsLoading ? '…' : formatStatValue(stats?.totalFactories),
    },
    {
      label: t(`${I18N_KEY}.stats.active`),
      value: statsLoading ? '…' : formatStatValue(stats?.active),
    },
    {
      label: t(`${I18N_KEY}.stats.underReview`),
      value: statsLoading ? '…' : formatStatValue(stats?.underReview),
    },
    {
      label: t(`${I18N_KEY}.stats.suspended`),
      value: statsLoading ? '…' : formatStatValue(stats?.suspended),
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

      <DataTable
        showTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id)
          setSearchQuery('')
          setDebouncedSearch('')
          setPage(1)
        }}
        showSearch
        searchValue={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value)
          setPage(1)
        }}
        searchPlaceholder={t(`${I18N_KEY}.searchPlaceholder`)}
        columns={columns}
        data={tableRows}
        emptyMessage={t(`${I18N_KEY}.empty`)}
        loading={factoriesLoading && !factoriesResponse}
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
          summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
            from: paginationFrom,
            to: paginationTo,
            total,
          }),
          previousLabel: t(`${I18N_KEY}.pagination.previous`),
          nextLabel: t(`${I18N_KEY}.pagination.next`),
        }}
      />

      <SupplierDetailsModal
        i18nKey={I18N_KEY}
        formatRegisteredDate={formatFactoryRegisteredDate}
        open={Boolean(detailFactoryId)}
        factoryId={detailFactoryId}
        onClose={() => setDetailFactoryId(null)}
      />

      <FactoryRejectModal
        open={Boolean(rejectFactoryId)}
        factoryId={rejectFactoryId}
        onClose={() => setRejectFactoryId(null)}
        onRejected={() => {
          if (detailFactoryId === rejectFactoryId) {
            setDetailFactoryId(null)
          }
        }}
      />
    </div>
  )
}
