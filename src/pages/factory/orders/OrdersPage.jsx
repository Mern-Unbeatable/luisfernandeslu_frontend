import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiAlertCircle,
  FiDollarSign,
  FiHome,
  FiInfo,
} from 'react-icons/fi'
import StatusCard from '@/components/data-display/StatusCard'
import DataTable, {
  StatusBadge,
} from '@/components/data-display/DataTable/DataTable'
import OrderDetails from '@/components/data-display/OrderDetails'
import {
  useGetFactoryOrderByIdQuery,
  useGetFactoryOrderCompaniesQuery,
  useGetFactoryOrdersQuery,
  useUpdateFactoryOrderStatusMutation,
} from '@/features/factory-orders/factoryOrderApi'

const PAGE_SIZE = 10

const STATUS_FILTER_OPTIONS = [
  { value: 'all', labelKey: 'allStatus' },
  { value: 'new', apiLabel: 'New', i18nKey: 'new' },
  { value: 'in_production', apiLabel: 'In Production', i18nKey: 'inProduction' },
  { value: 'produced', apiLabel: 'Produced', i18nKey: 'produced' },
  { value: 'ready', apiLabel: 'Ready', i18nKey: 'ready' },
  { value: 'assigned', apiLabel: 'Assigned', i18nKey: 'assigned' },
  { value: 'cancel', apiLabel: 'Cancel', i18nKey: 'cancel' },
]

const STATUS_PATCH = {
  in_production: 'IN_PRODUCTION',
  produced: 'PRODUCED',
  ready: 'READY',
}
function formatMoney(value, currency = 'EUR') {
  if (value == null || value === '') return '—'
  const amount = Number(value)
  if (Number.isNaN(amount)) return String(value)
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : `${currency} `
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-CA')
}

function toBadgeStatus(status, orderStatus) {
  const raw = String(status || orderStatus || '')
    .trim()
    .toLowerCase()
    .replace(/_/g, ' ')
  return raw
}

function getStatusLabel(statusValue, t) {
  const option = STATUS_FILTER_OPTIONS.find(
    (item) =>
      item.value === statusValue
      || item.apiLabel?.toLowerCase() === String(statusValue || '').toLowerCase(),
  )
  if (option?.i18nKey) return t(`factoryOrders.status.${option.i18nKey}`)
  if (option?.labelKey) return t(`factoryOrders.${option.labelKey}`)
  return statusValue || '—'
}

function mapOrderRow(order) {
  const currency = order.currency || 'EUR'
  return {
    id: order.id,
    orderId: order.orderNumber,
    supplierName: order.companyName || order.supplier?.name || '—',
    companyId: order.companyId,
    total: formatMoney(order.total, currency),
    totalRaw: Number(order.total) || 0,
    installmentAmount:
      order.installmentAmount == null
        ? '—'
        : formatMoney(order.installmentAmount, currency),
    status: order.status,
    orderStatus: order.orderStatus,
    badgeStatus: toBadgeStatus(order.status, order.orderStatus),
    installmentNumber: order.installmentNumber ?? '—',
    date: formatDate(order.date),
    actions: order.actions || {},
  }
}

