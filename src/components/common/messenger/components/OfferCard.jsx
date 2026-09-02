import {
  FiCalendar,
  FiCheck,
  FiDollarSign,
  FiMapPin,
  FiMessageSquare,
  FiPackage,
} from 'react-icons/fi'

const PRICING_ICONS = {
  dollar: FiDollarSign,
  calendar: FiCalendar,
}

/**
 * Offer card — messenger design (cream fill, orange border, section cards).
 * Pay Now / Negotiate only for the recipient (showActions=true).
 */
export default function OfferCard({
  offer,
  showActions = false,
  onPayNow,
  onNegotiate,
}) {
  if (!offer) return null

  const pricing = offer.pricing || []
  const summary = offer.summary || {}

  return (
    <div className="w-full max-w-[340px] overflow-hidden rounded-xl border border-[var(--active)] bg-[#FFFBF5] shadow-sm sm:max-w-md">
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <span
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
          aria-hidden
        >
          <FiPackage className="size-4" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--primary-text)]">
            {offer.title || 'Offer Card'}
          </p>
          <p className="text-xs text-[var(--secondary-text)]">
            {offer.statusLabel ||
              (showActions ? 'Pending Response' : 'Awaiting their response')}
          </p>
        </div>
      </div>

      <div className="space-y-2.5 px-3 pb-3">
        <Section>
          <p className="inline-flex items-center gap-1.5 text-[11px] text-[var(--secondary-text)]">
            <FiPackage className="size-3.5 shrink-0" strokeWidth={1.75} />
            Product
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--primary-text)]">
            {offer.product || '—'}
          </p>
          {offer.quantity ? (
            <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
              Quantity: {offer.quantity}
            </p>
          ) : null}
        </Section>

        <Section>
          <p className="text-[11px] text-[var(--secondary-text)]">Project Name</p>
          <p className="mt-1 text-sm font-bold text-[var(--primary-text)]">
            {offer.projectName || '—'}
          </p>
          {offer.address ? (
            <p className="mt-1.5 inline-flex items-start gap-1.5 text-xs text-[var(--secondary-text)]">
              <FiMapPin
                className="mt-0.5 size-3.5 shrink-0 text-[var(--secondary-text)]"
                strokeWidth={1.75}
              />
              <span>{offer.address}</span>
            </p>
          ) : null}
        </Section>

        <Section>
          <Field
            label="Types of unloading Needed"
            value={offer.unloadingType || offer.unloading}
          />
          {offer.accessConditions ? (
            <Field
              label="Access Conditions"
              value={offer.accessConditions}
              className="mt-3"
            />
          ) : null}
        </Section>

        {pricing.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
              {pricing.map((cell, index) => {
                const Icon = cell.icon ? PRICING_ICONS[cell.icon] : null
                return (
                  <div key={`${cell.label}-${index}`} className="px-3 py-2.5">
                    <p className="inline-flex items-center gap-1 text-[11px] text-[var(--secondary-text)]">
                      {Icon ? (
                        <Icon className="size-3 shrink-0" strokeWidth={1.75} />
                      ) : null}
                      {cell.label}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[var(--primary-text)]">
                      {cell.value}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        {summary.firstInstallment || summary.remainingBalance ? (
          <div className="rounded-lg border border-[var(--active)] bg-white px-3 py-3">
            <div className="grid grid-cols-2 gap-3">
              {summary.firstInstallment ? (
                <div>
                  <p className="text-[11px] text-[var(--secondary-text)]">
                    1st Installment
                  </p>
                  <p className="mt-0.5 text-base font-bold text-emerald-600">
                    {summary.firstInstallment}
                  </p>
                </div>
              ) : null}
              {summary.remainingBalance ? (
                <div>
                  <p className="text-[11px] text-[var(--secondary-text)]">
                    Remaining Balance
                  </p>
                  <p className="mt-0.5 text-base font-bold text-[var(--active)]">
                    {summary.remainingBalance}
                  </p>
                </div>
              ) : null}
            </div>
            {summary.note ? (
              <>
                <div className="my-2.5 border-t border-gray-200" />
                <p className="text-center text-[11px] text-[var(--secondary-text)]">
                  {summary.note}
                </p>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {showActions ? (
        <div className="flex gap-2 px-3 pb-3">
          {String(offer.status || offer.statusLabel || '').toUpperCase() === 'PAID' ? (
            <button
              type="button"
              disabled
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-white opacity-80 cursor-not-allowed"
            >
              <FiCheck className="size-4" strokeWidth={2.25} />
              Paid
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onPayNow}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--active)] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-95"
              >
                <FiCheck className="size-4" strokeWidth={2.25} />
                Pay Now
              </button>
              <button
                type="button"
                onClick={onNegotiate}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#1E293B] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              >
                <FiMessageSquare className="size-4" strokeWidth={1.75} />
                Negotiate
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}

function Section({ children, className = '' }) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

function Field({ label, value, className = '' }) {
  return (
    <div className={className}>
      <p className="text-[11px] text-[var(--secondary-text)]">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-[var(--primary-text)]">
        {value || '—'}
      </p>
    </div>
  )
}
