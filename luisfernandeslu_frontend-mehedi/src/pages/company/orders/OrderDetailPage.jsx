import { useNavigate, useParams } from 'react-router-dom'
import CompanyOrderDetail from '@/components/data-display/CompanyOrderDetail/CompanyOrderDetail'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import { getCompanyOrderDetail } from './data/companyOrdersDemo'

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = getCompanyOrderDetail(orderId ?? '')

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
