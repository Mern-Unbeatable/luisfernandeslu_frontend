import { FiArrowLeft, FiTruck } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

function Card({ title, children, className = '' }) {
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

function StatusBadge({ label }) {
  if (!label) return null
  return (
    <span className="inline-flex rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-800 capitalize">
      {label}
    </span>
  )
}

function CompetingBids({ bids = [], t }) {
  return (
    <Card title={t('auction.details.competingBids')}>
      <ul className="flex flex-col gap-2.5">
        {bids.map((bid) => (
          <li
            key={bid.id}
            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3"
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <FiTruck className="size-4" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[var(--primary-text)]">
                {bid.transporterName}
              </span>
              <span className="mt-0.5 block text-xs text-[var(--secondary-text)]">
                {bid.at}
              </span>
            </span>
          </li>
        ))}
        {bids.length === 0 ? (
          <li className="text-sm text-[var(--secondary-text)]">—</li>
        ) : null}
      </ul>
    </Card>
  )
}

function TransporterInfo({ transporter = {}, t }) {
  return (
    <Card
      title={t('auction.details.transporterInfo')}
      className="border-amber-100 bg-[#FBF7F0]"
    >
      <div className="flex flex-col gap-4">
        <StackField
          label={t('auction.details.transporterName')}
          value={transporter.name}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StackField
            label={t('auction.details.contactNumber')}
            value={transporter.phone}
          />
          <StackField
            label={t('auction.details.vehicleType')}
            value={transporter.vehicleType}
          />
          <StackField
            label={t('auction.details.bidAmount')}
            value={transporter.bidAmount}
          />
          <StackField
            label={t('auction.details.assignedAt')}
            value={transporter.assignedAt}
          />
        </div>
      </div>
    </Card>
  )
}

function ShippingCard({ auction, shipping, t }) {
  return (
    <Card title={t('auction.details.shippingDetails')}>
      <div className="flex flex-col gap-4">
        <StackField
          label={t('auction.details.pickupLocation')}
          value={shipping.pickupLocation || auction.pickupLocation}
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
    </Card>
  )
}

function CustomerCard({ customer, t }) {
  return (
    <Card title={t('auction.details.customerInfo')}>
      <div className="flex flex-col gap-4">
        <StackField label={t('auction.details.name')} value={customer.name} />
        <StackField label={t('auction.details.phone')} value={customer.phone} />
        <StackField label={t('auction.details.email')} value={customer.email} />
        <StackField
          label={t('auction.details.deliveryAddress')}
          value={customer.deliveryAddress}
        />
      </div>
    </Card>
  )
}

function ProductCard({ product, showQuantity, t }) {
  return (
    <Card title={t('auction.details.productInfo')}>
      <div className="flex flex-col gap-4">
        <StackField
          label={t('auction.details.productName')}
          value={product.name}
        />
        <div
          className={[
            'grid grid-cols-1 gap-4',
            showQuantity ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3',
          ].join(' ')}
        >
          <StackField label={t('auction.details.sku')} value={product.sku} />
          {showQuantity ? (
            <StackField
              label={t('auction.details.quantity')}
              value={product.quantity}
            />
          ) : null}
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
    </Card>
  )
}

/**
 * Common auction details page.
 *
 * role: 'supplier'     → Shipping Details; active → bids; assigned → transporter info
 * role: 'factory'      → no Shipping card; pickup in summary; same status split
 * role: 'transporter'  → assigned/complete job view: Shipping + Delivery Charge; no bids/transporter card
 *
 * status: 'active' | 'assigned' | 'complete'
 */
export default function AuctionDetails({
  role = 'supplier',
  status,
  auction = {},
  onBack,
  className = '',
}) {
  const { t } = useTranslation()
  const isSupplier = role === 'supplier'
  const isFactory = role === 'factory'
  const isTransporter = role === 'transporter'
  const resolvedStatus = String(status || auction.status || 'active').toLowerCase()
  const isAssigned = resolvedStatus === 'assigned'
  const isComplete = resolvedStatus === 'complete' || resolvedStatus === 'completed'
  const showTransporterPanel = (isSupplier || isFactory) && (isAssigned || isComplete)
  const showBids = (isSupplier || isFactory) && !showTransporterPanel
  const showShipping = isSupplier || isTransporter
  const customer = auction.customer || {}
  const product = auction.product || {}
  const shipping = auction.shipping || {}

  return (
    <div className={`mx-auto w-full ${className}`}>
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] transition-colors hover:text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" strokeWidth={2} aria-hidden />
          {t('auction.details.back')}
        </button>
      ) : null}

      <div className="flex flex-col gap-5">
        <Card title={t('auction.details.orderSummary')}>
          <div className="flex flex-col gap-3">
            <SummaryRow
              label={
                isTransporter
                  ? t('auction.details.auctionId')
                  : t('auction.details.orderId')
              }
            >
              {isTransporter
                ? auction.auctionId || auction.orderId
                : auction.orderId}
            </SummaryRow>
            <SummaryRow label={t('auction.details.auctionDate')}>
              {auction.auctionDate}
            </SummaryRow>
            {isFactory ? (
              <SummaryRow label={t('auction.details.pickupLocation')}>
                {auction.pickupLocation || shipping.pickupLocation}
              </SummaryRow>
            ) : null}
            {isTransporter ? (
              <SummaryRow label={t('auction.details.deliveryCharge')}>
                {auction.deliveryCharge || auction.transporter?.bidAmount}
              </SummaryRow>
            ) : null}
            {showTransporterPanel ? (
              <SummaryRow label={t('auction.details.currentStatus')}>
                <StatusBadge
                  label={
                    auction.currentStatus ||
                    (isComplete
                      ? t('auction.details.complete')
                      : t('auction.details.inTransit'))
                  }
                />
              </SummaryRow>
            ) : null}
          </div>
        </Card>

        {isTransporter ? (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <CustomerCard customer={customer} t={t} />
              <ShippingCard auction={auction} shipping={shipping} t={t} />
            </div>
            <ProductCard product={product} showQuantity t={t} />
          </>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="flex flex-col gap-5">
              <CustomerCard customer={customer} t={t} />
              <ProductCard product={product} showQuantity={false} t={t} />
            </div>

            <div className="flex flex-col gap-5">
              {showShipping ? (
                <ShippingCard auction={auction} shipping={shipping} t={t} />
              ) : null}

              {showTransporterPanel ? (
                <TransporterInfo transporter={auction.transporter} t={t} />
              ) : null}
              {showBids ? <CompetingBids bids={auction.bids} t={t} /> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
