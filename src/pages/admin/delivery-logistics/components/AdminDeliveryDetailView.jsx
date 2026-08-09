import { FiArrowLeft } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

function DetailCard({ title, children, className = '' }) {
  return (
    <section
      className={[
        'rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6',
        className,
      ].join(' ')}
    >
      {title ? (
        <h2 className="mb-4 text-base font-bold text-[var(--primary-text)] sm:text-lg">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  )
}

function StackField({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-[var(--secondary-text)] sm:text-sm">{label}</p>
      <p className="mt-0.5 text-sm font-medium break-words text-[var(--primary-text)] sm:text-base">
        {value || '—'}
      </p>
    </div>
  )
}

function SummaryRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-sm text-[var(--secondary-text)]">
        {label}
      </span>
      <div className="min-w-0 text-right text-sm font-medium text-[var(--primary-text)]">
        {children}
      </div>
    </div>
  )
}

function DeliveryStatusBadge({ status, label }) {
  const key = String(status || 'assigned').toLowerCase()
  const tones = {
    assigned: 'bg-blue-100 text-blue-700',
    picked_up: 'bg-fuchsia-100 text-fuchsia-700',
    in_transit: 'bg-amber-100 text-amber-800',
    delivered: 'bg-emerald-100 text-emerald-700',
  }
  return (
    <span
      className={`inline-flex rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${tones[key] || tones.assigned}`}
    >
      {label || status}
    </span>
  )
}

const STATUS_LABEL_KEY = {
  assigned: 'adminDeliveryLogistics.status.assigned',
  picked_up: 'adminDeliveryLogistics.status.pickedUp',
  in_transit: 'adminDeliveryLogistics.status.inTransit',
  delivered: 'adminDeliveryLogistics.status.delivered',
}

export default function AdminDeliveryDetailView({ delivery = {}, onBack }) {
  const { t } = useTranslation()
  const statusKey = String(delivery.status || 'assigned').toLowerCase()
  const statusLabel = t(
    STATUS_LABEL_KEY[statusKey] || STATUS_LABEL_KEY.assigned,
  )

  const customer = delivery.customer || {}
  const transporter = delivery.transporter || {}
  const shipping = delivery.shipping || {}
  const product = delivery.product || {}

  return (
    <div className="mx-auto w-full">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] transition-colors hover:text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" strokeWidth={2} aria-hidden />
          {t('auction.details.back')}
        </button>
      ) : null}

      <div className="mb-5">
        <DeliveryStatusBadge status={statusKey} label={statusLabel} />
      </div>

      <div className="flex flex-col gap-5">
        <DetailCard title={t('auction.details.orderSummary')}>
          <div className="flex flex-col gap-3">
            <SummaryRow label={t('auction.details.auctionId')}>
              {delivery.auctionId}
            </SummaryRow>
            <SummaryRow label={t('auction.details.auctionDate')}>
              {delivery.auctionDate}
            </SummaryRow>
            <SummaryRow label={t('auction.details.deliveryCharge')}>
              {delivery.deliveryCharge}
            </SummaryRow>
          </div>
        </DetailCard>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <DetailCard title={t('auction.details.customerInfo')}>
            <div className="flex flex-col gap-4">
              <StackField
                label={t('auction.details.name')}
                value={customer.name}
              />
              <StackField
                label={t('auction.details.phone')}
                value={customer.phone}
              />
              <StackField
                label={t('auction.details.email')}
                value={customer.email}
              />
              <StackField
                label={t('auction.details.deliveryAddress')}
                value={customer.deliveryAddress}
              />
            </div>
          </DetailCard>

          <DetailCard title={t('auction.details.transporterInfo')}>
            <div className="flex flex-col gap-4">
              <StackField
                label={t('auction.details.name')}
                value={transporter.name}
              />
              <StackField
                label={t('auction.details.phone')}
                value={transporter.phone}
              />
              <StackField
                label={t('auction.details.email')}
                value={transporter.email}
              />
            </div>
          </DetailCard>

          <DetailCard title={t('auction.details.shippingDetails')}>
            <div className="flex flex-col gap-4">
              <StackField
                label={t('auction.details.pickupLocation')}
                value={shipping.pickupLocation}
              />
              <StackField
                label={t('auction.details.unloadingInstructions')}
                value={shipping.unloadingInstructions}
              />
              <StackField
                label={t('auction.details.accessCondition')}
                value={shipping.accessCondition}
              />
              <StackField
                label={t('auction.details.additionalNotes')}
                value={shipping.additionalNotes}
              />
            </div>
          </DetailCard>
        </div>

        <DetailCard title={t('auction.details.productInfo')}>
          <div className="flex flex-col gap-4">
            <StackField
              label={t('auction.details.productName')}
              value={product.name}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StackField label={t('auction.details.sku')} value={product.sku} />
              <StackField
                label={t('auction.details.quantity')}
                value={product.quantity}
              />
              <StackField
                label={t('auction.details.weight')}
                value={product.weight}
              />
              <StackField
                label={t('auction.details.price')}
                value={product.price}
              />
            </div>
          </div>
        </DetailCard>
      </div>
    </div>
  )
}
