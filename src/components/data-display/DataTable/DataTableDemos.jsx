import { useMemo, useState } from 'react'
import DataTable from './DataTable'
import StatusBadge from './StatusBadge'

const COLUMNS = [
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
]

const ORDER_ROWS = [
  {
    id: 1,
    poNumber: 'PO-2001',
    factoryName: 'ABC Corp',
    total: '€4,500,000',
    installmentAmount: '€1,500,000',
    status: 'Produced',
    installmentNumber: '1',
    date: '12/01/2026',
  },
  {
    id: 2,
    poNumber: 'PO-2002',
    factoryName: 'ABC Corp',
    total: '€2,100,000',
    installmentAmount: '€700,000',
    status: 'In Production',
    installmentNumber: '2',
    date: '18/01/2026',
  },
  {
    id: 3,
    poNumber: 'PO-2003',
    factoryName: 'XYZ Ltd',
    total: '€980,000',
    installmentAmount: '€490,000',
    status: 'Ready',
    installmentNumber: '1',
    date: '22/01/2026',
  },
  {
    id: 4,
    poNumber: 'PO-2004',
    factoryName: 'XYZ Ltd',
    total: '€1,250,000',
    installmentAmount: '€625,000',
    status: 'Assigned',
    installmentNumber: '3',
    date: '28/01/2026',
  },
  {
    id: 5,
    poNumber: 'PO-2005',
    factoryName: 'ABC Corp',
    total: '€640,000',
    installmentAmount: '€320,000',
    status: 'Cancel',
    installmentNumber: '1',
    date: '02/02/2026',
  },
  {
    id: 6,
    poNumber: 'PO-2006',
    factoryName: 'Swift Logistics',
    total: '€3,000,000',
    installmentAmount: '€1,000,000',
    status: 'Completed',
    installmentNumber: '3',
    date: '08/02/2026',
  },
  {
    id: 7,
    poNumber: 'PO-2007',
    factoryName: 'XYZ Ltd',
    total: '€870,000',
    installmentAmount: '€290,000',
    status: 'Ready',
    installmentNumber: '2',
    date: '10/02/2026',
  },
]

const TRANSPORT_ROWS = [
  {
    id: 101,
    poNumber: 'TR-1001',
    factoryName: 'Swift Logistics',
    total: '€120,000',
    installmentAmount: '€40,000',
    status: 'Assigned',
    installmentNumber: '1',
    date: '05/02/2026',
  },
  {
    id: 102,
    poNumber: 'TR-1002',
    factoryName: 'Porto Haul',
    total: '€85,000',
    installmentAmount: '€85,000',
    status: 'In Production',
    installmentNumber: '1',
    date: '11/02/2026',
  },
]

const TABS = [
  { id: 'orders', label: 'Orders' },
  { id: 'transport', label: 'Transport Request' },
]

const MENU_ACTIONS = [
  { id: 'view', label: 'View', onClick: (row) => console.log('view', row) },
  { id: 'edit', label: 'Edit', onClick: (row) => console.log('edit', row) },
  {
    id: 'delete',
    label: 'Delete',
    variant: 'danger',
    onClick: (row) => console.log('delete', row),
  },
]

const BUTTON_ACTIONS = [
  { id: 'view', label: 'View', onClick: (row) => console.log('view', row) },
  {
    id: 'delete',
    label: 'Delete',
    variant: 'danger',
    onClick: (row) => console.log('delete', row),
  },
]

function DemoBlock({ name, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-[var(--primary-text)]">{name}</h3>
      {children}
    </div>
  )
}

function FullFeaturedDemo() {
  const [activeTab, setActiveTab] = useState('orders')
  const [search, setSearch] = useState('')
  const [company, setCompany] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 4

  const source = activeTab === 'orders' ? ORDER_ROWS : TRANSPORT_ROWS

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return source.filter((row) => {
      if (company !== 'all' && row.factoryName.toLowerCase() !== company) {
        return false
      }
      if (status !== 'all' && row.status !== status) return false
      if (!q) return true
      return (
        row.poNumber.toLowerCase().includes(q)
        || row.factoryName.toLowerCase().includes(q)
        || row.status.toLowerCase().includes(q)
      )
    })
  }, [source, search, company, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <DataTable
      showTabs
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={(id) => {
        setActiveTab(id)
        setPage(1)
      }}
      showSearch
      searchValue={search}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      searchPlaceholder="Search PO, factory, status..."
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
            { value: 'all', label: 'All companies' },
            { value: 'abc corp', label: 'ABC Corp' },
            { value: 'xyz ltd', label: 'XYZ Ltd' },
            { value: 'swift logistics', label: 'Swift Logistics' },
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
            { value: 'all', label: 'All status' },
            { value: 'Produced', label: 'Produced' },
            { value: 'In Production', label: 'In Production' },
            { value: 'Ready', label: 'Ready' },
            { value: 'Assigned', label: 'Assigned' },
            { value: 'Cancel', label: 'Cancel' },
            { value: 'Completed', label: 'Completed' },
          ],
        },
      ]}
      columns={COLUMNS}
      data={paged}
      showActions
      actionType="menu"
      actions={MENU_ACTIONS}
      showPagination
      pagination={{
        page: safePage,
        pageSize,
        total: filtered.length,
        onPageChange: setPage,
      }}
    />
  )
}

