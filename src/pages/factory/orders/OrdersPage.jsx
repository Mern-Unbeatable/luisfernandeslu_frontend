import { useState } from 'react'
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
import { DEMO_ORDER_INSTALLMENTS } from '@/data/demoData'

const STATUS_OPTIONS = [
  'Produced',
  'In Production',
  'Ready',
  'Assigned',
  'Cancel',
  'Completed',
]

const DUMMY_ORDERS = [
  {
    id: 1,
    orderId: 'SU-1001',
    supplierName: 'Savannah Nguyen',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Produced',
    installmentNumber: 1,
    date: '2026-05-01',
  },
  {
    id: 2,
    orderId: 'SU-1002',
    supplierName: 'Savannah Nguyen',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'In Production',
    installmentNumber: 2,
    date: '2026-05-01',
  },
  {
    id: 3,
    orderId: 'SU-1003',
    supplierName: 'Annette Black',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Ready',
    installmentNumber: 3,
    date: '2026-05-01',
  },
  {
    id: 4,
    orderId: 'SU-1004',
    supplierName: 'Cody Fisher',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Assigned',
    installmentNumber: 4,
    date: '2026-05-01',
  },
  {
    id: 5,
    orderId: 'SU-1005',
    supplierName: 'Jenny Wilson',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Cancel',
    installmentNumber: 5,
    date: '2026-05-01',
  },
  {
    id: 6,
    orderId: 'SU-1006',
    supplierName: 'Ralph Edwards',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Completed',
    installmentNumber: 6,
    date: '2026-05-01',
  },
  {
    id: 7,
    orderId: 'SU-1007',
    supplierName: 'Robert Fox',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'In Production',
    installmentNumber: 7,
    date: '2026-05-01',
  },
  {
    id: 8,
    orderId: 'SU-1008',
    supplierName: 'Savannah Nguyen',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Produced',
    installmentNumber: 8,
    date: '2026-05-02',
  },
  {
    id: 9,
    orderId: 'SU-1009',
    supplierName: 'Annette Black',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Ready',
    installmentNumber: 9,
    date: '2026-05-02',
  },
  {
    id: 10,
    orderId: 'SU-1010',
    supplierName: 'Cody Fisher',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Assigned',
    installmentNumber: 10,
    date: '2026-05-02',
  },
  {
    id: 11,
    orderId: 'SU-1011',
    supplierName: 'Jenny Wilson',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Cancel',
    installmentNumber: 11,
    date: '2026-05-02',
  },
  {
    id: 12,
    orderId: 'SU-1012',
    supplierName: 'Ralph Edwards',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Completed',
    installmentNumber: 12,
    date: '2026-05-02',
  },
  {
    id: 13,
    orderId: 'SU-1013',
    supplierName: 'Robert Fox',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'In Production',
    installmentNumber: 13,
    date: '2026-05-03',
  },
  {
    id: 14,
    orderId: 'SU-1014',
    supplierName: 'Savannah Nguyen',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Produced',
    installmentNumber: 14,
    date: '2026-05-03',
  },
  {
    id: 15,
    orderId: 'SU-1015',
    supplierName: 'Annette Black',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Ready',
    installmentNumber: 15,
    date: '2026-05-03',
  },
  {
    id: 16,
    orderId: 'SU-1016',
    supplierName: 'Cody Fisher',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Assigned',
    installmentNumber: 16,
    date: '2026-05-03',
  },
  {
    id: 17,
    orderId: 'SU-1017',
    supplierName: 'Jenny Wilson',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Cancel',
    installmentNumber: 17,
    date: '2026-05-04',
  },
  {
    id: 18,
    orderId: 'SU-1018',
    supplierName: 'Ralph Edwards',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Completed',
    installmentNumber: 18,
    date: '2026-05-04',
  },
  {
    id: 19,
    orderId: 'SU-1019',
    supplierName: 'Robert Fox',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'In Production',
    installmentNumber: 19,
    date: '2026-05-04',
  },
  {
    id: 20,
    orderId: 'SU-1020',
    supplierName: 'Savannah Nguyen',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Produced',
    installmentNumber: 20,
    date: '2026-05-04',
  },
  {
    id: 21,
    orderId: 'SU-1021',
    supplierName: 'Annette Black',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Ready',
    installmentNumber: 21,
    date: '2026-05-05',
  },
  {
    id: 22,
    orderId: 'SU-1022',
    supplierName: 'Cody Fisher',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Assigned',
    installmentNumber: 22,
    date: '2026-05-05',
  },
  {
    id: 23,
    orderId: 'SU-1023',
    supplierName: 'Jenny Wilson',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Cancel',
    installmentNumber: 23,
    date: '2026-05-05',
  },
  {
    id: 24,
    orderId: 'SU-1024',
    supplierName: 'Ralph Edwards',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Completed',
    installmentNumber: 24,
    date: '2026-05-05',
  },
  {
    id: 25,
    orderId: 'SU-1025',
    supplierName: 'Robert Fox',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'In Production',
    installmentNumber: 25,
    date: '2026-05-06',
  },
  {
    id: 26,
    orderId: 'SU-1026',
    supplierName: 'Savannah Nguyen',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Produced',
    installmentNumber: 26,
    date: '2026-05-06',
  },
  {
    id: 27,
    orderId: 'SU-1027',
    supplierName: 'Annette Black',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Ready',
    installmentNumber: 27,
    date: '2026-05-06',
  },
  {
    id: 28,
    orderId: 'SU-1028',
    supplierName: 'Cody Fisher',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Assigned',
    installmentNumber: 28,
    date: '2026-05-06',
  },
  {
    id: 29,
    orderId: 'SU-1029',
    supplierName: 'Jenny Wilson',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Cancel',
    installmentNumber: 29,
    date: '2026-05-07',
  },
  {
    id: 30,
    orderId: 'SU-1030',
    supplierName: 'Ralph Edwards',
    total: '$4,500,000',
    installmentAmount: '$4,500',
    status: 'Completed',
    installmentNumber: 30,
    date: '2026-05-07',
  },
];

