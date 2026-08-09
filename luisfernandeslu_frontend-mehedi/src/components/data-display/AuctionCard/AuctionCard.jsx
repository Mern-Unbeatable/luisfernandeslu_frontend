import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiClock, FiCalendar, FiTruck, FiDollarSign } from 'react-icons/fi'
import AuctionDetailRow, { AuctionIcons } from './AuctionDetailRow'
import { resolveAuctionView } from './resolveAuctionView'

function formatMoney(amount, currency = 'USD') {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount))
  } catch {
    return `$${amount}`
  }
}

function CardShell({ children, accent = false, className = '' }) {
  return (
    <article
      className={[
        'flex w-full flex-col rounded-2xl bg-white p-5 shadow-sm sm:p-6',
        accent
          ? 'border border-[var(--active)]'
          : 'border border-gray-200',
        className,
      ].join(' ')}
    >
      {children}
    </article>
  )
}

function ViewDetailsButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--active)] text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      {label}
    </button>
  )
}

/** Image 1 — supplier/factory after creating auction */
function CreatedAuctionCard({ auction, onViewDetails, t }) {
  return (
    <CardShell>
      <div>
        <p className="text-xs text-[var(--secondary-text)]">
          {t('auction.orderId')}
        </p>
        <p className="mt-0.5 text-base font-bold text-[var(--primary-text)]">
          {auction.orderId}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <AuctionDetailRow
          icon={AuctionIcons.MapPin}
          label={t('auction.pickupLocation')}
          value={auction.pickupLocation}
        />
        <AuctionDetailRow
          icon={AuctionIcons.User}
          label={t('auction.customerName')}
          value={auction.customerName}
        />
        <AuctionDetailRow
          icon={AuctionIcons.MapPin}
          iconColor="active"
          label={t('auction.deliveryLocation')}
          value={auction.deliveryLocation}
        />
        <AuctionDetailRow
          icon={AuctionIcons.Package}
          label={t('auction.productName')}
          value={auction.productName}
        />
      </div>

      <ViewDetailsButton
        onClick={() => onViewDetails?.(auction)}
        label={t('auction.viewDetails')}
      />
    </CardShell>
  )
}

/** Image 4 — after transporter assigned */
function AssignedAuctionCard({ auction, onViewDetails, t }) {
  return (
    <CardShell>
      <div>
        <p className="text-xs text-[var(--secondary-text)]">
          {t('auction.orderId')}
        </p>
        <p className="mt-0.5 text-base font-bold text-[var(--primary-text)]">
          {auction.orderId}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <AuctionDetailRow
          icon={AuctionIcons.Package}
          label={t('auction.productName')}
          value={auction.productName}
        />
        <AuctionDetailRow
          icon={AuctionIcons.MapPin}
          label={t('auction.pickupLocation')}
          value={auction.pickupLocation}
        />
        <AuctionDetailRow
          icon={AuctionIcons.MapPin}
          iconColor="active"
          label={t('auction.deliveryLocation')}
          value={auction.deliveryLocation}
        />
        <AuctionDetailRow
          icon={AuctionIcons.Truck}
          label={t('auction.assignedTransporter')}
          value={auction.assignedTransporter}
        />
        <AuctionDetailRow
          icon={AuctionIcons.Dollar}
          label={t('auction.bidPrice')}
          value={formatMoney(auction.bidPrice)}
        />
      </div>

      <ViewDetailsButton
        onClick={() => onViewDetails?.(auction)}
        label={t('auction.viewDetails')}
      />
    </CardShell>
  )
}

