import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'
import {
  useApproveAdminTransporterMutation,
  useDeleteAdminTransporterMutation,
  useGetAdminTransporterStatsQuery,
  useGetAdminTransportersQuery,
  useUpdateAdminTransporterCommissionMutation,
  useUpdateAdminTransporterStatusMutation,
} from '@/features/admin/adminTransporterApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import SupplierCommissionCell from '../supplier-management/components/SupplierCommissionCell'
import SupplierDetailsModal from '../supplier-management/components/SupplierDetailsModal'
import SupplierRowActionMenu from '../supplier-management/components/SupplierRowActionMenu'
import SupplierStatusBadge from '../supplier-management/components/SupplierStatusBadge'
import TransporterRejectModal from './components/TransporterRejectModal'
import {
  ADMIN_TRANSPORTER_TABS,
  formatTransporterRegisteredDate,
} from './data/transportersDemo'

const PAGE_SIZE = 20
const I18N_KEY = 'adminTransporterManagement'

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

function getTransporterStatusCode(row) {
  return String(row?.statusCode || row?.status || '').toUpperCase()
}

function isTransporterActive(row) {
  return getTransporterStatusCode(row) === 'ACTIVE'
}

function isTransporterPending(row) {
  const code = getTransporterStatusCode(row)
  const verification = String(row?.verificationStatus || '').toUpperCase()
  return (
    code === 'PENDING' ||
    code === 'PENDING_VERIFICATION' ||
    code === 'UNDER_REVIEW' ||
    verification === 'PENDING_REVIEW' ||
    verification === 'UNDER_REVIEW'
  )
}

function isTransporterSuspended(row) {
  return getTransporterStatusCode(row) === 'SUSPENDED'
}

function mapTransporterRow(transporter) {
  return {
    ...transporter,
    registered: transporter.registeredDate ?? transporter.registered,
    commission: formatCommissionPercent(transporter.commissionPercent),
  }
}

function tabToApiStatus(tabId) {
  if (tabId === 'pending') return 'pending'
  if (tabId === 'suspended') return 'suspended'
  return 'all'
}

export default function TransporterManagementPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detailTransporterId, setDetailTransporterId] = useState(null)
  const [rejectTransporterId, setRejectTransporterId] = useState(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  const { data: statsResponse, isLoading: statsLoading } =
    useGetAdminTransporterStatsQuery()

  const { data: transportersResponse, isLoading: transportersLoading } =
    useGetAdminTransportersQuery({
      status: tabToApiStatus(activeTab),
      search: debouncedSearch,
      page,
      limit: PAGE_SIZE,
    })

  const [approveTransporter] = useApproveAdminTransporterMutation()
  const [updateTransporterStatus] = useUpdateAdminTransporterStatusMutation()
  const [updateTransporterCommission] = useUpdateAdminTransporterCommissionMutation()
  const [deleteTransporter] = useDeleteAdminTransporterMutation()

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
        approveTransporter(row.id).unwrap(),
        `${I18N_KEY}.approveSuccess`,
      ),
    [approveTransporter, runAction],
  )

  const handleStatusChange = useCallback(
    (row, status) =>
      runAction(
        updateTransporterStatus({ transporterId: row.id, status }).unwrap(),
        status === 'active'
          ? `${I18N_KEY}.renewSuccess`
          : `${I18N_KEY}.statusUpdated`,
      ),
    [runAction, updateTransporterStatus],
  )

  const handleCommissionChange = useCallback(
    async (row, nextValue) => {
      const commissionPercent = parseCommissionPercent(nextValue)
      if (commissionPercent == null) {
        toast.error(t(`${I18N_KEY}.actionFailed`))
        return
      }

      await runAction(
        updateTransporterCommission({
          transporterId: row.id,
          commissionPercent,
        }).unwrap(),
        `${I18N_KEY}.commissionUpdated`,
      )
    },
    [runAction, t, updateTransporterCommission],
  )

  const handleDeleteTransporter = useCallback(
    async (row) => {
      const confirmed = window.confirm(
        t(`${I18N_KEY}.deleteConfirm`, { name: row.name }),
      )
      if (!confirmed) return

      try {
        const data = await deleteTransporter(row.id).unwrap()
        if (data?.success === false) {
          toast.error(getAuthErrorMessage(data, t(`${I18N_KEY}.actionFailed`)))
          return
        }
        if (detailTransporterId === row.id) {
          setDetailTransporterId(null)
        }
        if (rejectTransporterId === row.id) {
          setRejectTransporterId(null)
        }
        toast.success(data?.message || t(`${I18N_KEY}.deleteSuccess`))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
      }
    },
    [deleteTransporter, detailTransporterId, rejectTransporterId, t],
  )

  const tabs = useMemo(
    () =>
      ADMIN_TRANSPORTER_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const tableRows = useMemo(
    () => (transportersResponse?.transporters ?? []).map(mapTransporterRow),
    [transportersResponse],
  )

  const paginationMeta = transportersResponse?.pagination
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
        onClick: (row) => setDetailTransporterId(row.id),
      },
      {
        id: 'suspend',
        label: t(`${I18N_KEY}.actions.suspend`),
        visible: (row) => isTransporterActive(row) && !isTransporterPending(row),
        onClick: (row) => handleStatusChange(row, 'suspended'),
      },
      {
        id: 'approved',
        label: t(`${I18N_KEY}.actions.approved`),
        visible: (row) => isTransporterPending(row),
        onClick: handleApprove,
      },
      {
        id: 'reject',
        label: t(`${I18N_KEY}.actions.reject`),
        visible: (row) => isTransporterPending(row),
        onClick: (row) => setRejectTransporterId(row.id),
      },
      {
        id: 'renew',
        label: t(`${I18N_KEY}.actions.renew`),
        visible: (row) => isTransporterSuspended(row),
        onClick: (row) => handleStatusChange(row, 'active'),
      },
      {
        id: 'delete',
        label: t(`${I18N_KEY}.actions.delete`),
        variant: 'danger',
        visible: (row) => !isTransporterPending(row),
        onClick: handleDeleteTransporter,
      },
      {
        id: 'message',
        label: t(`${I18N_KEY}.actions.message`),
        onClick: () => {},
      },
    ],
    [handleApprove, handleDeleteTransporter, handleStatusChange, t],
  )

  const columns = useMemo(
    () => [
      { key: 'name', header: t(`${I18N_KEY}.columns.name`) },
      { key: 'email', header: t(`${I18N_KEY}.columns.email`) },
      { key: 'phone', header: t(`${I18N_KEY}.columns.phone`) },
      {
        key: 'registered',
        header: t(`${I18N_KEY}.columns.registered`),
        render: (value) => formatTransporterRegisteredDate(value),
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
      label: t(`${I18N_KEY}.stats.totalTransporters`),
      value: statsLoading ? '…' : formatStatValue(stats?.totalTransporters),
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
        loading={transportersLoading && !transportersResponse}
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
        formatRegisteredDate={formatTransporterRegisteredDate}
        open={Boolean(detailTransporterId)}
        transporterId={detailTransporterId}
        onClose={() => setDetailTransporterId(null)}
      />

      <TransporterRejectModal
        open={Boolean(rejectTransporterId)}
        transporterId={rejectTransporterId}
        onClose={() => setRejectTransporterId(null)}
        onRejected={() => {
          if (detailTransporterId === rejectTransporterId) {
            setDetailTransporterId(null)
          }
        }}
      />
    </div>
  )
}
