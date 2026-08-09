import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'
import SupplierCommissionCell from './components/SupplierCommissionCell'
import SupplierDetailsModal from './components/SupplierDetailsModal'
import SupplierRowActionMenu from './components/SupplierRowActionMenu'
import SupplierStatusBadge from './components/SupplierStatusBadge'
import {
  ADMIN_SUPPLIER_STATS,
  ADMIN_SUPPLIER_TABS,
  ADMIN_SUPPLIERS,
  filterSuppliersBySearch,
  filterSuppliersByTab,
  formatSupplierRegisteredDate,
} from './data/suppliersDemo'

const PAGE_SIZE = 7

export default function SupplierManagementPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [detailSupplier, setDetailSupplier] = useState(null)
  const [rows, setRows] = useState(ADMIN_SUPPLIERS)

  const tabs = useMemo(
    () =>
      ADMIN_SUPPLIER_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const filteredRows = useMemo(() => {
    const byTab = filterSuppliersByTab(rows, activeTab)
    return filterSuppliersBySearch(byTab, searchQuery)
  }, [rows, activeTab, searchQuery])

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

  const handleCommissionChange = useCallback((rowId, commission) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, commission } : row)),
    )
  }, [])

  const menuActions = useMemo(
    () => [
      {
        id: 'details',
        label: t('adminSupplierManagement.actions.seeDetails'),
        variant: 'primary',
        onClick: (row) => setDetailSupplier(row),
      },
      {
        id: 'suspend',
        label: t('adminSupplierManagement.actions.suspend'),
        visible: (row) => row.status.toLowerCase() === 'active',
        onClick: () => {},
      },
      {
        id: 'approved',
        label: t('adminSupplierManagement.actions.approved'),
        visible: (row) => row.status.toLowerCase() === 'pending',
        onClick: () => {},
      },
      {
        id: 'reject',
        label: t('adminSupplierManagement.actions.reject'),
        visible: (row) => row.status.toLowerCase() === 'pending',
        onClick: () => {},
      },
      {
        id: 'renew',
        label: t('adminSupplierManagement.actions.renew'),
        visible: (row) => row.status.toLowerCase() === 'suspended',
        onClick: () => {},
      },
      {
        id: 'delete',
        label: t('adminSupplierManagement.actions.delete'),
        variant: 'danger',
        visible: (row) => row.status.toLowerCase() !== 'pending',
        onClick: () => {},
      },
      {
        id: 'message',
        label: t('adminSupplierManagement.actions.message'),
        onClick: () => {},
      },
    ],
    [t],
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
            onChange={(next) => handleCommissionChange(row.id, next)}
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
    [t, handleCommissionChange, menuActions],
  )

  const statCards = [
    {
      label: t('adminSupplierManagement.stats.totalSuppliers'),
      value: ADMIN_SUPPLIER_STATS.totalSuppliers,
    },
    {
      label: t('adminSupplierManagement.stats.active'),
      value: ADMIN_SUPPLIER_STATS.active,
    },
    {
      label: t('adminSupplierManagement.stats.underReview'),
      value: ADMIN_SUPPLIER_STATS.underReview,
    },
    {
      label: t('adminSupplierManagement.stats.suspended'),
      value: ADMIN_SUPPLIER_STATS.suspended,
    },
  ]

  const paginationFrom =
    filteredRows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const paginationTo = Math.min(safePage * PAGE_SIZE, filteredRows.length)

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
        data={pagedRows}
        emptyMessage={t('adminSupplierManagement.empty')}
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
          summaryLabel: t('adminSupplierManagement.pagination.summary', {
            from: paginationFrom,
            to: paginationTo,
            total: filteredRows.length,
          }),
          previousLabel: t('adminSupplierManagement.pagination.previous'),
          nextLabel: t('adminSupplierManagement.pagination.next'),
        }}
      />

      <SupplierDetailsModal
        formatRegisteredDate={formatSupplierRegisteredDate}
        open={Boolean(detailSupplier)}
        supplier={detailSupplier}
        onClose={() => setDetailSupplier(null)}
      />
    </div>
  )
}