/** Image 2 — transporter live bidding */
function TransporterAuctionCard({
  auction,
  bidValue,
  onBidChange,
  onPlaceBid,
  t,
}) {
  const [localBid, setLocalBid] = useState(bidValue ?? '')
  const value = bidValue !== undefined ? bidValue : localBid
  const setValue = onBidChange || setLocalBid

  return (
    <CardShell accent>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[var(--primary-text)]">
            {auction.title}
          </h3>
          <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
            {auction.auctionId}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-red-500">
          <FiClock className="size-4" strokeWidth={2} aria-hidden />
          {auction.remainingLabel}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-3.5">
          <AuctionDetailRow
            icon={AuctionIcons.Package}
            value={auction.quantity}
          />
          <AuctionDetailRow
            icon={AuctionIcons.MapPin}
            iconColor="green"
            value={auction.pickupLocation}
          />
          <AuctionDetailRow
            icon={AuctionIcons.MapPin}
            iconColor="blue"
            value={auction.deliveryLocation}
          />
          <AuctionDetailRow
            icon={AuctionIcons.Distance}
            value={auction.distance}
          />
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-[var(--primary-text)]">
            <FiDollarSign className="size-4 text-[var(--active)]" aria-hidden />
            {t('auction.bidHistory')}
          </p>
          <ul className="flex flex-col gap-2.5">
            {(auction.bids || []).slice(0, 4).map((bid) => (
              <li
                key={bid.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="font-bold text-[var(--primary-text)]">
                  {formatMoney(bid.amount)}
                </span>
                <span className="text-xs text-[var(--secondary-text)]">
                  {bid.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="number"
          min="0"
          step="1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('auction.enterBid')}
          className="h-11 w-full flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[var(--active)] focus:ring-1 focus:ring-[var(--active)]"
        />
        <button
          type="button"
          onClick={() => onPlaceBid?.(value, auction)}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--active)] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:min-w-[120px]"
        >
          {t('auction.placeBid')}
        </button>
      </div>
    </CardShell>
  )
}

/** Image 3 — admin competing bids */
function AdminAuctionCard({ auction, t }) {
  return (
    <CardShell accent>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[var(--primary-text)]">
            {auction.title}
          </h3>
          <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
            {t('auction.auctionId')}: {auction.auctionId}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[var(--active)]">
          {auction.dateLabel ? (
            <span className="inline-flex items-center gap-1.5">
              <FiCalendar className="size-4" aria-hidden />
              {auction.dateLabel}
            </span>
          ) : null}
          {auction.remainingLabel ? (
            <span className="inline-flex items-center gap-1.5">
              <FiClock className="size-4" aria-hidden />
              {auction.remainingLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3.5">
        <AuctionDetailRow
          icon={AuctionIcons.Package}
          label={t('auction.quantity')}
          value={auction.quantity}
        />
        <AuctionDetailRow
          icon={AuctionIcons.MapPin}
          iconColor="green"
          label={t('auction.pickup')}
          value={auction.pickupLocation}
        />
        <AuctionDetailRow
          icon={AuctionIcons.MapPin}
          iconColor="blue"
          label={t('auction.delivery')}
          value={auction.deliveryLocation}
        />
        <AuctionDetailRow
          icon={AuctionIcons.Distance}
          label={t('auction.distance')}
          value={auction.distance}
        />
      </div>

      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <p className="mb-3 text-sm font-bold text-[var(--primary-text)]">
          {t('auction.competingBids')}
        </p>
        <ul className="flex flex-col gap-2.5">
          {(auction.bids || []).map((bid) => (
            <li
              key={bid.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3"
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <FiTruck className="size-4" strokeWidth={2} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[var(--primary-text)]">
                    {bid.transporterName}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--secondary-text)]">
                    {bid.at || bid.label}
                  </span>
                </span>
              </div>
              <span className="shrink-0 text-sm font-bold text-[var(--primary-text)]">
                {formatMoney(bid.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </CardShell>
  )
}

/**
 * Common auction card — role + status driven.
 *
 * @example
 * <AuctionCard role="supplier" status="open" auction={data} onViewDetails={fn} />
 * <AuctionCard role="transporter" auction={data} onPlaceBid={fn} />
 * <AuctionCard role="admin" auction={data} />
 * <AuctionCard role="factory" status="assigned" auction={data} />
 */
export default function AuctionCard({
  role = 'supplier',
  status,
  auction = {},
  bidValue,
  onBidChange,
  onPlaceBid,
  onViewDetails,
  className = '',
}) {
  const { t } = useTranslation()
  const view = resolveAuctionView({
    role,
    status: status || auction.status,
  })

  const props = { auction, onViewDetails, onPlaceBid, bidValue, onBidChange, t }

  let body = null
  if (view === 'transporter') body = <TransporterAuctionCard {...props} />
  else if (view === 'admin') body = <AdminAuctionCard {...props} />
  else if (view === 'assigned') body = <AssignedAuctionCard {...props} />
  else body = <CreatedAuctionCard {...props} />

  if (!className) return body
  return <div className={className}>{body}</div>
}
