import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft } from 'react-icons/fi'
import DisputeResolution from '@/components/data-display/DisputeResolution'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import Seo from '@/components/common/Seo/Seo'
import { getDisputeDetail } from './data/disputesDemo'

export default function DisputeDetailPage() {
  const { disputeId } = useParams()
  const { t } = useTranslation()
  const initial = getDisputeDetail(disputeId ?? '')
  const [dispute, setDispute] = useState(initial)

  if (!dispute) {
    return <NotFoundPage />
  }

  return (
    <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
      <Seo />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/dispute-resolution"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] hover:text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t('disputesCenter.backToList')}
        </Link>

        <DisputeResolution
          variant="public"
          dispute={dispute}
          currentUserRole="buyer"
          onSendMessage={(text) => {
            setDispute((prev) => ({
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: `local-${Date.now()}`,
                  author: 'You',
                  roleLabel: 'Buyer',
                  role: 'buyer',
                  align: 'right',
                  at: new Date().toLocaleString(),
                  text,
                },
              ],
            }))
          }}
        />
      </div>
    </div>
  )
}
