import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import DisputeResolution from '@/components/data-display/DisputeResolution'
import {
  getAdminDisputeDetail,
  getAdminDisputeRow,
} from './data/disputesAdminDemo'

const I18N_KEY = 'adminDisputesResolution'

export default function AdminDisputeDetailPage() {
  const { t } = useTranslation()
  const { disputeId } = useParams()

  const row = useMemo(
    () => getAdminDisputeRow(disputeId ?? ''),
    [disputeId],
  )

  const initialDetail = useMemo(
    () => getAdminDisputeDetail(disputeId ?? ''),
    [disputeId],
  )

  const [dispute, setDispute] = useState(initialDetail)

  useEffect(() => {
    setDispute(getAdminDisputeDetail(disputeId ?? ''))
  }, [disputeId])

  if (!row || !dispute) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.notFound`)} />
        <p className="text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.detail.notFound`)}
        </p>
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
        title={t(`${I18N_KEY}.detail.title`, { id: row.disputeId })}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <Link
        to="/admin/disputes"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)] hover:underline"
      >
        <FiArrowLeft className="size-4" aria-hidden />
        {t(`${I18N_KEY}.detail.back`)}
      </Link>

      <DisputeResolution
        variant="dashboard"
        dispute={dispute}
        currentUserRole="admin"
        onStatusChange={(status) =>
          setDispute((prev) => ({ ...prev, status }))
        }
        onSendMessage={(text) => {
          setDispute((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: `local-${Date.now()}`,
                author: 'Support',
                roleLabel: 'Admin',
                role: 'admin',
                align: 'left',
                at: new Date().toLocaleString(),
                text,
              },
            ],
          }))
        }}
      />
    </div>
  )
}
