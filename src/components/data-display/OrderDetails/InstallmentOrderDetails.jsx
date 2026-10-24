import { useTranslation } from 'react-i18next'
import {
  FiBox,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiTruck,
} from 'react-icons/fi'
import InstallmentTimeline from '../InstallmentTimeline/InstallmentTimeline'
import {
  AcceptButton,
  ContactLine,
  IconLabel,
  InstallmentBreakdownTable,
  ProductsTable,
  SectionEyebrow,
  StackLabel,
  StatusBadge,
  normalizeStatus,
} from './shared'

function PaymentSummary({
  payment = {},
  variant = 'bordered',
  isNew = false,
  downPayment = false,
  remainingBalanceTone = 'active',
}) {
  const { t } = useTranslation()
  const showDownPayment = isNew || downPayment
  const remainingBalanceClassName =
    remainingBalanceTone === 'danger'
      ? 'text-2xl font-bold text-red-500'
      : 'text-2xl font-bold text-[var(--active)]'

  if (variant === 'split') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/40 px-5 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--secondary-text)]">
              {t('orderDetails.paidAmount')}
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
              {t('orderDetails.remainingBalance')}
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
    <div className="rounded-xl border border-amber-300 bg-white px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--secondary-text)]">
            {showDownPayment ? t('ui.payNowDownPayment') : t('orderDetails.paidAmount')}
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
            {t('orderDetails.remainingBalance')}
          </p>
          <p className={`mt-1 ${remainingBalanceClassName}`}>
            {payment.remainingBalance}
          </p>
        </div>
      </div>
    </div>
  )
}

