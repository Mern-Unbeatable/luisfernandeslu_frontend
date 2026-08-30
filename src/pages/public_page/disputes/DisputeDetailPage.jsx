import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft } from 'react-icons/fi'
import DisputeResolution from '@/components/data-display/DisputeResolution'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import Seo from '@/components/common/Seo/Seo'
import { useGetCustomerDisputeByIdQuery } from '@/features/customer/customerDisputeApi'
import { mapCustomerDisputeDetail } from '@/features/customer/customerDisputeMappers'

export default function DisputeDetailPage() {
  const { disputeId } = useParams()
  const { t } = useTranslation()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCustomerDisputeByIdQuery(disputeId ?? '', {
    skip: !disputeId,
  })

  const baseDispute = useMemo(() => mapCustomerDisputeDetail(data), [data])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (baseDispute) {
      setMessages(baseDispute.messages ?? [])
    }
  }, [baseDispute])

  const dispute = baseDispute ? { ...baseDispute, messages } : null

  if (isLoading && !data) {
    return (
      <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
        <Seo />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
            {t('disputesCenter.loading')}
          </p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
        <Seo />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
            <p className="text-sm text-red-700">
              {error?.data?.message || t('disputesCenter.loadFailed')}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t('disputesCenter.retry')}
            </button>
          </div>
        </div>
      </div>
    )
  }

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
            setMessages((prev) => [
              ...prev,
              {
                id: `local-${Date.now()}`,
                author: 'You',
                roleLabel: 'Buyer',
                role: 'buyer',
                align: 'right',
                at: new Date().toLocaleString(),
                text,
              },
            ])
          }}
        />
      </div>
    </div>
  )
}
