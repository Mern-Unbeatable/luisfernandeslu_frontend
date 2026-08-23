import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'
import {
  useApproveAdminSupplierMutation,
  useGetAdminSupplierStatsQuery,
  useGetAdminSuppliersQuery,
  useRejectAdminSupplierMutation,
  useUpdateAdminSupplierCommissionMutation,
  useUpdateAdminSupplierStatusMutation,
  useDeleteAdminSupplierMutation,
} from '@/features/admin/adminSupplierApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import SupplierCommissionCell from './components/SupplierCommissionCell'
import SupplierDetailsModal from './components/SupplierDetailsModal'
import SupplierRowActionMenu from './components/SupplierRowActionMenu'
import SupplierStatusBadge from './components/SupplierStatusBadge'
import {
  ADMIN_SUPPLIER_TABS,
  formatSupplierRegisteredDate,
} from './data/suppliersDemo'

const PAGE_SIZE = 20

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

function getSupplierStatusCode(row) {
  return String(row?.statusCode || row?.status || '').toUpperCase()
}

function isSupplierActive(row) {
  return getSupplierStatusCode(row) === 'ACTIVE'
}

function isSupplierPending(row) {
  const code = getSupplierStatusCode(row)
  const verification = String(row?.verificationStatus || '').toUpperCase()
  return (
    code === 'PENDING' ||
    code === 'UNDER_REVIEW' ||
    verification === 'PENDING_REVIEW' ||
    verification === 'UNDER_REVIEW'
  )
}

function isSupplierSuspended(row) {
  return getSupplierStatusCode(row) === 'SUSPENDED'
}

function mapSupplierRow(supplier) {
  return {
    ...supplier,
    registered: supplier.registeredDate ?? supplier.registered,
    commission: formatCommissionPercent(supplier.commissionPercent),
  }
}

function tabToApiStatus(tabId) {
  if (tabId === 'pending') return 'pending'
  if (tabId === 'suspended') return 'suspended'
  return 'all'
}

