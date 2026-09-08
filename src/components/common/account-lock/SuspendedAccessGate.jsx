import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { patchAuthUser } from '@/features/auth/authSlice'
import { useResubmitSupplierDocumentsMutation } from '@/features/supplier/profile/profileApi'
import { useResubmitFactoryDocumentsMutation } from '@/features/factory-profile/factoryProfileApi'
import { useResubmitTransporterDocumentsMutation } from '@/features/transporter-profile/transporterProfileApi'
import GetFullAccessModal from './GetFullAccessModal'
import ResubmitDocumentsForm from './ResubmitDocumentsForm'
import { parseRejectionReason } from './documentFields'

function BlurredDashboardShell({ title }) {
  return (
    <div className="pointer-events-none select-none blur-[2px]" aria-hidden>
      <h1 className="text-2xl font-bold text-[var(--primary-text)]">{title}</h1>
      <p className="mt-1 text-sm text-[var(--secondary-text)]">Business metrics overview</p>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {['$125,430', '45', '89%', '2.4 Days'].map((value) => (
          <div
            key={value}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="mt-3 text-xl font-bold text-[var(--primary-text)]">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 xl:col-span-2">
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="mt-6 h-48 rounded-lg bg-gradient-to-t from-orange-100/80 to-transparent" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="h-4 w-36 rounded bg-gray-200" />
          <div className="mx-auto mt-8 size-40 rounded-full border-[16px] border-orange-200 border-t-sky-300 border-r-emerald-300 border-b-violet-300" />
        </div>
      </div>
    </div>
  )
}

/**
 * Locked dashboard UX for SUSPENDED accounts:
 * - REJECTED → Get Full Access modal → upload only requested docs
 * - PENDING_REVIEW (after resubmit) → waiting modal
 */
export default function SuspendedAccessGate({
  role = 'supplier',
  rejectionReason,
  dashboardTitle,
}) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [view, setView] = useState('gate')
  const [resubmitSupplier, supplierState] = useResubmitSupplierDocumentsMutation()
  const [resubmitFactory, factoryState] = useResubmitFactoryDocumentsMutation()
  const [resubmitTransporter, transporterState] =
    useResubmitTransporterDocumentsMutation()

  const resubmit =
    role === 'factory'
      ? resubmitFactory
      : role === 'transporter'
        ? resubmitTransporter
        : resubmitSupplier
  const isLoading =
    role === 'factory'
      ? factoryState.isLoading
      : role === 'transporter'
        ? transporterState.isLoading
        : supplierState.isLoading

  const { invalidDocuments } = useMemo(
    () => parseRejectionReason(rejectionReason),
    [rejectionReason],
  )

  const needsUpload = Boolean(rejectionReason)
  const isPendingReview = !needsUpload

  const handleSubmit = async (formData) => {
    const result = await resubmit(formData).unwrap()
    dispatch(
      patchAuthUser({
        profile: {
          verificationStatus:
            result?.verificationStatus || result?.data?.verificationStatus || 'PENDING_REVIEW',
          rejectionReason: null,
        },
      }),
    )
    toast.success(
      result?.message ||
        result?.data?.message ||
        t('accountLock.submitSuccess', 'Documents submitted for review'),
    )
    setView('gate')
  }

  if (view === 'upload' && needsUpload) {
    return (
      <ResubmitDocumentsForm
        role={role}
        invalidDocuments={invalidDocuments}
        isSubmitting={isLoading}
        onSubmit={handleSubmit}
        onBack={() => setView('gate')}
      />
    )
  }

  const description = isPendingReview
    ? t(
        'accountLock.pendingReviewDescription',
        'Your documents are under review. Full dashboard access will unlock after admin approval.',
      )
    : t(
        'accountLock.rejectedDescription',
        'Access the Full Dashboard and Upload products. Please upload your documents.',
      )

  return (
    <div className="relative min-h-[70vh] overflow-hidden rounded-2xl">
      <BlurredDashboardShell
        title={
          dashboardTitle ||
          t('accountLock.businessOverview', 'Business Overview')
        }
      />
      <GetFullAccessModal
        pending={isPendingReview}
        title={
          isPendingReview
            ? t('accountLock.underReview', 'Under Review')
            : t('accountLock.getFullAccess', 'Get Full Access')
        }
        description={description}
        onAction={needsUpload ? () => setView('upload') : undefined}
      />
    </div>
  )
}