function mapDetailOrder(apiOrder) {
  if (!apiOrder) return null

  const currency = apiOrder.payment?.currency || 'EUR'
  const hasInstallment =
    (apiOrder.installments?.length || 0) > 0
    || (apiOrder.installmentBreakdown?.length || 0) > 0

  const paidAmount =
    Number(apiOrder.payment?.totalOrderAmount || 0)
    - Number(apiOrder.payment?.remainingAmount || 0)

  return {
    id: apiOrder.id,
    orderId: apiOrder.orderNumber,
    orderDate: formatDate(apiOrder.orderDate),
    status: toBadgeStatus(apiOrder.status, apiOrder.orderStatus),
    statusLabel: apiOrder.status,
    hasInstallment,
    context: 'factory',
    supplier: {
      name: apiOrder.supplier?.name || '—',
      email: apiOrder.supplier?.email || '',
      phone: apiOrder.supplier?.phone || '',
      address: apiOrder.supplier?.address || '',
      region: apiOrder.supplier?.region || '',
      zipCode: apiOrder.supplier?.zipCode || '',
      country: apiOrder.supplier?.country || '',
      project: [
        apiOrder.supplier?.address,
        apiOrder.supplier?.region,
        apiOrder.supplier?.zipCode,
        apiOrder.supplier?.country,
      ]
        .filter(Boolean)
        .join(', '),
    },
    payment: {
      totalPrice: formatMoney(apiOrder.payment?.totalOrderAmount, currency),
      paidAmount: formatMoney(paidAmount, currency),
      remainingBalance: formatMoney(apiOrder.payment?.remainingAmount, currency),
      paidNote: apiOrder.payment?.paymentStatus || '',
      duration: '—',
    },
    products: (apiOrder.products || []).map((item, index) => ({
      id: `${apiOrder.id}-product-${index}`,
      product: item.product || '—',
      category: item.category || '—',
      material: item.material || '—',
      weightSize: item.uom || item.weightSize || '—',
      qty: item.quantity == null ? '—' : String(item.quantity),
      unit: formatMoney(item.unitPrice, currency),
      total: formatMoney(item.total, currency),
    })),
    installmentBreakdown: apiOrder.installmentBreakdown || [],
    installments: apiOrder.installments || [],
  }
}

function getColumns(t) {
  return [
    { key: 'orderId', header: t('factoryOrders.columns.orderId') },
    { key: 'supplierName', header: t('factoryOrders.columns.supplierName') },
    { key: 'total', header: t('factoryOrders.columns.total') },
    {
      key: 'installmentAmount',
      header: t('factoryOrders.columns.installmentAmount'),
    },
    {
      key: 'status',
      header: t('factoryOrders.columns.status'),
      render: (value, row) => (
        <StatusBadge
          status={row.badgeStatus || value}
          label={getStatusLabel(value, t)}
        />
      ),
    },
    {
      key: 'installmentNumber',
      header: t('factoryOrders.columns.installmentNumber'),
    },
    { key: 'date', header: t('factoryOrders.columns.date') },
  ]
}

function OrderDetailsView({ orderId, onBack }) {
  const { data, isLoading, isError } = useGetFactoryOrderByIdQuery(orderId, {
    skip: !orderId,
  })

  const detail = mapDetailOrder(data?.order)

  if (isLoading) {
    return (
      <p className="text-sm text-[var(--secondary-text)]">Loading…</p>
    )
  }

  if (isError || !detail) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[var(--active)]"
        >
          Back
        </button>
        <p className="text-sm text-red-600">Failed to load order details.</p>
      </div>
    )
  }

  return (
    <OrderDetails
      order={detail}
      hasInstallment={detail.hasInstallment}
      status={detail.status}
      context="factory"
      onBack={onBack}
    />
  )
}

