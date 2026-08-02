import { useMemo, useState } from 'react'
import DataTable from '../components/data-display/DataTable/DataTable'
import StatusBadge from '../components/data-display/DataTable/StatusBadge'

const ALL_ROWS = [
  {
    id: 1,
    poNumber: 'PO-2001',
    factoryName: 'ABC Corp',
    total: '$4,500,000',
    installmentAmount: '$4,500,000',
    status: 'Produced',
    installmentNumber: '1',
    date: '12/05/2025',
  },
  {
    id: 2,
    poNumber: 'PO-2002',
    factoryName: 'ABC Corp',
    total: '$4,500,000',
    installmentAmount: '$4,500,000',
    status: 'In Production',
    installmentNumber: '1',
    date: '12/05/2025',
  },
  {
    id: 3,
    poNumber: 'PO-2003',
    factoryName: 'ABC Corp',
    total: '$4,500,000',
    installmentAmount: '$4,500,000',
    status: 'Ready',
    installmentNumber: '1',
    date: '12/05/2025',
  },
  {
    id: 4,
    poNumber: 'PO-2004',
    factoryName: 'ABC Corp',
    total: '$4,500,000',
    installmentAmount: '$4,500,000',
    status: 'Assigned',
    installmentNumber: '1',
    date: '12/05/2025',
  },
  {
    id: 5,
    poNumber: 'PO-2005',
    factoryName: 'ABC Corp',
    total: '$4,500,000',
    installmentAmount: '$4,500,000',
    status: 'Cancel',
    installmentNumber: '1',
    date: '12/05/2025',
  },
  {
    id: 6,
    poNumber: 'PO-2006',
    factoryName: 'ABC Corp',
    total: '$4,500,000',
    installmentAmount: '$4,500,000',
    status: 'Completed',
    installmentNumber: '1',
    date: '12/05/2025',
  },
  {
    id: 7,
    poNumber: 'PO-2007',
    factoryName: 'XYZ Ltd',
    total: '$2,100,000',
    installmentAmount: '$700,000',
    status: 'Ready',
    installmentNumber: '2',
    date: '15/05/2025',
  },
]

const TRANSPORT_ROWS = [
  {
    id: 101,
    poNumber: 'TR-1001',
    factoryName: 'Swift Logistics',
    total: '$12,000',
    installmentAmount: '$12,000',
    status: 'Assigned',
    installmentNumber: '1',
    date: '10/05/2025',
  },
  {
    id: 102,
    poNumber: 'TR-1002',
    factoryName: 'Porto Haul',
    total: '$8,500',
    installmentAmount: '$8,500',
    status: 'In Production',
    installmentNumber: '1',
    date: '11/05/2025',
  },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('orders')
  const [search, setSearch] = useState('')
  const [company, setCompany] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 7

  const sourceRows = activeTab === 'orders' ? ALL_ROWS : TRANSPORT_ROWS

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return sourceRows.filter((row) => {
      const companyOk =
        company === 'all' || row.factoryName.toLowerCase().includes(company)
      const statusOk =
        status === 'all'
        || row.status.toLowerCase() === status.toLowerCase()
      const searchOk =
        !query
        || [
          row.poNumber,
          row.factoryName,
          row.total,
          row.installmentAmount,
          row.status,
          row.installmentNumber,
          row.date,
        ].some((value) => String(value).toLowerCase().includes(query))
      return companyOk && statusOk && searchOk
    })
  }, [sourceRows, company, status, search])

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, page])

  return (
    <section className="w-full bg-slate-100 px-4 py-8 sm:px-6 lg:px-10 xl:px-24">
      <div className="mx-auto w-full max-w-[1440px]">
        <DataTable
          showTabs
          tabs={[
            { id: 'orders', label: 'Orders' },
            { id: 'transport', label: 'Transport Request' },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId)
            setPage(1)
          }}
          showSearch
          searchValue={search}
          searchPlaceholder="Search..."
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          showFilters
          filterLabel="Sort By:"
          filters={[
            {
              id: 'company',
              value: company,
              onChange: (value) => {
                setCompany(value)
                setPage(1)
              },
              options: [
                { value: 'all', label: 'All Company' },
                { value: 'abc', label: 'ABC Corp' },
                { value: 'xyz', label: 'XYZ Ltd' },
                { value: 'swift', label: 'Swift Logistics' },
              ],
            },
            {
              id: 'status',
              value: status,
              onChange: (value) => {
                setStatus(value)
                setPage(1)
              },
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'Produced', label: 'Produced' },
                { value: 'In Production', label: 'In Production' },
                { value: 'Ready', label: 'Ready' },
                { value: 'Assigned', label: 'Assigned' },
                { value: 'Cancel', label: 'Cancel' },
                { value: 'Completed', label: 'Completed' },
              ],
            },
          ]}
          showTable
          columns={[
            { key: 'poNumber', header: 'PO Number' },
            { key: 'factoryName', header: 'Factory Name' },
            { key: 'total', header: 'Total' },
            { key: 'installmentAmount', header: 'Installment Amount' },
            {
              key: 'status',
              header: 'Status',
              render: (value) => <StatusBadge status={value} />,
            },
            { key: 'installmentNumber', header: 'Installment Number' },
            { key: 'date', header: 'Date' },
          ]}
          data={pagedRows}
          showActions
          actionType="menu"
          actions={[
            {
              id: 'view',
              label: 'View',
              onClick: (row) => console.log('View', row),
            },
            {
              id: 'edit',
              label: 'Edit',
              onClick: (row) => console.log('Edit', row),
            },
            {
              id: 'delete',
              label: 'Delete',
              variant: 'danger',
              onClick: (row) => console.log('Delete', row),
            },
          ]}
          showPagination
          pagination={{
            page,
            pageSize,
            total: filteredRows.length,
            onPageChange: setPage,
          }}
        />
      </div>
    </section>
  )
}
