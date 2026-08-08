import { useNavigate, useParams } from 'react-router-dom'
import BuyerOrderInformation from '@/components/data-display/BuyerOrderInformation/BuyerOrderInformation'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import { getBuyerOrderDetail } from './data/buyerOrderDetailDemo'

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = getBuyerOrderDetail(orderId ?? '')

  if (!order) {
    return <NotFoundPage />
  }

  return (
    <BuyerOrderInformation
      order={order}
      onChatDriver={() => navigate('/messages')}
    />
  )
}
