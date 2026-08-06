import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails'
import Seo from '@/components/common/Seo/Seo'
import NotFoundPage from '../NotFoundPage'
import SendQuoteModal from './components/SendQuoteModal'
import { getProductDetailBySlug } from './data/productDetailData'

function resolveDetailRole(user) {
  if (user?.role === 'customer') return 'customer'
  if (user?.role === 'company') return 'company'
  return 'company'
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const product = getProductDetailBySlug(slug ?? '')

  if (!product) {
    return <NotFoundPage />
  }

  const role = resolveDetailRole(user)

  const handleAction = (actionId) => {
    if (actionId === 'send_quote') setQuoteOpen(true)
    if (actionId === 'buy_now') {
      navigate(user?.role === 'customer' ? '/checkout' : '/checkout/company')
    }
  }

  return (
    <div className="w-full bg-white py-6 sm:py-8 lg:py-10">
      <Seo
        title={product.title}
        description={product.descriptionParagraphs?.[0]}
      />
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <ProductDetails
          role={role}
          product={product}
          quantity={10}
          onAction={handleAction}
        />
      </div>

      <SendQuoteModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        product={product}
      />
    </div>
  )
}