function TransporterBanner({ transporter = {}, onChat }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white"
          aria-hidden
        >
          <FiTruck className="size-5" strokeWidth={2} />
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
          {transporter.phone ? (
            <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-[var(--secondary-text)]">
              <FiPhone className="size-3.5 shrink-0" aria-hidden />
              {transporter.phone}
            </p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChat?.(transporter)}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[var(--active)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        <FiMessageSquare className="size-4" aria-hidden />
        {t('orderDetails.chat')}
      </button>
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
  onAccept,
  onChat,
  showPay = false,
  onPayNow,
  onCancelInstallment,
  context = 'default',
}) {
  const { t } = useTranslation()
  const status = normalizeStatus(order.status)
  const isNew = status === 'new'
  const isFactory = context === 'factory' || order.context === 'factory'
  const recipient = order.supplier || order.company || order.customer || {}
  const isCustomerRecipient =
    !isFactory &&
    (order.recipientType === 'customer' ||
      Boolean(order.customer) ||
      Boolean(
        recipient.region ||
          recipient.city ||
          recipient.zipCode ||
          recipient.address,
      ))
  const logistics = order.logistics || {}
  const payment = order.payment || {}
  const showTransporter =
    Boolean(order.transporter) &&
    status !== 'cancel' &&
    status !== 'paid' &&
    status !== 'completed'
  const paymentVariant =
    isFactory || status !== 'assigned' ? 'bordered' : 'split'
  const isCompanyRecipient = !isCustomerRecipient && !isFactory
  const tableVariant = isFactory ? 'factory' : 'default'
  const showDownPayment =
    isNew ||
    (isFactory &&
      (status === 'produced' || status === 'assigned' || status === 'ready'))
  const remainingBalanceTone =
    isFactory && showDownPayment ? 'danger' : 'active'

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
            {order.orderId}
          </h1>
          <StatusBadge status={status} label={order.statusLabel} />
        </div>
        {isNew ? <AcceptButton onClick={() => onAccept?.(order)} /> : null}
      </div>

      {order.cancelReason ? (
        <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {order.cancelReason}
        </div>
      ) : null}

      <section className="mb-6">
        <SectionEyebrow>{t('orderDetails.recipient')}</SectionEyebrow>
        <h2 className="mb-3 text-lg font-bold text-[var(--primary-text)]">
          {isFactory
            ? t('ui.supplierInformation')
            : isCustomerRecipient
              ? t('ui.customerInformation')
              : t('ui.companyInformation')}
        </h2>
        <p className="text-base font-bold text-[var(--primary-text)]">
          {recipient.name}
        </p>
        <div className="mt-1">
          <ContactLine email={recipient.email} phone={recipient.phone} />
        </div>

        {isFactory ? (
          <>
            <div className="mt-5">
              <IconLabel
                icon={FiMapPin}
                label={t('orderDetails.deliveryLocation')}
                value={logistics.deliveryLocation}
              />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <IconLabel
                icon={FiDollarSign}
                label={t('orderDetails.totalPrice')}
                value={payment.totalPrice}
                valueClassName="text-2xl font-bold text-[var(--primary-text)]"
              />
              <IconLabel
                icon={FiCalendar}
                label={t('orderDetails.installment')}
                value={payment.duration}
                valueClassName="text-sm font-bold text-[var(--primary-text)]"
              />
            </div>
          </>
        ) : isCompanyRecipient ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <IconLabel
              icon={FiBox}
              label={t('orderDetails.project')}
              value={recipient.project || logistics.pickupLocation}
            />
            <IconLabel
              icon={FiMapPin}
              label={t('orderDetails.deliveryLocation')}
              value={logistics.deliveryLocation}
            />
            <IconLabel
              icon={FiDollarSign}
              label={t('orderDetails.totalPrice')}
              value={payment.totalPrice}
              valueClassName="text-2xl font-bold text-[var(--primary-text)]"
            />
            <IconLabel
              icon={FiCalendar}
              label={t('orderDetails.installment')}
              value={payment.duration}
              valueClassName="text-sm font-bold text-[var(--primary-text)]"
            />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <IconLabel
                icon={FiMapPin}
                label={t('orderDetails.address')}
                value={recipient.address || logistics.pickupLocation}
              />
              <IconLabel
                icon={FiDollarSign}
                label={t('orderDetails.totalPrice')}
                value={payment.totalPrice}
              />
            </div>
            <div className="flex flex-col gap-4">
              <IconLabel
                icon={FiMapPin}
                label={t('orderDetails.deliveryLocation')}
                value={logistics.deliveryLocation}
              />
              <IconLabel icon={FiBox} label={t('orderDetails.installment')} value={payment.duration} />
            </div>
          </div>
        )}
      </section>

      {showTransporter ? (
        <div className="mb-5">
          <TransporterBanner transporter={order.transporter} onChat={onChat} />
        </div>
      ) : null}

      <div className="mb-5">
        <PaymentSummary
          payment={payment}
          variant={paymentVariant}
          isNew={isNew}
          downPayment={showDownPayment}
          remainingBalanceTone={remainingBalanceTone}
        />
      </div>

      {!isFactory ? (
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StackLabel
            label={
              isCompanyRecipient
                ? t('orderDetails.unloadingType')
                : t('ui.unloadingVehicles')
            }
            value={logistics.unloadingType}
          />
          <StackLabel
            label={t('orderDetails.accessConditions')}
            value={logistics.accessCondition}
          />
        </div>
      ) : null}

      <section className="mb-8">
        {isFactory ? <SectionEyebrow>{t('orderDetails.materials')}</SectionEyebrow> : null}
        <h2 className="mb-4 text-lg font-bold text-[var(--primary-text)]">
          {t('orderDetails.productDetails')}
        </h2>
        <ProductsTable products={order.products} variant={tableVariant} />
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-[var(--primary-text)]">
          {t('orderDetails.installmentBreakdown')}
        </h2>
        <InstallmentBreakdownTable
          rows={order.installmentBreakdown}
          variant={tableVariant}
        />
      </section>

      <InstallmentTimeline
        items={order.installments}
        showPay={showPay}
        onPayNow={onPayNow}
        onCancel={onCancelInstallment}
      />
    </div>
  )
}
