import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiClock, FiCalendar, FiTruck, FiDollarSign } from 'react-icons/fi'
import AuctionDetailRow, { AuctionIcons } from './AuctionDetailRow'
import { resolveAuctionView } from './resolveAuctionView'

function formatMoney(amount, currency = 'EUR') {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  try {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount))
  } catch {
    return `€${amount}`
  }
}

function CardShell({ children, accent = false, className = '' }) {
  return (
    <article
      className={[
        'flex h-full w-full flex-col rounded-2xl bg-white p-5 shadow-sm sm:p-6',
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
    <div className="mt-auto pt-6">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--active)] text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        {label}
      </button>
    </div>
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

  const bids = (auction.bids || []).slice(0, 4)

  return (
    <CardShell accent>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[var(--primary-text)]">
            {auction.title}
          </h3>
          {auction.auctionCode ? (
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {auction.auctionCode}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-red-500">
          <FiClock className="size-4" strokeWidth={2} aria-hidden />
          {auction.remainingLabel}
        </div>
      </div>

      <div className="mt-5 grid min-h-0 flex-1 gap-5 sm:grid-cols-2">
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

        <div className="flex h-full min-h-[9.5rem] flex-col rounded-xl bg-gray-50 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-[var(--primary-text)]">
            <FiDollarSign className="size-4 text-[var(--active)]" aria-hidden />
            {t('auction.bidHistory')}
          </p>
          <ul className="flex flex-1 flex-col gap-2">
            {Array.from({ length: 4 }, (_, index) => {
              const bid = bids[index]
              const isMine = Boolean(bid?.isUserBid || bid?.isMine)

              return (
                <li
                  key={bid?.id ?? `bid-slot-${index}`}
                  className={[
                    'flex min-h-5 items-center justify-between gap-2 text-sm',
                    bid ? '' : 'invisible',
                    isMine ? 'rounded-lg bg-[#EAF2FF] px-2.5 py-1.5' : '',
                  ].join(' ')}
                >
                  {isMine ? (
                    <>
                      <span className="min-w-0">
                        <span className="block font-bold text-[var(--primary-text)]">
                          {formatMoney(bid.amount)}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--secondary-text)]">
                          {bid.label || '—'}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-[#3B82F6]">
                        YOU
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-[var(--primary-text)]">
                        {bid ? formatMoney(bid.amount) : '—'}
                      </span>
                      <span className="text-xs text-[var(--secondary-text)]">
                        {bid?.label || '—'}
                      </span>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row sm:items-center">
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
          onClick={async () => {
            const result = await onPlaceBid?.(value, auction)
            if (result) setValue('')
          }}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--active)] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:min-w-[120px]"
        >
          {t('auction.placeBid')}
        </button>
      </div>
    </CardShell>
  )
}

const ADMIN_BID_VISIBLE_COUNT = 3
// ~3.5rem per row (py-3 + icon) + 0.5rem gap (space-y-2)
const ADMIN_BIDS_LIST_MAX_HEIGHT = `calc(${ADMIN_BID_VISIBLE_COUNT} * 3.5rem + ${ADMIN_BID_VISIBLE_COUNT - 1} * 0.5rem)`

/** Image 3 — admin competing bids */
function AdminAuctionCard({ auction, t }) {
  const bids = Array.isArray(auction.bids) ? auction.bids : []
  const hasBids = bids.length > 0
  const hasMoreBids = bids.length > ADMIN_BID_VISIBLE_COUNT

  return (
    <CardShell accent>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-(--primary-text)">{auction.title}</h3>
          <p className="mt-0.5 text-sm text-(--secondary-text)">
            {t('auction.auctionId')}: {auction.auctionId}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-(--active)">
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
        <AuctionDetailRow icon={AuctionIcons.Package} label={t('auction.quantity')} value={auction.quantity} />
        <AuctionDetailRow icon={AuctionIcons.MapPin} iconColor="green" label={t('auction.pickup')} value={auction.pickupLocation} />
        <AuctionDetailRow icon={AuctionIcons.MapPin} iconColor="blue" label={t('auction.delivery')} value={auction.deliveryLocation} />
        <AuctionDetailRow icon={AuctionIcons.Distance} label={t('auction.distance')} value={auction.distance} />
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col rounded-xl bg-gray-50 p-4">
        <p className="mb-3 shrink-0 text-sm font-bold text-(--primary-text)">
          {t('auction.competingBids')}
        </p>

        {!hasBids ? (
          <div className="flex flex-1 items-center justify-center py-6">
            <div className="text-center">
              <span className="inline-flex items-center justify-center rounded-lg bg-white p-3 text-gray-400 shadow-sm">
                <FiTruck className="size-5" aria-hidden />
              </span>
              <p className="mt-3 text-sm text-(--secondary-text)">
                {t('auction.noCompetingBids')}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <ul
              className="shrink-0 space-y-2 overflow-y-auto pr-1"
              style={{ maxHeight: ADMIN_BIDS_LIST_MAX_HEIGHT }}
              aria-label={t('auction.competingBids')}
            >
              {bids.map((bid, idx) => (
                <li
                  key={bid.id || `bid-${idx}`}
                  className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3"
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                      <FiTruck className="size-4" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-(--primary-text)">
                        {bid.transporterName}
                      </span>
                      <span className="mt-0.5 block text-xs text-(--secondary-text)">
                        {bid.at || bid.label}
                      </span>
                    </span>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-(--primary-text)">
                    {formatMoney(bid.amount)}
                  </span>
                </li>
              ))}
            </ul>
            {hasMoreBids ? (
              <p className="mt-2 shrink-0 text-center text-xs text-(--secondary-text)">
                {t('auction.scrollForMoreBids', 'Scroll to see more bids')}
              </p>
            ) : null}
          </div>
        )}
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
  return <div className={`flex h-full flex-col ${className}`}>{body}</div>
}
