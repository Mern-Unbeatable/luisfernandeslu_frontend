import { useNavigate, useParams } from 'react-router-dom'
import MaterialQualityFeedback from '@/components/forms/MaterialQualityFeedback/MaterialQualityFeedback'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import { getProductToReview } from './data/productToReviewDemo'

export default function WriteReviewPage() {
  const { reviewId } = useParams()
  const navigate = useNavigate()
  const product = getProductToReview(reviewId ?? '')

  if (!product) {
    return <NotFoundPage />
  }

  return (
    <MaterialQualityFeedback
      defaultRating={4}
      onSubmit={() => {
        navigate('/customer/product-to-review')
      }}
    />
  )
}
