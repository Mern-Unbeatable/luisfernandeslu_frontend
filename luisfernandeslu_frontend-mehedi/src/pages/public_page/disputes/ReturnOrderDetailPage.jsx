import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import Seo from '@/components/common/Seo/Seo'
import ReturnOrderDetailView from '@/components/data-display/ReturnsOrdersCenter/ReturnOrderDetailView'
import ReturnsCenterToolbar from '@/components/data-display/ReturnsOrdersCenter/ReturnsCenterToolbar'
import RequestReturnModal from '@/components/data-display/ReturnsOrdersCenter/RequestReturnModal'
import { getReturnOrderDetail } from './data/disputesDemo'

export default function ReturnOrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const order = getReturnOrderDetail(orderId ?? '')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  if (!order) {
    return <NotFoundPage />
  }

  const openModal = (item) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleSubmit = () => {
    navigate('/returns/request/ret-001')
  }

  return (
    <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
      <Seo />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ReturnOrderDetailView
          order={order}
          onReturnRefund={openModal}
          toolbar={
            <ReturnsCenterToolbar
              tab="orders"
              onTabChange={(next) => {
                if (next === 'return') navigate('/returns?tab=return')
                else navigate('/returns')
              }}
              query={query}
              onQueryChange={setQuery}
            />
          }
        />
        <RequestReturnModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={selectedItem}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
