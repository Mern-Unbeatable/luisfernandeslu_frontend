import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CompanyOrderDetail from '@/components/data-display/CompanyOrderDetail/CompanyOrderDetail'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import { useGetCompanyOrderByIdQuery } from '@/features/company/companyOrderApi'
import { mapCompanyOrderDetail } from '@/features/company/companyOrderMappers'

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCompanyOrderByIdQuery(orderId ?? '', {
    skip: !orderId,
  })

  const order = useMemo(() => mapCompanyOrderDetail(data), [data])

  if (isLoading && !data) {
    return (
      <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
        {t('companyOrders.loading')}
      </p>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
        <p className="text-sm text-red-700">
          {error?.data?.message || t('companyOrders.loadFailed')}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
        >
          {t('companyOrders.retry')}
        </button>
      </div>
    )
  }

  if (!order) {
    return <NotFoundPage />
  }

  return (
    <CompanyOrderDetail
      order={order}
      onChatDriver={() => navigate('/messages')}
    />
  )
}
