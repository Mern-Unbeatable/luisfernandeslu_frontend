import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from '@/components/data-display/DataTable/DataTable'

const DUMMY_CLIENTS = [
  {
    id: 1,
    name: 'Ralph Edwards',
    registeredDate: '2026-06-11',
    revenueGenerated: '€5000.00',
    commissionEarned: '€500',
    commissionExpiry: '2026-06-11',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Brooklyn Simmons',
    registeredDate: '2026-04-12',
    revenueGenerated: '€7000.00',
    commissionEarned: '€700',
    commissionExpiry: '2026-06-11',
    status: 'Expired',
  },
  {
    id: 3,
    name: 'Darrell Steward',
    registeredDate: '2026-03-17',
    revenueGenerated: '€8000.00',
    commissionEarned: '€800',
    commissionExpiry: '2026-06-11',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Bessie Cooper',
    registeredDate: '2026-02-25',
    revenueGenerated: '€800.00',
    commissionEarned: '€100',
    commissionExpiry: '2026-06-11',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Cody Fisher',
    registeredDate: '2026-01-19',
    revenueGenerated: '€9000.00',
    commissionEarned: '€600',
    commissionExpiry: '2026-06-11',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Floyd Miles',
    registeredDate: '2026-04-25',
    revenueGenerated: '€1000.00',
    commissionEarned: '€500',
    commissionExpiry: '2026-06-11',
    status: 'Active',
  },
  {
    id: 7,
    name: 'Annette Black',
    registeredDate: '2026-05-08',
    revenueGenerated: '€3200.00',
    commissionEarned: '€320',
    commissionExpiry: '2026-07-08',
    status: 'Active',
  },
  {
    id: 8,
    name: 'Jenny Wilson',
    registeredDate: '2026-03-02',
    revenueGenerated: '€4500.00',
    commissionEarned: '€450',
    commissionExpiry: '2026-05-02',
    status: 'Expired',
  },
  {
    id: 9,
    name: 'Robert Fox',
    registeredDate: '2026-02-14',
    revenueGenerated: '€6100.00',
    commissionEarned: '€610',
    commissionExpiry: '2026-08-14',
    status: 'Active',
  },
  {
    id: 10,
    name: 'Savannah Nguyen',
    registeredDate: '2026-01-30',
    revenueGenerated: '€2800.00',
    commissionEarned: '€280',
    commissionExpiry: '2026-04-30',
    status: 'Expired',
  },
  {
    id: 11,
    name: 'Guy Hawkins',
    registeredDate: '2026-05-21',
    revenueGenerated: '€1500.00',
    commissionEarned: '€150',
    commissionExpiry: '2026-08-21',
    status: 'Active',
  },
  {
    id: 12,
    name: 'Esther Howard',
    registeredDate: '2026-04-03',
    revenueGenerated: '€7300.00',
    commissionEarned: '€730',
    commissionExpiry: '2026-07-03',
    status: 'Active',
  },
  {
    id: 13,
    name: 'Cameron Williamson',
    registeredDate: '2026-03-28',
    revenueGenerated: '€2100.00',
    commissionEarned: '€210',
    commissionExpiry: '2026-06-28',
    status: 'Active',
  },
  {
    id: 14,
    name: 'Leslie Alexander',
    registeredDate: '2026-02-09',
    revenueGenerated: '€5400.00',
    commissionEarned: '€540',
    commissionExpiry: '2026-05-09',
    status: 'Expired',
  },
]

const PAGE_SIZE = 7

const STATUS_I18N_KEYS = {
  Active: 'active',
  Expired: 'expired',
}

function getStatusLabel(status, t) {
  const key = STATUS_I18N_KEYS[status]
  return key ? t(`affiliateReferredClients.status.${key}`) : status
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

export default function ReferredClientsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const columns = getColumns(t)

  const filtered = DUMMY_CLIENTS.filter((row) => {
    const q = search.trim().toLowerCase()
    if (!q) return true

    const statusLabel = getStatusLabel(row.status, t).toLowerCase()

    return (
      String(row.name).toLowerCase().includes(q) ||
      String(row.registeredDate).toLowerCase().includes(q) ||
      String(row.revenueGenerated).toLowerCase().includes(q) ||
      String(row.commissionEarned).toLowerCase().includes(q) ||
      String(row.commissionExpiry).toLowerCase().includes(q) ||
      String(row.status).toLowerCase().includes(q) ||
      statusLabel.includes(q)
    )
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

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
        data={paged}
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
          total: filtered.length,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}
