import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiAlertTriangle, FiClock } from 'react-icons/fi'
import ResubmitDocumentsForm from './ResubmitDocumentsForm'
import { parseRejectionReason } from './documentFields'
import useSubmitVerificationDocuments from './useSubmitVerificationDocuments'

const SUBMITTABLE_STATUSES = ['UNVERIFIED', 'PENDING_REVIEW', 'REJECTED']

/**
 * Dashboard banner for accounts that are not yet approved. Sellers can add products
 * and transporters can browse auctions, but selling and bidding unlock only after
 * an admin approves their documents.
 */
export default function SellerVerificationPanel({
  role = 'supplier',
  verificationStatus,
  rejectionReason,
  className = 'mb-6',
}) {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const { submit, isLoading } = useSubmitVerificationDocuments(role)

  const { reason, invalidDocuments } = useMemo(
    () => parseRejectionReason(rejectionReason),
    [rejectionReason],
  )

  if (!SUBMITTABLE_STATUSES.includes(verificationStatus)) return null

  const isPendingReview = verificationStatus === 'PENDING_REVIEW'
  const isRejected = verificationStatus === 'REJECTED'
  const isTransporter = role === 'transporter'

  const handleSubmit = async (formData) => {
    await submit(formData)
    setShowForm(false)
  }

  const title = isRejected
    ? t('sellerVerification.rejectedTitle')
    : t('sellerVerification.pendingTitle')
  const description = isPendingReview
    ? t(
        isTransporter
          ? 'sellerVerification.transporterUnderReviewDescription'
          : 'sellerVerification.underReviewDescription',
      )
    : isRejected
      ? t('sellerVerification.rejectedDescription')
      : t(
          isTransporter
            ? 'sellerVerification.transporterUnverifiedDescription'
            : 'sellerVerification.unverifiedDescription',
        )
  const actionLabel = isPendingReview
    ? t('sellerVerification.updateDocuments')
    : t('sellerVerification.submitDocuments')
  const Icon = isPendingReview ? FiClock : FiAlertTriangle

  return (
    <section className={`space-y-4 ${className}`}>
      <div
        className={`flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
          isRejected ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
        }`}
        role="status"
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
              isRejected ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-base font-bold text-[var(--primary-text)]">{title}</h2>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">{description}</p>
            {isRejected && reason ? (
              <p className="mt-1 text-sm font-medium text-red-700">{reason}</p>
            ) : null}
          </div>
        </div>
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="shrink-0 rounded-lg bg-[var(--active)] px-4 py-2.5 text-sm font-bold text-white hover:brightness-95"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <ResubmitDocumentsForm
            role={role}
            invalidDocuments={isRejected ? invalidDocuments : []}
            isSubmitting={isLoading}
            onSubmit={handleSubmit}
            onBack={() => setShowForm(false)}
          />
        </div>
      ) : null}
    </section>
  )
}
