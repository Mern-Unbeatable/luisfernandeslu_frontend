import { useTranslation } from 'react-i18next'
import { FiShield, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi'

export default function PolicyListSection({
  policies,
  onViewDocument,
  onDownloadPdf,
  onRenew,
  isDownloadingPdf = false,
}) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {policies.map((policy) => {
        const isVerified = policy.isVerified

        return (
          <div
            key={policy.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/30 px-5 py-4">
              <div className="flex items-center gap-2">
                <FiShield className="size-4.5 text-blue-500" />
                <h3 className="text-base font-bold text-gray-800">{policy.title}</h3>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm ${
                  isVerified
                    ? 'border-[#10B98133] bg-[#10B9811A] text-[#10B981]'
                    : 'border-red-200 bg-red-50 text-red-600'
                }`}
              >
                {isVerified ? (
                  <FiCheckCircle className="size-3.5" />
                ) : (
                  <FiXCircle className="size-3.5" />
                )}
                {t(
                  isVerified
                    ? 'transporterInsurance.verified'
                    : 'transporterInsurance.expired',
                  { defaultValue: isVerified ? 'Verified' : 'Expired' },
                )}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                <div className="space-y-4 sm:col-span-2">
                  <div>
                    <p className="text-sm text-gray-400">
                      {t('transporterInsurance.provider')}
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-700">
                      {policy.provider}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDocument?.(policy)}
                      className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg bg-[var(--active)] px-4 text-xs font-semibold text-white shadow-sm hover:brightness-95"
                    >
                      {t('transporterInsurance.viewDocument')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadPdf?.(policy)}
                      disabled={isDownloadingPdf}
                      className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60"
                    >
                      {t('transporterInsurance.downloadPdf')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRenew?.(policy.type)}
                      className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      {t('transporterInsurance.renewPolicy')}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <p className="text-sm text-gray-400">
                    {t('transporterInsurance.policyNumber')}
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-700">
                    {policy.policyNumber}
                  </p>
                </div>

                <div className="sm:col-span-1">
                  <p className="text-sm text-gray-400">
                    {t('transporterInsurance.coverageAmount')}
                  </p>
                  <p className="mt-1 text-base font-bold text-[var(--active)]">
                    {policy.coverageAmount}
                  </p>
                </div>

                <div className="flex flex-col sm:col-span-1 sm:items-end sm:text-right">
                  <p className="text-sm text-gray-400">
                    {t('transporterInsurance.expiryDate')}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-base font-semibold text-gray-700">
                    <FiCalendar className="size-4 text-gray-400" />
                    <span>{policy.expiryDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
