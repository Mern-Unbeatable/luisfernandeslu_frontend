import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CompanyOrdersTable from '@/components/data-display/CompanyOrdersTable/CompanyOrdersTable'
import { COMPANY_ORDERS_LIST } from './data/companyOrdersDemo'

export default function OrdersPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  return (
    <CompanyOrdersTable
      orders={COMPANY_ORDERS_LIST}
      statusFilter={statusFilter}
      onStatusFilterChange={(value) => {
        setStatusFilter(value)
        setPage(1)
      }}
      page={page}
      pageSize={10}
      onPageChange={setPage}
      onViewOrder={(row) => navigate(`/company/orders/${row.id}`)}
    />
  )
}
