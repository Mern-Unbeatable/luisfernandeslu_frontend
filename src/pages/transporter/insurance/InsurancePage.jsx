import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCheckCircle, FiShield, FiUpload } from 'react-icons/fi'
import PolicyListSection from './sections/PolicyListSection'
import UploadInsuranceModal from './sections/UploadInsuranceModal'

export default function InsurancePage() {
  const { t } = useTranslation()
  const [showUploadModal, setShowUploadModal] = useState(false)

  const policies = [
    {
      id: 'pol-001',
      title: 'Civil Liability Insurance',
      provider: 'SafeGuard Insurance Co.',
      policyNumber: 'POL-CL-849372',
      coverageAmount: '€1,000,000',
      expiryDate: '2026-01-15',
    },
    {
      id: 'pol-002',
      title: 'Cargo Liability Insurance',
      provider: 'FreightSecure Insurance',
      policyNumber: 'POL-CG-394821',
      coverageAmount: '€500,000',
      expiryDate: '2026-01-15',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('transporterInsurance.title')}
          </h1>
          <p className="mt-1 text-base text-gray-500">
            {t('transporterInsurance.subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 self-end rounded-xl bg-[var(--active)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-95 sm:self-auto"
        >
          <FiUpload className="size-4" />
          {t('transporterInsurance.uploadInsurance')}
        </button>
      </div>

      {/* Alert Notification */}
      <div className="flex items-start gap-3 rounded-lg border border-[#10B98133] bg-[#10B9811A] p-4 text-[#10B981]">
        <FiCheckCircle className="mt-0.5 size-5 shrink-0 text-[#10B981]" />
        <div>
          <p className="font-medium text-base">
            {t('transporterInsurance.alertTitle')}
          </p>
          <p className="mt-0.5 text-sm text-[#10B981CC]">
            {t('transporterInsurance.alertBody')}
          </p>
        </div>
      </div>

      {/* Required Insurance Types Box */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            {t('transporterInsurance.requiredTitle')}
          </h2>
          <p className="text-base text-gray-400 mt-0.5">
            {t('transporterInsurance.requiredSubtitle')}
          </p>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Card 1 */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4 flex gap-3">
            <FiShield className="size-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {t('transporterInsurance.types.civil.title')}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {t('transporterInsurance.types.civil.description')}
              </p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4 flex gap-3">
            <FiShield className="size-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {t('transporterInsurance.types.cargo.title')}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {t('transporterInsurance.types.cargo.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Details List */}
      <PolicyListSection policies={policies} />

      {/* Upload Insurance Modal */}
      <UploadInsuranceModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={() => setShowUploadModal(false)}
      />
    </div>
  )
}