/** All DataTable prop/layout variants for Home demo. */
export default function DataTableDemos() {
  return (
    <div className="flex flex-col gap-10">
      <DemoBlock name="1. Full — tabs + search + filters + menu actions + pagination">
        <FullFeaturedDemo />
      </DemoBlock>

      <DemoBlock name="2. Action buttons (inline)">
        <DataTable
          columns={COLUMNS}
          data={ORDER_ROWS.slice(0, 3)}
          showActions
          actionType="buttons"
          actions={BUTTON_ACTIONS}
        />
      </DemoBlock>

      <DemoBlock name="3. Table only">
        <DataTable
          columns={COLUMNS}
          data={ORDER_ROWS.slice(0, 3)}
          showTabs={false}
          showSearch={false}
          showFilters={false}
          showActions={false}
          showPagination={false}
        />
      </DemoBlock>

      <DemoBlock name="4. Tabs + table (no search / filters)">
        <TabsOnlyDemo />
      </DemoBlock>

      <DemoBlock name="5. Search + filters (no tabs)">
        <SearchFiltersDemo />
      </DemoBlock>

      <DemoBlock name="6. Loading skeleton">
        <DataTable
          columns={COLUMNS}
          data={[]}
          loading
          skeletonRows={5}
          showActions
          actions={MENU_ACTIONS}
          showPagination
          pagination={{ page: 1, pageSize: 5, total: 20 }}
        />
      </DemoBlock>

      <DemoBlock name="7. Empty state">
        <DataTable
          columns={COLUMNS}
          data={[]}
          emptyMessage="No orders match your filters."
          showSearch
          searchValue=""
          onSearchChange={() => {}}
          showActions
          actions={MENU_ACTIONS}
        />
      </DemoBlock>

      <DemoBlock name="8. No card shell (showCard=false)">
        <DataTable
          showCard={false}
          columns={COLUMNS}
          data={ORDER_ROWS.slice(0, 2)}
          showActions
          actionType="menu"
          actions={MENU_ACTIONS}
        />
      </DemoBlock>

      <DemoBlock name="9. Tabs only toolbar (showTable=false)">
        <DataTable
          showTabs
          tabs={TABS}
          activeTab="orders"
          onTabChange={() => {}}
          showTable={false}
          columns={COLUMNS}
          data={[]}
        />
      </DemoBlock>
    </div>
  )
}

function TabsOnlyDemo() {
  const [activeTab, setActiveTab] = useState('orders')
  const data = activeTab === 'orders' ? ORDER_ROWS.slice(0, 3) : TRANSPORT_ROWS

  return (
    <DataTable
      showTabs
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      columns={COLUMNS}
      data={data}
      showActions
      actionType="menu"
      actions={MENU_ACTIONS}
    />
  )
}

function SearchFiltersDemo() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const data = useMemo(() => {
    const q = search.trim().toLowerCase()
    return ORDER_ROWS.filter((row) => {
      if (status !== 'all' && row.status !== status) return false
      if (!q) return true
      return (
        row.poNumber.toLowerCase().includes(q)
        || row.factoryName.toLowerCase().includes(q)
      )
    }).slice(0, 5)
  }, [search, status])

  return (
    <DataTable
      showSearch
      searchValue={search}
      onSearchChange={setSearch}
      showFilters
      filters={[
        {
          id: 'status',
          value: status,
          onChange: setStatus,
          options: [
            { value: 'all', label: 'All status' },
            { value: 'Produced', label: 'Produced' },
            { value: 'Ready', label: 'Ready' },
            { value: 'Completed', label: 'Completed' },
          ],
        },
      ]}
      columns={COLUMNS}
      data={data}
      showActions
      actions={MENU_ACTIONS}
    />
  )
}
