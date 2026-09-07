import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import MaterialQualityFeedback from '@/components/forms/MaterialQualityFeedback/MaterialQualityFeedback'
import {
  useGetCustomerPendingReviewByIdQuery,
  useSubmitCustomerReviewMutation,
} from '@/features/customer/customerReviewApi'
import { mapCustomerPendingReview } from '@/features/customer/customerReviewMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import NotFoundPage from '@/pages/public_page/NotFoundPage'

export default function WriteReviewPage() {
  const { reviewId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCustomerPendingReviewByIdQuery(reviewId ?? '', {
    skip: !reviewId,
  })

  const [submitReview, { isLoading: isSubmitting }] =
    useSubmitCustomerReviewMutation()

  const product = data?.product
    ? mapCustomerPendingReview(data.product)
    : null

  const handleSubmit = useCallback(
    async ({ rating, review }) => {
      if (!reviewId) return

      if (!rating) {
        toast.error(t('productToReview.ratingRequired'))
        return
      }

      const trimmedReview = review.trim()
      if (!trimmedReview) {
        toast.error(t('productToReview.reviewRequired'))
        return
      }

      try {
        const result = await submitReview({
          orderLineItemId: reviewId,
          rating,
          review: trimmedReview,
        }).unwrap()

        if (result?.success === false) {
          toast.error(
            getAuthErrorMessage(result, t('productToReview.submitFailed')),
          )
          return
        }

        toast.success(result?.message || t('productToReview.submitSuccess'))
        navigate('/customer/product-to-review')
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t('productToReview.submitFailed')))
      }
    },
    [reviewId, submitReview, navigate, t],
  )

  if (isLoading && !data) {
    return (
      <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
        {t('productToReview.loading')}
      </p>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
        <p className="text-sm text-red-700">
          {error?.data?.message || t('productToReview.loadFailed')}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
        >
          {t('productToReview.retry')}
        </button>
      </div>
    )
  }

  if (!product) {
    return <NotFoundPage />
  }

  return (
    <MaterialQualityFeedback
      defaultRating={4}
      subtitle={product.title}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  )
}
