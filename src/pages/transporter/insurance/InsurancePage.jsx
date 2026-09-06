import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiAlertCircle, FiCheckCircle, FiShield, FiUpload } from 'react-icons/fi'
import Toast from '../../../components/common/Toast'
import { getAuthErrorMessage } from '../../../features/auth/authUtils'
import {
  useDownloadTransporterInsurancePdfMutation,
  useGetTransporterInsuranceQuery,
  useUploadTransporterInsuranceMutation,
} from '../../../features/transporter/transporterApi'
import {
  buildInsuranceUploadFormData,
  downloadBlobFile,
  mapInsuranceResponse,
} from '../../../features/transporter/insuranceMappers'
import PolicyListSection from './sections/PolicyListSection'
import UploadInsuranceModal from './sections/UploadInsuranceModal'
import Skeleton from '../../../components/common/Skeleton/Skeleton'

export default function InsurancePage() {
  const { t } = useTranslation()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [renewType, setRenewType] = useState(null)
  const [toast, setToast] = useState({
    open: false,
    message: '',
    variant: 'success',
  })

  const { data, isLoading, isError, error, refetch } =
    useGetTransporterInsuranceQuery()
  const [uploadInsurance, { isLoading: isUploading }] =
    useUploadTransporterInsuranceMutation()
  const [downloadPdf, { isLoading: isDownloadingPdf }] =
    useDownloadTransporterInsurancePdfMutation()

  const { requirementsMet, policies } = useMemo(
    () => mapInsuranceResponse(data, t),
    [data, t],
  )

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }))
  }, [])

  const openUploadModal = (type = null) => {
    setRenewType(type)
    setShowUploadModal(true)
  }

  const closeUploadModal = () => {
    setShowUploadModal(false)
    setRenewType(null)
  }

  const handleUpload = async (payload) => {
    try {
      const formData = buildInsuranceUploadFormData(payload)
      await uploadInsurance(formData).unwrap()
      setToast({
        open: true,
        message: t('transporterInsurance.upload.success', {
          defaultValue: 'Insurance uploaded successfully',
        }),
        variant: 'success',
      })
      return true
    } catch (err) {
      setToast({
        open: true,
        message: getAuthErrorMessage(err, 'Failed to upload insurance'),
        variant: 'error',
      })
      return false
    }
  }

  const handleDownloadPdf = async (policy) => {
    try {
      const blob = await downloadPdf(policy.type).unwrap()
      downloadBlobFile(blob, `${policy.type}-insurance.pdf`)
    } catch (err) {
      setToast({
        open: true,
        message: getAuthErrorMessage(err, 'Failed to download PDF'),
        variant: 'error',
      })
    }
  }

  const handleViewDocument = (policy) => {
    if (policy.documentUrl) {
      window.open(policy.documentUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setToast({
      open: true,
      message: t('transporterInsurance.documentUnavailable', {
        defaultValue: 'Document not available',
      }),
      variant: 'error',
    })
  }

  return (
    <div className="space-y-6">
      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={closeToast}
      />

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
          onClick={() => openUploadModal()}
          className="inline-flex items-center gap-2 self-end rounded-xl bg-[var(--active)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-95 sm:self-auto"
        >
          <FiUpload className="size-4" />
          {t('transporterInsurance.uploadInsurance')}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading">
          <span className="sr-only">Loading</span>
          {/* Status banner skeleton */}
          <div className="h-16 w-full rounded-lg bg-gray-100 animate-pulse" />

          {/* Required section skeleton */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>

          {/* Policy cards skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={`policy-skel-${i}`}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/30 px-5 py-4">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                    <div className="space-y-4 sm:col-span-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-5 w-36" />
                    </div>
                    <div className="space-y-4 sm:col-span-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-44" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, 'Failed to load insurance')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <>
          {requirementsMet ? (
            <div className="flex items-start gap-3 rounded-lg border border-[#10B98133] bg-[#10B9811A] p-4 text-[#10B981]">
              <FiCheckCircle className="mt-0.5 size-5 shrink-0 text-[#10B981]" />
              <div>
                <p className="text-base font-medium">
                  {t('transporterInsurance.alertTitle')}
                </p>
                <p className="mt-0.5 text-sm text-[#10B981CC]">
                  {t('transporterInsurance.alertBody')}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <FiAlertCircle className="mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-base font-medium">
                  {t('transporterInsurance.alertPendingTitle', {
                    defaultValue: 'Insurance requirements not met',
                  })}
                </p>
                <p className="mt-0.5 text-sm text-amber-700">
                  {t('transporterInsurance.alertPendingBody', {
                    defaultValue:
                      'Upload and verify both civil and cargo insurance policies to participate in auctions and accept deliveries.',
                  })}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-lg font-medium text-gray-800">
                {t('transporterInsurance.requiredTitle')}
              </h2>
              <p className="mt-0.5 text-base text-gray-400">
                {t('transporterInsurance.requiredSubtitle')}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/30 p-4">
                <FiShield className="mt-0.5 size-5 shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    {t('transporterInsurance.types.civil.title')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {t('transporterInsurance.types.civil.description')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/30 p-4">
                <FiShield className="mt-0.5 size-5 shrink-0 text-blue-500" />
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    {t('transporterInsurance.types.cargo.title')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {t('transporterInsurance.types.cargo.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {policies.length === 0 ? (
            <p className="text-sm text-gray-500">No insurance policies found.</p>
          ) : (
            <PolicyListSection
              policies={policies}
              onViewDocument={handleViewDocument}
              onDownloadPdf={handleDownloadPdf}
              onRenew={openUploadModal}
              isDownloadingPdf={isDownloadingPdf}
            />
          )}
        </>
      ) : null}

      <UploadInsuranceModal
        isOpen={showUploadModal}
        onClose={closeUploadModal}
        onSubmit={handleUpload}
        isSubmitting={isUploading}
        initialType={renewType}
        isRenew={Boolean(renewType)}
      />
    </div>
  )
}
