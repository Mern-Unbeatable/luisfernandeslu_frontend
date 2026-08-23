import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import SupplierRowActionMenu from '../supplier-management/components/SupplierRowActionMenu'
import OrderCustomerTypeBadge from './components/OrderCustomerTypeBadge'
import OrderStatusBadge from './components/OrderStatusBadge'
import {
  ADMIN_ORDERS,
  ADMIN_ORDER_TABS,
  filterOrdersByCustomerType,
  filterOrdersBySearch,
  filterOrdersByStatus,
  filterOrdersByTab,
  formatOrderMoney,
} from './data/ordersAdminDemo'

const I18N_KEY = 'adminOrders'
const PAGE_SIZE = 7

export default function OrdersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('supplier')
  const [searchQuery, setSearchQuery] = useState('')
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(ADMIN_ORDERS)

  const tabs = useMemo(
    () =>
      ADMIN_ORDER_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const filteredRows = useMemo(() => {
    const byTab = filterOrdersByTab(rows, activeTab)
    const byCustomer = filterOrdersByCustomerType(byTab, customerTypeFilter)
    const byStatus = filterOrdersByStatus(byCustomer, statusFilter)
    return filterOrdersBySearch(byStatus, searchQuery)
  }, [rows, activeTab, customerTypeFilter, statusFilter, searchQuery])

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pagedRows = useMemo(
    () =>
      filteredRows.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE,
      ),
    [filteredRows, safePage],
  )

  const paginationFrom =
    filteredRows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const paginationTo = Math.min(safePage * PAGE_SIZE, filteredRows.length)

  const menuActions = useMemo(
    () => [
      {
        id: 'details',
        label: t(`${I18N_KEY}.actions.seeDetails`),
        variant: 'primary',
        onClick: (row) => navigate(`/admin/orders/${row.id}`),
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

  const columns = useMemo(
    () => [
      { key: 'orderId', header: t(`${I18N_KEY}.columns.orderId`) },
      { key: 'customerName', header: t(`${I18N_KEY}.columns.customerName`) },
      {
        key: 'customerType',
        header: t(`${I18N_KEY}.columns.customerType`),
        render: (value) => (
          <OrderCustomerTypeBadge
            type={value}
            label={t(`${I18N_KEY}.customerTypes.${value}`)}
          />
        ),
      },
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
            label={t(`${I18N_KEY}.status.${value}`)}
          />
        ),
      },
      { key: 'date', header: t(`${I18N_KEY}.columns.date`) },
      {
        key: 'action',
        header: t(`${I18N_KEY}.columns.action`),
        render: (_, row) => (
          <SupplierRowActionMenu row={row} actions={menuActions} />
        ),
      },
    ],
    [t, menuActions],
  )

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
        onSearchChange={(value) => {
          setSearchQuery(value)
          setPage(1)
        }}
        searchPlaceholder={t(`${I18N_KEY}.searchPlaceholder`)}
        showFilters
        filterLabel={t(`${I18N_KEY}.filterLabel`)}
        filters={[
          {
            id: 'customerType',
            value: customerTypeFilter,
            onChange: (value) => {
              setCustomerTypeFilter(value)
              setPage(1)
            },
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
          {
            id: 'status',
            value: statusFilter,
            onChange: (value) => {
              setStatusFilter(value)
              setPage(1)
            },
            options: [
              { value: 'all', label: t(`${I18N_KEY}.filters.allStatus`) },
              { value: 'new', label: t(`${I18N_KEY}.status.new`) },
              { value: 'pending', label: t(`${I18N_KEY}.status.pending`) },
              {
                value: 'processing',
                label: t(`${I18N_KEY}.status.processing`),
              },
              { value: 'assigned', label: t(`${I18N_KEY}.status.assigned`) },
              { value: 'completed', label: t(`${I18N_KEY}.status.completed`) },
              { value: 'cancel', label: t(`${I18N_KEY}.status.cancel`) },
            ],
          },
        ]}
        columns={columns}
        data={pagedRows}
        emptyMessage={t(`${I18N_KEY}.empty`)}
        showPagination
        pagination={{
          page: safePage,
          pageSize: PAGE_SIZE,
          total: filteredRows.length,
          from: paginationFrom,
          to: paginationTo,
          hasPrevious: safePage > 1,
          hasNext: safePage < pageCount,
          onPageChange: setPage,
          summaryLabel: t(`${I18N_KEY}.pagination.summary`, {
            from: paginationFrom,
            to: paginationTo,
            total: filteredRows.length,
          }),
          previousLabel: t(`${I18N_KEY}.pagination.previous`),
          nextLabel: t(`${I18N_KEY}.pagination.next`),
        }}
      />
    </div>
  )
}
