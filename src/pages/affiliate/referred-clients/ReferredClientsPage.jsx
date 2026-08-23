import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from '@/components/data-display/DataTable/DataTable'
import { useGetAffiliateClientsQuery } from '@/features/affiliate/affiliateClientsApi'

const PAGE_SIZE = 20

function getStatusLabel(status, t) {
  const key = String(status || '').toLowerCase()
  if (key === 'active' || key === 'expired') {
    return t(`affiliateReferredClients.status.${key}`)
  }
  return status
}

function StatusPill({ status, label }) {
  const isActive = String(status).toLowerCase() === 'active'
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
        isActive
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-red-100 text-red-600'
      }`}
    >
      {label || status}
    </span>
  )
}

function getColumns(t) {
  return [
    { key: 'name', header: t('affiliateReferredClients.columns.name') },
    {
      key: 'registeredDate',
      header: t('affiliateReferredClients.columns.registeredDate'),
    },
    {
      key: 'revenueGenerated',
      header: t('affiliateReferredClients.columns.revenueGenerated'),
    },
    {
      key: 'commissionEarned',
      header: t('affiliateReferredClients.columns.commissionEarned'),
    },
    {
      key: 'commissionExpiry',
      header: t('affiliateReferredClients.columns.commissionExpiry'),
    },
    {
      key: 'status',
      header: t('affiliateReferredClients.columns.status'),
      render: (value) => (
        <StatusPill status={value} label={getStatusLabel(value, t)} />
      ),
    },
  ]
}

function formatEuro(value) {
  if (value == null || value === '') return '—'
  const amount = Number(value)
  if (!Number.isFinite(amount)) return String(value)
  return `€${amount.toFixed(2)}`
}

function mapClientRow(client) {
  return {
    id: client.id,
    name: client.name,
    registeredDate: client.registeredDate,
    revenueGenerated: formatEuro(client.revenueGenerated),
    commissionEarned: formatEuro(client.commissionEarned),
    commissionExpiry: client.commissionExpiry,
    status: client.status,
  }
}

export default function ReferredClientsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetAffiliateClientsQuery({
    page,
    limit: PAGE_SIZE,
    search,
  })

  const columns = getColumns(t)
  const clients = data?.clients || []
  const pagination = data?.pagination || {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  }

  const rows = useMemo(() => clients.map(mapClientRow), [clients])

  const totalPages = Math.max(1, pagination.totalPages || 1)
  const safePage = Math.min(page, totalPages)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          {t('affiliateReferredClients.title')}
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t('affiliateReferredClients.subtitle')}
        </p>
      </div>

      <DataTable
        columns={columns}
        data={isLoading ? [] : rows}
        showSearch
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        searchPlaceholder={t('affiliateReferredClients.searchPlaceholder')}
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
