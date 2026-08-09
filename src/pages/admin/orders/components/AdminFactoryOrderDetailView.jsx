import { FiCalendar, FiMapPin, FiMessageSquare, FiTag } from 'react-icons/fi'
import InstallmentTimeline from '@/components/data-display/InstallmentTimeline/InstallmentTimeline'
import {
  AcceptButton,
  ContactLine,
  IconLabel,
  InstallmentBreakdownTable,
  ProductsTable,
  SectionEyebrow,
} from '@/components/data-display/OrderDetails/shared'

function FactoryOrderStatusBadge({ status, label }) {
  const key = String(status || '').toLowerCase()
  const styles =
    key === 'produced'
      ? 'bg-sky-100 text-sky-700'
      : key === 'assigned'
        ? 'bg-gray-700 text-white'
        : 'bg-sky-100 text-sky-700'

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {label || status}
    </span>
  )
}

function PaymentSummaryBox({ payment = {} }) {
  return (
    <div className="rounded-xl border border-[var(--active)] px-5 py-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--secondary-text)]">
            {payment.payNowLabel || 'Pay Now (Down Payment)'}
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {payment.paidAmount}
          </p>
          {payment.paidNote ? (
            <p className="mt-1 text-xs text-[var(--secondary-text)]">
              {payment.paidNote}
            </p>
          ) : null}
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
    </div>
  )
}

function TransporterBanner({ transporter = {}, onChat }) {
  const initials =
    transporter.initials ||
    (transporter.name || 'T')
      .split(' ')
      .map((part) => part[0])
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

export default function AdminFactoryOrderDetailView({
  order = {},
  supplierSectionTitle = 'Supplier Information',
  factorySectionTitle = 'Factory Information',
  producedLabel = 'Produced',
  assignedLabel = 'Assigned',
  onAccept,
  onChat,
}) {
  const factoryStatus = order.factoryDetailStatus || 'produced'
  const showTransporter =
    factoryStatus === 'assigned' && Boolean(order.transporter)
  const isNew = String(order.status).toLowerCase() === 'new'
  const supplier = order.supplier || {}
  const factory = order.factory || {}
  const payment = order.payment || {}
  const logistics = order.logistics || {}

  const statusLabel =
    factoryStatus === 'assigned' ? assignedLabel : producedLabel

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
            {order.orderId}
          </h1>
          <FactoryOrderStatusBadge status={factoryStatus} label={statusLabel} />
        </div>
        {isNew ? <AcceptButton onClick={() => onAccept?.(order)} /> : null}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <SectionEyebrow>Recipient</SectionEyebrow>
          <h2 className="mt-1 mb-3 text-lg font-bold text-[var(--primary-text)]">
            {supplierSectionTitle}
          </h2>
          <p className="text-base font-bold text-[var(--primary-text)]">
            {supplier.name}
          </p>
          <div className="mt-1">
            <ContactLine email={supplier.email} phone={supplier.phone} />
          </div>
          <div className="mt-5 flex flex-col gap-4">
            <IconLabel
              icon={FiMapPin}
              label="Delivery Location"
              value={logistics.deliveryLocation}
            />
            <IconLabel icon={FiTag} label="Total Price" value={payment.totalPrice} />
          </div>
        </div>

        <div>
          <SectionEyebrow>Factory</SectionEyebrow>
          <h2 className="mt-1 mb-3 text-lg font-bold text-[var(--primary-text)]">
            {factorySectionTitle}
          </h2>
          <p className="text-base font-bold text-[var(--primary-text)]">
            {factory.name}
          </p>
          <div className="mt-1">
            <ContactLine email={factory.email} phone={factory.phone} />
          </div>
          <div className="mt-5">
            <IconLabel
              icon={FiCalendar}
              label="Installment"
              value={payment.duration}
            />
          </div>
        </div>
      </div>

      {showTransporter ? (
        <div className="mb-5">
          <TransporterBanner transporter={order.transporter} onChat={onChat} />
        </div>
      ) : null}

      <div className="mb-5">
        <PaymentSummaryBox payment={payment} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-[var(--secondary-text)]">
            Types of unloading Needed
          </p>
          <p className="mt-0.5 text-sm font-medium text-[var(--primary-text)]">
            {logistics.unloadingType || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--secondary-text)]">
            Access Conditions
          </p>
          <p className="mt-0.5 text-sm font-medium text-[var(--primary-text)]">
            {logistics.accessCondition || '—'}
          </p>
        </div>
      </div>

      <section className="mb-8">
        <SectionEyebrow>Materials</SectionEyebrow>
        <h2 className="mt-1 mb-4 text-lg font-bold text-[var(--primary-text)]">
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

      <InstallmentTimeline items={order.installments} showPay={false} />
    </div>
  )
}
