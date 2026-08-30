import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import SupplierRowActionMenu from '../supplier-management/components/SupplierRowActionMenu'
import {
  useGetAdminOrdersQuery,
  useDeleteAdminOrderMutation,
  useUpdateAdminOrderStatusMutation,
} from '@/features/admin/adminOrderApi'
import {
  getAdminOrderChangeableStatuses,
  getAdminOrderStatusOptions,
  mapAdminOrder,
} from '@/features/admin/adminOrderMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import { confirmDelete } from '@/utils/confirmDialog'
import AdminOrderCancelModal from './components/AdminOrderCancelModal'
import OrderCustomerTypeBadge from './components/OrderCustomerTypeBadge'
import OrderStatusBadge from './components/OrderStatusBadge'
import { ADMIN_ORDER_TABS, formatOrderMoney } from './data/ordersAdminDemo'

const I18N_KEY = 'adminOrders'
const PAGE_SIZE = 20

export default function OrdersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('supplier')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [cancelTarget, setCancelTarget] = useState(null)

  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdminOrderStatusMutation()

  const [deleteOrder] = useDeleteAdminOrderMutation()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  useEffect(() => {
    setPage(1)
  }, [activeTab, customerTypeFilter, statusFilter, debouncedSearch])

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminOrdersQuery({
    tab: activeTab,
    ...(activeTab === 'supplier' ? { customerType: customerTypeFilter } : {}),
    status: statusFilter,
    search: debouncedSearch,
    page,
    limit: PAGE_SIZE,
  })

  const rows = useMemo(
    () => (data?.orders ?? []).map(mapAdminOrder),
    [data?.orders],
  )

  const paginationMeta = data?.pagination
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

  const statusOptions = useMemo(
    () => getAdminOrderStatusOptions(activeTab),
    [activeTab],
  )

  const runStatusUpdate = useCallback(
    async (row, status, reason) => {
      try {
        const result = await updateOrderStatus({
          orderId: row.id,
          status,
          reason,
        }).unwrap()

        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.actionFailed`)))
          return false
        }

        toast.success(result?.message || t(`${I18N_KEY}.statusUpdated`))
        return true
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
        return false
      }
    },
    [updateOrderStatus, t],
  )

  const handleAccept = useCallback(
    (row) => runStatusUpdate(row, 'pending'),
    [runStatusUpdate],
  )

  const handleStatusChange = useCallback(
    (row, status) => {
      if (status === 'cancel') {
        setCancelTarget(row)
        return
      }
      runStatusUpdate(row, status)
    },
    [runStatusUpdate],
  )

  const handleCancelConfirm = useCallback(
    async (reason) => {
      if (!cancelTarget) return
      const ok = await runStatusUpdate(
        cancelTarget,
        'cancel',
        reason || undefined,
      )
      if (ok) setCancelTarget(null)
    },
    [cancelTarget, runStatusUpdate],
  )

  const handleDelete = useCallback(
    async (row) => {
      const confirmed = await confirmDelete({
        title: t(`${I18N_KEY}.deleteConfirmTitle`),
        text: t(`${I18N_KEY}.deleteConfirm`, { id: row.orderId }),
        confirmText: t(`${I18N_KEY}.deleteConfirmButton`),
        cancelText: t(`${I18N_KEY}.deleteCancelButton`),
      })
      if (!confirmed) return

      try {
        const result = await deleteOrder(row.id).unwrap()
        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.actionFailed`)))
          return
        }
        toast.success(result?.message || t(`${I18N_KEY}.deleteSuccess`))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
      }
    },
    [deleteOrder, t],
  )

  const getRowActions = useCallback(
    (row) => {
      const actions = [
        {
          id: 'details',
          label: t(`${I18N_KEY}.actions.seeDetails`),
          variant: 'primary',
          onClick: (item) => navigate(`/admin/orders/${item.id}`),
        },
      ]

      if (row.status === 'new') {
        actions.push({
          id: 'accept',
          label: t(`${I18N_KEY}.actions.accept`),
          onClick: handleAccept,
        })
      } else {
        const changeableStatuses = getAdminOrderChangeableStatuses(
          activeTab,
          row.status,
        )

        if (changeableStatuses.length > 0) {
          actions.push({
            id: 'status-section',
            label: t(`${I18N_KEY}.actions.statusSection`),
            variant: 'section',
          })

          changeableStatuses.forEach((status) => {
            actions.push({
              id: `status-${status}`,
              label: t(`${I18N_KEY}.status.${status}`),
              variant: status === 'cancel' ? 'danger' : undefined,
              onClick: (item) => handleStatusChange(item, status),
            })
          })
        }
      }

      actions.push({
        id: 'delete',
        label: t(`${I18N_KEY}.actions.delete`),
        variant: 'danger',
        onClick: handleDelete,
      })

      return actions
    },
    [t, navigate, activeTab, handleAccept, handleStatusChange, handleDelete],
  )

  const tabs = useMemo(
    () =>
      ADMIN_ORDER_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const isSupplierTab = activeTab === 'supplier'

  const columns = useMemo(
    () => [
      { key: 'orderId', header: t(`${I18N_KEY}.columns.orderId`) },
      { key: 'customerName', header: t(`${I18N_KEY}.columns.customerName`) },
      ...(isSupplierTab
        ? [
            {
              key: 'customerType',
              header: t(`${I18N_KEY}.columns.customerType`),
              render: (value) => (
                <OrderCustomerTypeBadge
                  type={value}
                  label={t(`${I18N_KEY}.customerTypes.${value}`, value)}
                />
              ),
            },
          ]
        : []),
      { key: 'items', header: t(`${I18N_KEY}.columns.items`) },
      {
        key: 'total',
        header: t(`${I18N_KEY}.columns.total`),
        render: (value) => formatOrderMoney(value),
      },
      {
        key: 'commission',
        header: t(`${I18N_KEY}.columns.commission`),
        render: (value) => formatOrderMoney(value),
      },
      {
        key: 'status',
        header: t(`${I18N_KEY}.columns.status`),
        render: (value) => (
          <OrderStatusBadge
            status={value}
            label={t(`${I18N_KEY}.status.${value}`, value)}
          />
        ),
      },
      { key: 'date', header: t(`${I18N_KEY}.columns.date`) },
      {
        key: 'action',
        header: t(`${I18N_KEY}.columns.action`),
        render: (_, row) => (
          <SupplierRowActionMenu row={row} actions={getRowActions(row)} />
        ),
      },
    ],
    [t, getRowActions, isSupplierTab],
  )

  const tableFilters = useMemo(() => {
    const statusFilterConfig = {
      id: 'status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: t(`${I18N_KEY}.filters.allStatus`) },
        ...statusOptions.map((status) => ({
          value: status,
          label: t(`${I18N_KEY}.status.${status}`),
        })),
      ],
    }

    if (!isSupplierTab) {
      return [statusFilterConfig]
    }

    return [
      {
        id: 'customerType',
        value: customerTypeFilter,
        onChange: setCustomerTypeFilter,
        options: [
          {
            value: 'all',
            label: t(`${I18N_KEY}.filters.allCustomerType`),
          },
          {
            value: 'company',
            label: t(`${I18N_KEY}.customerTypes.company`),
          },
          {
            value: 'customer',
            label: t(`${I18N_KEY}.customerTypes.customer`),
          },
        ],
      },
      statusFilterConfig,
    ]
  }, [
    t,
    isSupplierTab,
    statusFilter,
    statusOptions,
    customerTypeFilter,
  ])

  const showInitialLoading = isLoading && !data

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

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, t(`${I18N_KEY}.loadFailed`))}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t(`${I18N_KEY}.retry`)}
          </button>
        </div>
      ) : null}

      <div className={isFetching && data ? 'opacity-60 transition-opacity' : ''}>
        <DataTable
          showTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => {
            setActiveTab(id)
            setSearchQuery('')
            setCustomerTypeFilter('all')
            setStatusFilter('all')
            setPage(1)
          }}
          showSearch
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={t(`${I18N_KEY}.searchPlaceholder`)}
          showFilters
          filterLabel={t(`${I18N_KEY}.filterLabel`)}
          filters={tableFilters}
          columns={columns}
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

      <AdminOrderCancelModal
        open={Boolean(cancelTarget)}
        orderId={cancelTarget?.id}
        orderLabel={cancelTarget?.orderId}
        isSubmitting={isUpdatingStatus}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  )
}
