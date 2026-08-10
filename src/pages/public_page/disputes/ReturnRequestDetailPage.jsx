import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import Seo from '@/components/common/Seo/Seo'
import ReturnRequestDetailView from '@/components/data-display/ReturnsOrdersCenter/ReturnRequestDetailView'
import ReturnsCenterToolbar from '@/components/data-display/ReturnsOrdersCenter/ReturnsCenterToolbar'
import { getReturnRequestDetail } from './data/disputesDemo'

export default function ReturnRequestDetailPage() {
  const { returnId } = useParams()
  const navigate = useNavigate()
  const request = getReturnRequestDetail(returnId ?? '')
  const [query, setQuery] = useState('')

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
        <ReturnRequestDetailView request={request} className="mt-0" />
      </div>
    </div>
  )
}
