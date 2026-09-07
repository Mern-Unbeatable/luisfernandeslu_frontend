import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CompanyOrdersTable from '@/components/data-display/CompanyOrdersTable/CompanyOrdersTable'
import { useGetCompanyOrdersQuery } from '@/features/company/companyOrderApi'
import { mapCompanyOrder } from '@/features/company/companyOrderMappers'

const PAGE_SIZE = 20

export default function OrdersPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [statusFilter])

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetCompanyOrdersQuery({
    page,
    limit: PAGE_SIZE,
    status: statusFilter,
  })

  const orders = useMemo(
    () => (data?.orders ?? []).map(mapCompanyOrder),
    [data?.orders],
  )

  const pagination = data?.pagination
  const total = pagination?.total ?? 0
  const totalPages = Math.max(1, pagination?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const showInitialLoading = isLoading && !data

  if (showInitialLoading) {
    return (
      <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
        {t('companyOrders.loading')}
      </p>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
        <p className="text-sm text-red-700">
          {error?.data?.message || t('companyOrders.loadFailed')}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
        >
          {t('companyOrders.retry')}
        </button>
      </div>
    )
  }

  return (
    <CompanyOrdersTable
      orders={orders}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      page={safePage}
      pageSize={PAGE_SIZE}
      total={total}
      totalPages={totalPages}
      serverPaginated
      isFetching={isFetching}
      onPageChange={setPage}
      onViewOrder={(row) => navigate(`/company/orders/${row.id}`)}
    />
  )
}