export default function OrdersPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [companyId, setCompanyId] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      status,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(companyId !== 'all' ? { companyId } : {}),
    }),
    [page, status, search, companyId],
  )

  const { data: ordersResponse, isLoading } = useGetFactoryOrdersQuery(queryParams)
  const { data: companiesResponse } = useGetFactoryOrderCompaniesQuery()
  const [updateFactoryOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateFactoryOrderStatusMutation()

  const columns = getColumns(t)

  const rows = useMemo(
    () => (ordersResponse?.orders || []).map(mapOrderRow),
    [ordersResponse],
  )

  const pagination = ordersResponse?.pagination || {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  }

  const totalPages = Math.max(1, pagination.totalPages || 1)
  const safePage = Math.min(page, totalPages)

  const companyOptions = useMemo(
    () => [
      { value: 'all', label: t('factoryOrders.allSupplier') },
      ...(companiesResponse?.companies || []).map((company) => ({
        value: company.id,
        label: company.name,
      })),
    ],
    [companiesResponse, t],
  )

  const statusOptions = useMemo(
    () =>
      STATUS_FILTER_OPTIONS.map((option) => ({
        value: option.value,
        label:
          option.value === 'all'
            ? t('factoryOrders.allStatus')
            : t(`factoryOrders.status.${option.i18nKey}`, {
                defaultValue: option.apiLabel,
              }),
      })),
    [t],
  )

  const activeOrdersCount = pagination.total || 0
  const pageRevenue = rows.reduce((sum, row) => sum + (row.totalRaw || 0), 0)
  const installmentActiveCount = rows.filter(
    (row) => row.installmentAmount !== '—',
  ).length

  const handleStatusUpdate = async (row, patchStatus) => {
    if (!row?.id || isUpdatingStatus) return
    try {
      await updateFactoryOrderStatus({
        id: row.id,
        status: patchStatus,
      }).unwrap()
    } catch {
    }
  }

  const getRowActions = (row) => {
    const rowActions = [
      {
        id: 'see-details',
        label: t('factoryOrders.seeDetails'),
        onClick: (item) => {
          if (item?.actions?.canViewDetails === false) return
          setSelectedOrderId(item.id)
        },
      },
    ]

    if (row?.actions?.canMarkInProduction) {
      rowActions.push({
        id: 'status-in-production',
        label: t('factoryOrders.status.inProduction'),
        onClick: (item) => handleStatusUpdate(item, STATUS_PATCH.in_production),
      })
    }

    if (row?.actions?.canMarkProduced) {
      rowActions.push({
        id: 'status-produced',
        label: t('factoryOrders.status.produced'),
        onClick: (item) => handleStatusUpdate(item, STATUS_PATCH.produced),
      })
    }

    if (row?.actions?.canMarkReady) {
      rowActions.push({
        id: 'status-ready',
        label: t('factoryOrders.status.ready'),
        onClick: (item) => handleStatusUpdate(item, STATUS_PATCH.ready),
      })
    }

    return rowActions
  }

  if (selectedOrderId) {
    return (
      <OrderDetailsView
        orderId={selectedOrderId}
        onBack={() => setSelectedOrderId(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          {t('factoryOrders.title')}
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t('factoryOrders.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          variant="inline"
          label={t('factoryOrders.cards.activeSupplierOrders')}
          value={String(activeOrdersCount)}
          icon={FiHome}
          iconTone="teal"
        />
        <StatusCard
          variant="inline"
          label={t('factoryOrders.cards.totalB2bRevenue')}
          value={formatMoney(pageRevenue)}
          icon={FiDollarSign}
          iconTone="teal"
        />
        <StatusCard
          variant="summary"
          label={t('factoryOrders.cards.installmentActive')}
          value={String(installmentActiveCount)}
          description={t('factoryOrders.cards.installmentActiveDesc')}
          icon={FiInfo}
          iconTone="purple"
        />
        <StatusCard
          variant="status"
          label={t('factoryOrders.cards.paymentOverdue')}
          value="—"
          description={t('factoryOrders.cards.paymentOverdueDesc')}
          tone="danger"
          icon={FiAlertCircle}
        />
      </div>

      <DataTable
        columns={columns}
        data={rows}
        emptyMessage={
          isLoading
            ? t('common.loading', { defaultValue: 'Loading…' })
            : t('common.noData', { defaultValue: 'No orders found.' })
        }
        showSearch
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        searchPlaceholder={t('factoryOrders.searchPlaceholder')}
        showFilters
        filterLabel={t('factoryOrders.sortBy')}
        filters={[
          {
            id: 'supplier',
            value: companyId,
            onChange: (value) => {
              setCompanyId(value)
              setPage(1)
            },
            options: companyOptions,
          },
          {
            id: 'status',
            value: status,
            onChange: (value) => {
              setStatus(value)
              setPage(1)
            },
            options: statusOptions,
          },
        ]}
        showActions
        actionType="menu"
        getActions={getRowActions}
        showPagination
        pagination={{
          page: safePage,
          pageSize: PAGE_SIZE,
          total: pagination.total || 0,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}
