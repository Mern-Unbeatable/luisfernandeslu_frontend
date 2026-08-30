import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import DisputeResolution from '@/components/data-display/DisputeResolution'
import {
  useGetAdminDisputeByIdQuery,
  useUpdateAdminDisputeStatusMutation,
} from '@/features/admin/adminDisputeApi'
import { mapAdminDisputeDetail } from '@/features/admin/adminDisputeMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

const I18N_KEY = 'adminDisputesResolution'

export default function AdminDisputeDetailPage() {
  const { t } = useTranslation()
  const { disputeId } = useParams()

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminDisputeByIdQuery(disputeId ?? '', {
    skip: !disputeId,
  })

  const [updateDisputeStatus] = useUpdateAdminDisputeStatusMutation()

  const dispute = mapAdminDisputeDetail(data)

  const handleStatusChange = useCallback(
    async (status) => {
      if (!disputeId) return

      try {
        const result = await updateDisputeStatus({
          disputeId,
          status,
        }).unwrap()

        if (result?.success === false) {
          toast.error(
            getAuthErrorMessage(result, t(`${I18N_KEY}.statusUpdateFailed`)),
          )
          return
        }

        toast.success(result?.message || t(`${I18N_KEY}.statusUpdated`))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.statusUpdateFailed`)))
      }
    },
    [disputeId, updateDisputeStatus, t],
  )

  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.title`, { id: disputeId ?? '' })} />
        <p className="text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.loading`)}
        </p>
      </div>
    )
  }

  if (isError || !dispute) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.notFound`)} />
        <p className="text-sm text-[var(--secondary-text)]">
          {getAuthErrorMessage(error, t(`${I18N_KEY}.detail.notFound`))}
        </p>
        {isError ? (
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-semibold text-[var(--active)] underline"
          >
            {t(`${I18N_KEY}.retry`)}
          </button>
        ) : null}
        <Link
          to="/admin/disputes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t(`${I18N_KEY}.detail.back`)}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Seo
        title={t(`${I18N_KEY}.detail.title`, { id: dispute.id })}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <Link
        to="/admin/disputes"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)] hover:underline"
      >
        <FiArrowLeft className="size-4" aria-hidden />
        {t(`${I18N_KEY}.detail.back`)}
      </Link>

      <div
        className={isFetching && data ? 'opacity-60 transition-opacity' : undefined}
      >
        <DisputeResolution
          variant="dashboard"
          dispute={dispute}
          currentUserRole="admin"
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  )
}
