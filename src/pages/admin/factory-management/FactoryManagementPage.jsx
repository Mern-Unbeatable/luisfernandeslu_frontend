import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'
import SupplierCommissionCell from '../supplier-management/components/SupplierCommissionCell'
import SupplierDetailsModal from '../supplier-management/components/SupplierDetailsModal'
import SupplierRowActionMenu from '../supplier-management/components/SupplierRowActionMenu'
import SupplierStatusBadge from '../supplier-management/components/SupplierStatusBadge'
import {
  ADMIN_FACTORIES,
  ADMIN_FACTORY_STATS,
  ADMIN_FACTORY_TABS,
  filterFactoriesBySearch,
  filterFactoriesByTab,
  formatFactoryRegisteredDate,
} from './data/factoriesDemo'

const PAGE_SIZE = 7
const I18N_KEY = 'adminFactoryManagement'

export default function FactoryManagementPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [detailFactory, setDetailFactory] = useState(null)
  const [rows, setRows] = useState(ADMIN_FACTORIES)

  const tabs = useMemo(
    () =>
      ADMIN_FACTORY_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey),
      })),
    [t],
  )

  const filteredRows = useMemo(() => {
    const byTab = filterFactoriesByTab(rows, activeTab)
    return filterFactoriesBySearch(byTab, searchQuery)
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
        label: t(`${I18N_KEY}.actions.seeDetails`),
        variant: 'primary',
        onClick: (row) => setDetailFactory(row),
      },
      {
        id: 'suspend',
        label: t(`${I18N_KEY}.actions.suspend`),
        visible: (row) => row.status.toLowerCase() === 'active',
        onClick: () => {},
      },
      {
        id: 'approved',
        label: t(`${I18N_KEY}.actions.approved`),
        visible: (row) => row.status.toLowerCase() === 'pending',
        onClick: () => {},
      },
      {
        id: 'reject',
        label: t(`${I18N_KEY}.actions.reject`),
        visible: (row) => row.status.toLowerCase() === 'pending',
        onClick: () => {},
      },
      {
        id: 'renew',
        label: t(`${I18N_KEY}.actions.renew`),
        visible: (row) => row.status.toLowerCase() === 'suspended',
        onClick: () => {},
      },
      {
        id: 'delete',
        label: t(`${I18N_KEY}.actions.delete`),
        variant: 'danger',
        visible: (row) => row.status.toLowerCase() !== 'pending',
        onClick: () => {},
      },
      {
        id: 'message',
        label: t(`${I18N_KEY}.actions.message`),
        onClick: () => {},
      },
    ],
    [t],
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
            onChange={(next) => handleCommissionChange(row.id, next)}
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
    [t, handleCommissionChange, menuActions],
  )

  const statCards = [
    {
      label: t(`${I18N_KEY}.stats.totalFactories`),
      value: ADMIN_FACTORY_STATS.totalFactories,
    },
    {
      label: t(`${I18N_KEY}.stats.active`),
      value: ADMIN_FACTORY_STATS.active,
    },
    {
      label: t(`${I18N_KEY}.stats.underReview`),
      value: ADMIN_FACTORY_STATS.underReview,
    },
    {
      label: t(`${I18N_KEY}.stats.suspended`),
      value: ADMIN_FACTORY_STATS.suspended,
    },
  ]

  const paginationFrom =
    filteredRows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const paginationTo = Math.min(safePage * PAGE_SIZE, filteredRows.length)

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

      <SupplierDetailsModal
        i18nKey={I18N_KEY}
        formatRegisteredDate={formatFactoryRegisteredDate}
        open={Boolean(detailFactory)}
        supplier={detailFactory}
        onClose={() => setDetailFactory(null)}
      />
    </div>
  )
}
