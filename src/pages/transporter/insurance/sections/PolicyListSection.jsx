import { FiShield, FiCalendar, FiCheckCircle } from 'react-icons/fi'

export default function PolicyListSection({ policies }) {
  return (
    <div className="space-y-4">
      {policies.map((policy) => (
        <div
          key={policy.id}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          {/* Policy Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/30 px-5 py-4">
            <div className="flex items-center gap-2">
              <FiShield className="size-4.5 text-blue-500" />
              <h3 className="font-bold text-gray-800 text-base">
                {policy.title}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#10B9811A] border border-[#10B98133] px-2.5 py-0.5 text-sm  text-[#10B981]">
              <FiCheckCircle className="size-3.5" />
              Verified
            </span>
          </div>

          {/* Policy Details Grid */}
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
              {/* Column 1: Provider and Actions (spans 2 columns / 40% width) */}
              <div className="space-y-4 sm:col-span-2">
                <div>
                  <p className="text-sm text-gray-400">Provider</p>
                  <p className="mt-1 text-base font-semibold text-gray-700">
                    {policy.provider}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--active)] px-4 text-xs font-semibold text-white shadow-sm hover:brightness-95 whitespace-nowrap"
                  >
                    View Document
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Download PDF
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Renew Policy
                  </button>
                </div>
              </div>

              {/* Column 2: Policy Number (spans 1 column / 20% width) */}
              <div className="sm:col-span-1">
                <p className="text-sm text-gray-400">Policy Number</p>
                <p className="mt-1 text-base font-semibold text-gray-700">
                  {policy.policyNumber}
                </p>
              </div>

              {/* Column 3: Coverage Amount (spans 1 column / 20% width) */}
              <div className="sm:col-span-1">
                <p className="text-sm text-gray-400">Coverage Amount</p>
                <p className="mt-1 text-base font-bold text-[var(--active)]">
                  {policy.coverageAmount}
                </p>
              </div>

              {/* Column 4: Expiry Date (spans 1 column / 20% width - right aligned to stack under Verified badge) */}
              <div className="sm:col-span-1 sm:text-right flex flex-col sm:items-end">
                <p className="text-sm text-gray-400">Expiry Date</p>
                <div className="mt-1 flex items-center gap-1.5 text-base font-semibold text-gray-700">
                  <FiCalendar className="size-4 text-gray-400" />
                  <span>{policy.expiryDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