const COLUMNS = [
  { key: 'orderId', header: 'Order ID' },
  { key: 'supplierName', header: 'Supplier Name' },
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

const PAGE_SIZE = 7

const FACTORY_PRODUCT = {
  id: 'fp1',
  product: 'UltraSet Portland Cement',
  category: 'Binding Materials',
  material: 'Cement',
  weightSize: '50 kg bag, OPC 53 grade',
  qty: '180 bags',
  unit: '$50.75',
  warehouse: '',
  total: '$9,113.00',
}

const INSTALLMENT_LABELS = [
  '1st Installment',
  '2nd Installment',
  '3rd Installment',
  '4th Installment',
  '5th Installment',
  '6th Installment',
]

const FACTORY_BREAKDOWN = INSTALLMENT_LABELS.map((label, index) => ({
  id: `ib-${index + 1}`,
  product: FACTORY_PRODUCT.product,
  category: FACTORY_PRODUCT.category,
  material: FACTORY_PRODUCT.material,
  weightSize: FACTORY_PRODUCT.weightSize,
  qty: '30 bags',
  warehouse: '',
  installmentNumber: label,
  amount: '$9,113.00',
}))

function toDetailsStatus(tableStatus) {
  const key = String(tableStatus || '').toLowerCase()
  if (key === 'assigned') return 'assigned'
  if (key === 'cancel') return 'cancel'
  return tableStatus
}

function buildOrderDetails(row) {
  const isAssigned = row.status === 'Assigned'
  const email = `${row.supplierName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`

  return {
    id: row.orderId,
    orderId: row.orderId,
    orderDate: row.date,
    status: toDetailsStatus(row.status),
    hasInstallment: true,
    company: {
      name: row.supplierName,
      email,
      phone: '+123 765 3490',
      project: '123 Main St, Downtown',
    },
    logistics: {
      deliveryLocation: '123 Main St, Downtown',
      pickupLocation: '123 Main St, Downtown',
      unloadingType: 'Tipper truck',
      accessCondition: 'Manual Unloading',
    },
    payment: {
      totalPrice: '$125,500',
      paidAmount: '$25,100',
      remainingBalance: '$100,400',
      paidNote: 'Pay $10,040/month for 10 months',
      duration: '10 months',
    },
    products: [FACTORY_PRODUCT],
    installmentBreakdown: FACTORY_BREAKDOWN,
    installments: DEMO_ORDER_INSTALLMENTS,
    transporter: isAssigned
      ? {
          name: 'John Smith',
          phone: '+1 23 456 7890',
          vehicle: 'Truck #TR-2034',
          initials: 'JS',
        }
      : null,
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(DUMMY_ORDERS)
  const [supplier, setSupplier] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const supplierOptions = [
    { value: 'all', label: 'All Supplier' },
    ...[...new Set(orders.map((row) => row.supplierName))].map((name) => ({
      value: name,
      label: name,
    })),
  ]

  const filtered = orders.filter((row) => {
    if (supplier !== 'all' && row.supplierName !== supplier) return false
    if (status !== 'all' && row.status !== status) return false
    return true
  })

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const updateStatus = (row, nextStatus) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, status: nextStatus } : item,
      ),
    )
  }

  const actions = [
    {
      id: 'see-details',
      label: 'See Details',
      onClick: (row) => setSelectedOrder(row),
    },
    ...STATUS_OPTIONS.map((option) => ({
      id: `status-${option.toLowerCase().replace(/\s+/g, '-')}`,
      label: option,
      onClick: (row) => updateStatus(row, option),
    })),
  ]

  if (selectedOrder) {
    const order = buildOrderDetails(selectedOrder)
    const isAssigned = selectedOrder.status === 'Assigned'

    return (
      <OrderDetails
        order={order}
        hasInstallment
        status={order.status}
        onBack={() => setSelectedOrder(null)}
        onChat={isAssigned ? () => {} : undefined}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          Suppliers order
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          Bulk orders with custom pricing and installment payments
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          variant="inline"
          label="Active Supplier Orders"
          value="42"
          icon={FiHome}
          iconTone="teal"
        />
        <StatusCard
          variant="inline"
          label="Total B2B Revenue"
          value="$128,940"
          icon={FiDollarSign}
          iconTone="teal"
        />
        <StatusCard
          variant="summary"
          label="Installment Active"
          value="18"
          description="orders"
          icon={FiInfo}
          iconTone="purple"
        />
        <StatusCard
          variant="status"
          label="Payment Overdue"
          value="$12,400"
          description="3 orders"
          tone="danger"
          icon={FiAlertCircle}
        />
      </div>

      <DataTable
        columns={COLUMNS}
        data={paged}
        showFilters
        filterLabel="Sort By:"
        filters={[
          {
            id: 'supplier',
            value: supplier,
            onChange: (value) => {
              setSupplier(value)
              setPage(1)
            },
            options: supplierOptions,
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
              ...STATUS_OPTIONS.map((option) => ({
                value: option,
                label: option,
              })),
            ],
          },
        ]}
        showActions
        actionType="menu"
        actions={actions}
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
