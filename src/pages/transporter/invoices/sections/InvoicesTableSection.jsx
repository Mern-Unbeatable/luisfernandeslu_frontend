import { FiFileText, FiCalendar, FiEye, FiDownload } from 'react-icons/fi'
import DataTable from '../../../../components/data-display/DataTable/DataTable'

export default function InvoicesTableSection() {
  const invoicesData = [
    {
      id: 1,
      invoiceId: 'CI-01063',
      type: 'Invoice',
      orderId: 'ORD-001',
      customer: 'Downtown Construction Co.',
      amount: '€285.00',
      date: '2024-05-28',
    },
    {
      id: 2,
      invoiceId: 'CI-01064',
      type: 'Invoice',
      orderId: 'ORD-002',
      customer: 'West Side Building Project',
      amount: '€180.00',
      date: '2024-05-27',
    },
    {
      id: 3,
      invoiceId: 'CI-01065',
      type: 'Invoice',
      orderId: 'ORD-003',
      customer: 'Suburban Housing Development',
      amount: '€420.00',
      date: '2024-05-26',
    },
    {
      id: 4,
      invoiceId: 'CI-01066',
      type: 'Invoice',
      orderId: 'ORD-004',
      customer: 'Tax Authority',
      amount: '€3,450.00',
      date: '2024-05-01',
    },
    {
      id: 5,
      invoiceId: 'CI-01087',
      type: 'Invoice',
      orderId: 'ORD-025',
      customer: 'Content Creation',
      amount: '€4,250.00',
      date: '2024-05-22',
    },
    {
      id: 6,
      invoiceId: 'CI-01063-2',
      invoiceIdDisplay: 'CI-01063',
      type: 'Invoice',
      orderId: 'ORD-001',
      customer: 'Downtown Construction Co.',
      amount: '€285.00',
      date: '2024-05-28',
    },
    {
      id: 7,
      invoiceId: 'CI-01064-2',
      invoiceIdDisplay: 'CI-01064',
      type: 'Invoice',
      orderId: 'ORD-002',
      customer: 'West Side Building Project',
      amount: '€180.00',
      date: '2024-05-27',
    },
    {
      id: 8,
      invoiceId: 'CI-01087-2',
      invoiceIdDisplay: 'CI-01087',
      type: 'Invoice',
      orderId: 'ORD-025',
      customer: 'Content Creation',
      amount: '€4,250.00',
      date: '2024-05-22',
    },
  ]

  const columns = [
    {
      key: 'invoiceId',
      header: 'INVOICES ID',
      render: (value, row) => (
        <span className="flex items-center gap-2 font-medium text-zinc-500">
          <FiFileText className="size-4 text-zinc-400" />
          {row.invoiceIdDisplay || value}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'TYPE',
      render: (value) => (
        <span className="inline-flex items-center rounded bg-amber-50 border border-amber-200/50 px-2 py-0.5 text-xs font-semibold text-amber-600">
          {value}
        </span>
      ),
    },
    {
      key: 'orderId',
      header: 'ORDER ID',
      render: (value) => <span className="font-semibold text-zinc-800">{value}</span>,
    },
    {
      key: 'customer',
      header: 'CUSTOMER',
      render: (value) => <span className="text-zinc-600 font-medium">{value}</span>,
    },
    {
      key: 'amount',
      header: 'AMOUNT',
      render: (value) => <span className="font-bold text-zinc-800">{value}</span>,
    },
    {
      key: 'date',
      header: 'DATE',
      render: (value) => (
        <span className="flex items-center gap-2 text-zinc-500 font-medium">
          <FiCalendar className="size-4 text-zinc-400" />
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      render: () => (
        <div className="flex items-center gap-3 text-zinc-400">
          <button type="button" className="hover:text-zinc-600 transition-colors">
            <FiEye className="size-4.5" />
          </button>
          <button type="button" className="hover:text-zinc-600 transition-colors">
            <FiDownload className="size-4.5" />
          </button>
        </div>
      ),
    },
  ]

  const paginationInfo = {
    page: 1,
    pageSize: 8,
    total: 8,
    summaryLabel: 'Showing 1 to 8 of 8 results',
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <DataTable
        showCard={false}
        columns={columns}
        data={invoicesData}
        showPagination={true}
        pagination={paginationInfo}
      />
    </div>
  )
}
