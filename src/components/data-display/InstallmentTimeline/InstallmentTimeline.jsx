import { FiCheck, FiClock } from 'react-icons/fi'

const STATUS = {
  completed: {
    card: 'border-green-200 bg-green-50',
    iconWrap: 'border-green-200 bg-green-50 text-green-600',
    badge: 'border-green-200 bg-green-50 text-green-700',
    Icon: FiCheck,
    label: 'Completed',
  },
  pending: {
    card: 'border-orange-200 bg-orange-50',
    iconWrap: 'border-orange-200 bg-orange-50 text-orange-600',
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
    Icon: FiClock,
    label: 'Pending',
  },
}

function Meta({ label, value }) {
  return (
    <p className="flex items-center gap-1.5 text-sm text-gray-600 sm:text-base">
      <span>{label}:</span>
      <span>{value}</span>
    </p>
  )
}

function parseDueDate(value) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function isPayableNow(item) {
  if (typeof item.canPayNow === 'boolean') return item.canPayNow
  if (item.status !== 'pending') return false

  const due = parseDueDate(item.dueDate)
  if (!due) return false

  const today = new Date()
  const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate())
  const nowDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
  return dueDate <= nowDate
}

function InstallmentCard({
  item,
  showLine,
  onPayNow,
  onCancel,
  showPay = false,
}) {
  const status = STATUS[item.status] || STATUS.pending
  const Icon = status.Icon
  const isCompleted = item.status === 'completed'
  const canPayNow = isPayableNow(item)

  return (
    <li className="relative flex gap-4">
      {showLine ? (
        <span
          aria-hidden
          className="absolute top-12 bottom-[-1rem] left-6 w-0.5 -translate-x-1/2 bg-gray-200"
        />
      ) : null}

      <div
        className={`relative z-[1] flex w-full flex-col gap-4 rounded-2xl border-2 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6 ${status.card}`}
      >
        <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
          <div
            className={`inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border ${status.iconWrap}`}
          >
            <Icon className="size-5" strokeWidth={2.5} />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg text-neutral-950">{item.title}</h3>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-sm ${status.badge}`}
              >
                {item.statusLabel || status.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <Meta label="Due Date" value={item.dueDate} />
              <Meta label="Amount" value={item.amount} />
              {item.quantity ? (
                <Meta label="Quantity" value={item.quantity} />
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 self-end sm:self-center">
          {isCompleted ? (
            <span className="inline-flex h-11 min-w-20 items-center justify-center rounded-2xl bg-gray-100 px-4 text-base font-medium text-gray-400">
              Paid
            </span>
          ) : showPay && canPayNow ? (
            <>
              <button
                type="button"
                onClick={() => onPayNow?.(item)}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--active)] px-4 text-sm font-semibold text-white hover:brightness-95"
              >
                Pay Now
              </button>
              <button
                type="button"
                onClick={() => onCancel?.(item)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-red-400 bg-white px-4 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                Cancel
              </button>
            </>
          ) : showPay ? (
            <span className="inline-flex h-11 min-w-24 items-center justify-center rounded-2xl bg-gray-100 px-4 text-sm font-medium text-gray-500">
              Not Due
            </span>
          ) : null}
        </div>
      </div>
    </li>
  )
}

/**
 * Common installment timeline.
 * showPay → Pay Now / Cancel / Not Due; onPayNow(item) when Pay Now is clicked.
 * items: { id, title, status, dueDate, amount, quantity?, statusLabel? }[]
 */
export default function InstallmentTimeline({
  title = 'Installment Timeline',
  items = [],
  showPay = false,
  onPayNow,
  onCancel,
  className = '',
}) {
  return (
    <section
      className={`flex w-full flex-col gap-6 ${className}`}
    >
      <h2 className="text-xl font-medium text-neutral-950">{title}</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No installments yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {items.map((item, index) => (
            <InstallmentCard
              key={item.id || `${item.title}-${index}`}
              item={item}
              showLine={index < items.length - 1}
              showPay={showPay}
              onPayNow={onPayNow}
              onCancel={onCancel}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
