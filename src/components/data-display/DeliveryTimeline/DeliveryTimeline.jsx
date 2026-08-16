import {
  FiCheckCircle,
  FiMapPin,
  FiNavigation,
  FiTruck,
} from 'react-icons/fi'

const STEPS = ['assigned', 'picked_up', 'in_transit', 'delivered']

const STATUS_BADGE = {
  assigned: 'bg-blue-100 text-blue-600',
  picked_up: 'bg-fuchsia-100 text-fuchsia-600',
  in_transit: 'bg-amber-100 text-amber-700',
  delivered: 'bg-emerald-100 text-emerald-700',
}

const STATUS_LABEL = {
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
}

const STEP_LABEL = {
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
}

export default function DeliveryTimeline({
  items = [],
  onStartTrip,
  onMarkPickedUp,
  onNavigateToDelivery,
  onVerifyDelivery,
  onSeeDetails,
  className = '',
}) {
  return (
    <div className={`flex w-full flex-col gap-4 ${className}`}>
      {items.map((item) => (
        <DeliveryCard
          key={item.id}
          item={item}
          onStartTrip={onStartTrip}
          onMarkPickedUp={onMarkPickedUp}
          onNavigateToDelivery={onNavigateToDelivery}
          onVerifyDelivery={onVerifyDelivery}
          onSeeDetails={onSeeDetails}
        />
      ))}
    </div>
  )
}

function getProgressScale(item) {
  const max = STEPS.length - 1
  const status = normalizeStatus(item.status)
  const index = Math.max(STEPS.indexOf(status), 0)

  if (status === 'assigned' && item.tripStarted) {
    return (index + 0.5) / max
  }

  return index / max
}

function DeliveryCard({
  item,
  onStartTrip,
  onMarkPickedUp,
  onNavigateToDelivery,
  onVerifyDelivery,
  onSeeDetails,
}) {
  const currentIndex = Math.max(STEPS.indexOf(normalizeStatus(item.status)), 0)
  const progressScale = getProgressScale(item)

  return (
    <article className="rounded-lg border border-neutral-200 bg-white px-4 py-4 sm:px-5 sm:py-5">
      <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">{item.title}</h3>
          <p className="text-xs text-neutral-600">{item.orderLabel}</p>
          <p className="mt-1 text-sm">
            <span className="font-semibold text-[var(--active)]">{item.price}</span>
            <span className="ml-2 text-neutral-500">{item.distance}</span>
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusTone(item.status)}`}
        >
          {STATUS_LABEL[normalizeStatus(item.status)] || 'Assigned'}
        </span>
      </header>

      <ProgressLine currentIndex={currentIndex} progressScale={progressScale} />

      <div className="mt-4 grid grid-cols-1 gap-3 border-b border-neutral-100 pb-4 sm:grid-cols-2">
        <AddressBlock
          label="PICKUP LOCATION"
          title={item.pickup.title}
          subtitle={item.pickup.subtitle}
          right={false}
        />
        <AddressBlock
          label="DELIVERY LOCATION"
          title={item.delivery.title}
          subtitle={item.delivery.subtitle}
          right
        />
      </div>

      <footer className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
        {renderPrimaryAction(item, {
          onStartTrip,
          onMarkPickedUp,
          onNavigateToDelivery,
          onVerifyDelivery,
        })}
        <button
          type="button"
          onClick={() => onSeeDetails?.(item)}
          className="inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-md border border-[var(--active)] px-3 text-xs font-medium text-[var(--active)] hover:bg-amber-50"
        >
          See Details
        </button>
      </footer>
    </article>
  )
}

function ProgressLine({ currentIndex, progressScale }) {
  const max = STEPS.length - 1
  const safeIndex = Math.min(Math.max(currentIndex, 0), max)
  const scaleX = Math.min(Math.max(progressScale, 0), 1)

  return (
    <div className="relative">
      <div className="absolute left-2.5 right-2.5 top-2.5 h-0.5 bg-neutral-200" />
      <div
        className="absolute left-2.5 right-2.5 top-2.5 h-0.5 origin-left bg-[var(--active)] transition-transform duration-500 ease-out"
        style={{ transform: `scaleX(${scaleX})` }}
      />

      <div className="relative flex items-start justify-between">
        {STEPS.map((step, index) => {
          const active = index <= safeIndex
          return (
            <div
              key={step}
              className="flex w-5 flex-col items-center overflow-visible"
            >
              <span
                className={`inline-flex size-5 items-center justify-center rounded-full border text-[11px] transition-colors duration-300 ${
                  active
                    ? 'border-[var(--active)] bg-[var(--active)] text-white'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`mt-1 text-[11px] leading-tight whitespace-nowrap text-center transition-colors duration-300 ${
                  active ? 'text-[var(--active)]' : 'text-neutral-400'
                }`}
              >
                {STEP_LABEL[step]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AddressBlock({ label, title, subtitle, right = false }) {
  return (
    <div className={right ? 'sm:text-right' : ''}>
      <p className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-[var(--active)]">
        <FiMapPin className="size-3" />
        {label}
      </p>
      <p className="mt-1 text-xs font-medium text-zinc-800">{title}</p>
      <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>
    </div>
  )
}

function renderPrimaryAction(item, actions) {
  const normalized = normalizeStatus(item.status)

  if (normalized === 'assigned') {
    if (item.tripStarted) {
      return (
        <button
          type="button"
          onClick={() => actions.onMarkPickedUp?.(item)}
          className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-[var(--active)] px-3 text-xs font-semibold text-white hover:brightness-95"
        >
          <FiCheckCircle className="size-3" />
          Mark Picked
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={() => actions.onStartTrip?.(item)}
        className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-[var(--active)] px-3 text-xs font-semibold text-white hover:brightness-95"
      >
        <FiNavigation className="size-3" />
        Start Trip
      </button>
    )
  }

  if (normalized === 'picked_up') {
    return (
      <button
        type="button"
        onClick={() => actions.onNavigateToDelivery?.(item)}
        className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-[var(--active)] px-3 text-xs font-semibold text-white hover:brightness-95"
      >
        <FiTruck className="size-3" />
        Navigate to Delivery
      </button>
    )
  }

  if (normalized === 'in_transit') {
    return (
      <button
        type="button"
        onClick={() => actions.onVerifyDelivery?.(item)}
        className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-[var(--active)] px-3 text-xs font-semibold text-white hover:brightness-95"
      >
        <FiCheckCircle className="size-3" />
        Verify Delivery
      </button>
    )
  }

  return null
}

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase()
  if (value === 'pickedup' || value === 'picked-up') return 'picked_up'
  if (value === 'intransit' || value === 'in-transit') return 'in_transit'
  return value || 'assigned'
}

function statusTone(status) {
  return STATUS_BADGE[normalizeStatus(status)] || STATUS_BADGE.assigned
}
