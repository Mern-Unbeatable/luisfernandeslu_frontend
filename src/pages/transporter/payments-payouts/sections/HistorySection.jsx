import { FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi'
import DataTable from '../../../../components/data-display/DataTable/DataTable'

export default function HistorySection() {
  const transactions = [
    {
      id: 1,
      date: '6/1/2026',
      title: 'Portland Cement - 500 bags',
      type: 'Delivery',
      orderId: 'ORD-2847-015',
      status: 'completed',
      amount: '+€8,500',
      isIncome: true,
    },
    {
      id: 2,
      date: '5/31/2026',
      title: 'TMT Rods - 200 pieces',
      type: 'Delivery',
      orderId: 'ORD-2847-014',
      status: 'pending',
      amount: '+€12,000',
      isIncome: true,
    },
    {
      id: 3,
      date: '5/30/2026',
      title: 'Bank Transfer to HDFC ***4521',
      type: 'Payout',
      orderId: 'PAYOUT-842',
      status: 'completed',
      amount: '-€45,000',
      isIncome: false,
    },
    {
      id: 4,
      date: '5/30/2026',
      title: 'Red Bricks - 10,000 pieces',
      type: 'Delivery',
      orderId: 'ORD-2847-013',
      status: 'completed',
      amount: '+€6,200',
      isIncome: true,
    },
    {
      id: 5,
      date: '5/29/2026',
      title: 'Ready Mix Concrete - 6m³',
      type: 'Delivery',
      orderId: 'ORD-2847-012',
      status: 'completed',
      amount: '+€15,500',
      isIncome: true,
    },
    {
      id: 6,
      date: '5/29/2026',
      title: 'River Sand - 15 tons',
      type: 'Delivery',
      orderId: 'ORD-2847-011',
      status: 'pending',
      amount: '+€7,800',
      isIncome: true,
    },
  ]

  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: (value) => (
        <span className="flex items-center gap-2 text-zinc-500 font-medium">
          <FiCalendar className="size-4 text-zinc-400" />
          {value}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Transaction',
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-800">{value}</span>
          <span className="text-xs text-zinc-400">{row.type}</span>
        </div>
      ),
    },
    {
      key: 'orderId',
      header: 'Order ID',
      render: (value) => <span className="font-medium text-zinc-500">{value}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const isCompleted = value === 'completed'
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-orange-50 text-orange-600'
            }`}
          >
            {isCompleted ? (
              <FiCheckCircle className="size-3" />
            ) : (
              <FiClock className="size-3" />
            )}
            {value}
          </span>
        )
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (value, row) => (
        <span className={`font-bold ${row.isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
          {value}
        </span>
      ),
    },
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Transaction History</h2>
      <DataTable
        showCard={false}
        columns={columns}
        data={transactions}
      />
    </div>
  )
}
