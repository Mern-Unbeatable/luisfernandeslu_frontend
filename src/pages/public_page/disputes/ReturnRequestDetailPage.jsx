import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import Seo from '@/components/common/Seo/Seo'
import ReturnRequestDetailView from '@/components/data-display/ReturnsOrdersCenter/ReturnRequestDetailView'
import ReturnsCenterToolbar from '@/components/data-display/ReturnsOrdersCenter/ReturnsCenterToolbar'
import { useGetCustomerReturnRequestByIdQuery } from '@/features/customer/customerReturnApi'
import { mapCustomerReturnRequestDetail } from '@/features/customer/customerReturnMappers'

export default function ReturnRequestDetailPage() {
  const { returnId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCustomerReturnRequestByIdQuery(returnId ?? '', {
    skip: !returnId,
  })

  const request = useMemo(() => mapCustomerReturnRequestDetail(data), [data])

  if (isLoading && !data) {
    return (
      <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
        <Seo />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
            {t('returnsCenter.loading')}
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
              {error?.data?.message || t('returnsCenter.loadFailed')}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t('returnsCenter.retry')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!request) {
    return <NotFoundPage />
  }

  return (
    <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
      <Seo />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ReturnsCenterToolbar
          tab="return"
          onTabChange={(next) => {
            if (next === 'return') navigate('/returns?tab=return')
            else navigate('/returns')
          }}
          query={query}
          onQueryChange={setQuery}
        />
        <ReturnRequestDetailView request={request} />
      </div>
    </div>
  )
}
