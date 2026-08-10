import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import DisputeResolution from '@/components/data-display/DisputeResolution'
import {
  DEMO_SUPPLIER_DISPUTES,
  getSupplierDisputeDetail,
} from '@/data/demoData'

export default function DisputeDetailPage() {
  const { t } = useTranslation()
  const { disputeId } = useParams()

  const row = useMemo(
    () => DEMO_SUPPLIER_DISPUTES.find((entry) => entry.id === disputeId) ?? null,
    [disputeId],
  )

  const initialDetail = useMemo(
    () => getSupplierDisputeDetail(disputeId ?? ''),
    [disputeId],
  )

  const [dispute, setDispute] = useState(initialDetail)

  useEffect(() => {
    setDispute(getSupplierDisputeDetail(disputeId ?? ''))
  }, [disputeId])

  if (!row || !dispute) {
    return (
      <div className="space-y-4">
        <Seo title={t('supplierDisputesResolution.detail.notFound')} />
        <p className="text-sm text-[var(--secondary-text)]">
          {t('supplierDisputesResolution.detail.notFound')}
        </p>
        <Link
          to="/supplier/disputes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t('supplierDisputesResolution.detail.back')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Seo
        title={t('supplierDisputesResolution.detail.title', {
          id: row.disputeId,
        })}
        description={t('supplierDisputesResolution.subtitle')}
      />

      <Link
        to="/supplier/disputes"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] hover:text-[var(--active)]"
      >
        <FiArrowLeft className="size-4" aria-hidden />
        {t('supplierDisputesResolution.detail.back')}
      </Link>

      <DisputeResolution
        variant="dashboard"
        dispute={dispute}
        currentUserRole="seller"
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
                author: row.supplier,
                roleLabel: 'Seller',
                role: 'seller',
                align: 'left',
                at: new Date().toLocaleString(),
                text,
              },
            ],
          }))
          // TODO: wire supplier dispute message API
        }}
      />
    </div>
  )
}
