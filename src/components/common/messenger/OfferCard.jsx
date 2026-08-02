import {
  FiCheck,
  FiMapPin,
  FiMessageSquare,
  FiPackage,
} from 'react-icons/fi'

/**
 * Offer card — matches messenger design (orange border, section cards, pay/negotiate).
 */
export default function OfferCard({ offer, onPayNow, onNegotiate }) {
  if (!offer) return null

  const pricing = offer.pricing || []
  const summary = offer.summary || {}

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-[var(--active)] bg-[#FAFBFC]">
      {/* Header */}
      <div className="flex items-start gap-2.5 px-4 pt-4 pb-3">
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <FiPackage className="size-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-[var(--primary-text)]">
            {offer.title || 'Offer Card'}
          </p>
          <p className="text-xs text-[var(--secondary-text)]">
            {offer.statusLabel || 'Pending Response'}
          </p>
        </div>
      </div>

      <div className="space-y-2.5 px-3 pb-3">
        {/* Product */}
        <Section>
          <Field label="Product" value={offer.product} />
          {offer.quantity ? (
            <Field label="Quantity" value={offer.quantity} />
          ) : null}
        </Section>

        {/* Project */}
        <Section>
          <Field label="Project Name" value={offer.projectName} />
          {offer.address ? (
            <p className="mt-1.5 inline-flex items-start gap-1.5 text-xs text-[var(--secondary-text)]">
              <FiMapPin className="mt-0.5 size-3.5 shrink-0 text-[var(--active)]" />
              <span>{offer.address}</span>
            </p>
          ) : null}
        </Section>

        {/* Unloading */}
        <Section>
          <Field
            label="Types of unloading Needed"
            value={offer.unloadingType || offer.unloading}
          />
          {offer.accessConditions ? (
            <Field label="Access Conditions" value={offer.accessConditions} />
          ) : null}
        </Section>

        {/* Pricing grid */}
        {pricing.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
            <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
              {pricing.map((cell, index) => (
                <div key={`${cell.label}-${index}`} className="px-3 py-2.5">
                  <p className="text-[11px] text-[var(--secondary-text)]">
                    {cell.label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--primary-text)]">
                    {cell.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Summary highlight */}
        {(summary.firstInstallment || summary.remainingBalance) ? (
          <div className="rounded-lg border border-[var(--active)] bg-white px-3 py-2.5">
            {summary.firstInstallment ? (
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-[var(--secondary-text)]">
                  1st Installment
                </span>
                <span className="font-bold text-emerald-600">
                  {summary.firstInstallment}
                </span>
              </div>
            ) : null}
            {summary.remainingBalance ? (
              <div className="mt-1.5 flex items-center justify-between gap-2 text-sm">
                <span className="text-[var(--secondary-text)]">
                  Remaining Balance
                </span>
                <span className="font-bold text-[#F64C00]">
                  {summary.remainingBalance}
                </span>
              </div>
            ) : null}
            {summary.note ? (
              <p className="mt-2 text-[11px] text-[var(--secondary-text)]">
                {summary.note}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-3 pb-3">
        <button
          type="button"
          onClick={onPayNow}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--active)] px-3 py-2.5 text-sm font-semibold text-white hover:brightness-95"
        >
          <FiCheck className="size-4" />
          Pay Now
        </button>
        <button
          type="button"
          onClick={onNegotiate}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#1E293B] px-3 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <FiMessageSquare className="size-4" />
          Negotiate
        </button>
      </div>
    </div>
  )
}

function Section({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-gray-100 bg-white p-3 ${className}`}>
      {children}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="mt-1 first:mt-0">
      <p className="text-[11px] text-[var(--secondary-text)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--primary-text)]">
        {value || '—'}
      </p>
    </div>
  )
}
