import { FiBox, FiMapPin, FiMessageSquare, FiTag } from 'react-icons/fi'
import InstallmentTimeline from '../InstallmentTimeline/InstallmentTimeline'
import {
  ContactLine,
  IconLabel,
  InstallmentBreakdownTable,
  ProductsTable,
  StackLabel,
  StatusBadge,
  normalizeStatus,
} from './shared'

function PaymentSummary({ payment = {}, variant = 'bordered' }) {
  if (variant === 'split') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/40 px-5 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--secondary-text)]">
              Paid Amount
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {payment.paidAmount}
            </p>
            {payment.paidNote || payment.nextDueLabel ? (
              <p className="mt-1 text-xs text-[var(--secondary-text)]">
                {payment.paidNote || payment.nextDueLabel}
              </p>
            ) : null}
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-[var(--secondary-text)]">
              Remaining Balance
            </p>
            <p className="mt-1 text-2xl font-bold text-red-500">
              {payment.remainingBalance}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--active)] px-5 py-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--secondary-text)]">
            You have Done Payment
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {payment.paidAmount}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--secondary-text)]">
            Remaining Balance
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--active)]">
            {payment.remainingBalance}
          </p>
        </div>
      </div>
      {payment.paidNote ? (
        <p className="mt-2 text-xs text-[var(--secondary-text)]">
          {payment.paidNote}
        </p>
      ) : null}
    </div>
  )
}

function TransporterBanner({ transporter = {}, onChat }) {
  const initials =
    transporter.initials ||
    (transporter.name || 'T')
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sky-200 text-sm font-bold text-sky-800">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold text-[var(--primary-text)]">
            {transporter.name}
          </p>
          {transporter.vehicle ? (
            <p className="text-sm text-[var(--secondary-text)]">
              {transporter.vehicle}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {transporter.phone ? (
          <p className="text-sm text-[var(--primary-text)]">
            {transporter.phone}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => onChat?.(transporter)}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--active)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <FiMessageSquare className="size-4" aria-hidden />
          Chat
        </button>
      </div>
    </div>
  )
}

/**
 * Order details when hasInstallment=true
 * status: new | pending | processing | assigned | paid
 * Assigned → transporter banner shown
 */
export default function InstallmentOrderDetails({
  order = {},
  onChat,
  onPayNow,
  onCancelInstallment,
}) {
  const status = normalizeStatus(order.status)
  const company = order.company || {}
  const logistics = order.logistics || {}
  const payment = order.payment || {}
  const showTransporter = Boolean(order.transporter) && status === 'assigned'
  const paymentVariant = showTransporter ? 'split' : 'bordered'

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {order.orderId}
        </h1>
        <StatusBadge status={status} />
      </div>

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-[var(--primary-text)]">
          Company Information
        </h2>
        <p className="text-base font-bold text-[var(--primary-text)]">
          {company.name}
        </p>
        <div className="mt-1">
          <ContactLine
            email={company.email || company.taxId}
            phone={company.phone}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <IconLabel
            icon={FiMapPin}
            label="Pickup Location"
            value={logistics.pickupLocation || company.project}
          />
          <IconLabel
            icon={FiMapPin}
            label="Delivery Location"
            value={logistics.deliveryLocation}
          />
          <IconLabel
            icon={FiTag}
            label={showTransporter ? 'Total Bid' : 'Total Price'}
            value={payment.totalPrice}
          />
          <IconLabel
            icon={FiBox}
            label={showTransporter ? 'Duration' : 'Materials'}
            value={
              showTransporter
                ? payment.duration
                : logistics.materials || payment.duration
            }
          />
        </div>
      </section>

      {showTransporter ? (
        <div className="mb-5">
          <TransporterBanner transporter={order.transporter} onChat={onChat} />
        </div>
      ) : null}

      <div className="mb-5">
        <PaymentSummary payment={payment} variant={paymentVariant} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StackLabel
          label="Types of unloading / vehicles"
          value={logistics.unloadingType}
        />
        <StackLabel
          label="Unload Condition"
          value={logistics.accessCondition}
        />
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-[var(--primary-text)]">
          Product Details
        </h2>
        <ProductsTable products={order.products} />
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-[var(--primary-text)]">
          Installment Breakdown
        </h2>
        <InstallmentBreakdownTable rows={order.installmentBreakdown} />
      </section>

      <InstallmentTimeline
        items={order.installments}
        onPayNow={onPayNow}
        onCancel={onCancelInstallment}
      />
    </div>
  )
}