export default function SupplierManagementPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detailSupplierId, setDetailSupplierId] = useState(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  const { data: statsResponse, isLoading: statsLoading } =
    useGetAdminSupplierStatsQuery()

  const { data: suppliersResponse, isLoading: suppliersLoading } =
    useGetAdminSuppliersQuery({
      status: tabToApiStatus(activeTab),
      search: debouncedSearch,
      page,
      limit: PAGE_SIZE,
    })

  const [approveSupplier] = useApproveAdminSupplierMutation()
  const [rejectSupplier] = useRejectAdminSupplierMutation()
  const [updateSupplierStatus] = useUpdateAdminSupplierStatusMutation()
  const [updateSupplierCommission] = useUpdateAdminSupplierCommissionMutation()
  const [deleteSupplier] = useDeleteAdminSupplierMutation()

  const runAction = useCallback(
    async (promise, fallbackSuccessKey) => {
      try {
        const data = await promise
        if (data?.success === false) {
          toast.error(getAuthErrorMessage(data, t('adminSupplierManagement.actionFailed')))
          return
        }
        toast.success(data?.message || t(fallbackSuccessKey))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t('adminSupplierManagement.actionFailed')))
      }
    },
    [t],
  )

  const handleApprove = useCallback(
    (row) =>
      runAction(
        approveSupplier(row.id).unwrap(),
        'adminSupplierManagement.approveSuccess',
      ),
    [approveSupplier, runAction],
  )

  const handleReject = useCallback(
    async (row) => {
      const confirmed = window.confirm(
        t('adminSupplierManagement.rejectConfirm', { name: row.name }),
      )
      if (!confirmed) return

      await runAction(
        rejectSupplier(row.id).unwrap(),
        'adminSupplierManagement.rejectSuccess',
      )
    },
    [rejectSupplier, runAction, t],
  )

  const handleStatusChange = useCallback(
    (row, status) =>
      runAction(
        updateSupplierStatus({ supplierId: row.id, status }).unwrap(),
        'adminSupplierManagement.statusUpdated',
      ),
    [runAction, updateSupplierStatus],
  )

  const handleCommissionChange = useCallback(
    async (row, nextValue) => {
      const commissionPercent = parseCommissionPercent(nextValue)
      if (commissionPercent == null) {
        toast.error(t('adminSupplierManagement.actionFailed'))
        return
      }

      await runAction(
        updateSupplierCommission({ supplierId: row.id, commissionPercent }).unwrap(),
        'adminSupplierManagement.commissionUpdated',
      )
    },
    [runAction, t, updateSupplierCommission],
  )

  const handleDeleteSupplier = useCallback(
    async (row) => {
      const confirmed = window.confirm(
        t('adminSupplierManagement.deleteConfirm', { name: row.name }),
      )
      if (!confirmed) return

      try {
        const data = await deleteSupplier(row.id).unwrap()
        if (data?.success === false) {
          toast.error(getAuthErrorMessage(data, t('adminSupplierManagement.actionFailed')))
          return
        }
        if (detailSupplierId === row.id) {
          setDetailSupplierId(null)
        }
        toast.success(data?.message || t('adminSupplierManagement.deleteSuccess'))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t('adminSupplierManagement.actionFailed')))
      }
    },
    [deleteSupplier, detailSupplierId, t],
  )

  const tabs = useMemo(
    () =>
      ADMIN_SUPPLIER_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const tableRows = useMemo(
    () => (suppliersResponse?.suppliers ?? []).map(mapSupplierRow),
    [suppliersResponse],
  )

  const paginationMeta = suppliersResponse?.pagination
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
        label: t('adminSupplierManagement.actions.seeDetails'),
        variant: 'primary',
        onClick: (row) => setDetailSupplierId(row.id),
      },
      {
        id: 'suspend',
        label: t('adminSupplierManagement.actions.suspend'),
        visible: (row) => isSupplierActive(row) && !isSupplierPending(row),
        onClick: (row) => handleStatusChange(row, 'suspended'),
      },
      {
        id: 'approved',
        label: t('adminSupplierManagement.actions.approved'),
        visible: (row) => isSupplierPending(row),
        onClick: handleApprove,
      },
      {
        id: 'reject',
        label: t('adminSupplierManagement.actions.reject'),
        visible: (row) => isSupplierPending(row),
        onClick: handleReject,
      },
      {
        id: 'renew',
        label: t('adminSupplierManagement.actions.renew'),
        visible: (row) => isSupplierSuspended(row),
        onClick: (row) => handleStatusChange(row, 'active'),
      },
      {
        id: 'delete',
        label: t('adminSupplierManagement.actions.delete'),
        variant: 'danger',
        visible: (row) => !isSupplierPending(row),
        onClick: handleDeleteSupplier,
      },
      {
        id: 'message',
        label: t('adminSupplierManagement.actions.message'),
        onClick: () => {},
      },
    ],
    [handleApprove, handleDeleteSupplier, handleReject, handleStatusChange, t],
  )

  const columns = useMemo(
    () => [
      { key: 'name', header: t('adminSupplierManagement.columns.name') },
      { key: 'email', header: t('adminSupplierManagement.columns.email') },
      { key: 'phone', header: t('adminSupplierManagement.columns.phone') },
      {
        key: 'registered',
        header: t('adminSupplierManagement.columns.registered'),
        render: (value) => formatSupplierRegisteredDate(value),
      },
      {
        key: 'commission',
        header: t('adminSupplierManagement.columns.commission'),
        render: (value, row) => (
          <SupplierCommissionCell
            value={value}
            onChange={(next) => handleCommissionChange(row, next)}
          />
        ),
      },
      {
        key: 'status',
        header: t('adminSupplierManagement.columns.status'),
        render: (value) => <SupplierStatusBadge status={value} />,
      },
      {
        key: 'action',
        header: t('adminSupplierManagement.columns.action'),
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
      label: t('adminSupplierManagement.stats.totalSuppliers'),
      value: statsLoading ? '…' : formatStatValue(stats?.totalSuppliers),
    },
    {
      label: t('adminSupplierManagement.stats.active'),
      value: statsLoading ? '…' : formatStatValue(stats?.active),
    },
    {
      label: t('adminSupplierManagement.stats.underReview'),
      value: statsLoading ? '…' : formatStatValue(stats?.underReview),
    },
    {
      label: t('adminSupplierManagement.stats.suspended'),
      value: statsLoading ? '…' : formatStatValue(stats?.suspended),
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo
        title={t('adminSupplierManagement.title')}
        description={t('adminSupplierManagement.subtitle')}
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t('adminSupplierManagement.title')}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t('adminSupplierManagement.subtitle')}
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
        searchPlaceholder={t('adminSupplierManagement.searchPlaceholder')}
        columns={columns}
        data={tableRows}
        emptyMessage={t('adminSupplierManagement.empty')}
        loading={suppliersLoading && !suppliersResponse}
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
          summaryLabel: t('adminSupplierManagement.pagination.summary', {
            from: paginationFrom,
            to: paginationTo,
            total,
          }),
          previousLabel: t('adminSupplierManagement.pagination.previous'),
          nextLabel: t('adminSupplierManagement.pagination.next'),
        }}
      />

      <SupplierDetailsModal
        formatRegisteredDate={formatSupplierRegisteredDate}
        open={Boolean(detailSupplierId)}
        supplierId={detailSupplierId}
        onClose={() => setDetailSupplierId(null)}
      />
    </div>
  )
}
