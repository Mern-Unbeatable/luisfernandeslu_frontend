import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiStar } from 'react-icons/fi'

function StarRatingInput({ value = 0, onChange, max = 5, className = '' }) {
  const [hover, setHover] = useState(0)
  const display = hover || value

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="group"
      aria-label="Rating"
    >
      {Array.from({ length: max }, (_, index) => {
        const star = index + 1
        const filled = star <= display
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="inline-flex p-0.5 text-amber-400 transition-transform hover:scale-105"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <FiStar
              className={`size-8 sm:size-9 ${filled ? 'fill-amber-400 stroke-amber-400' : 'fill-transparent stroke-gray-300'}`}
              strokeWidth={1.5}
            />
          </button>
        )
      })}
    </div>
  )
}

/**
 * Material quality feedback form (mint panel + stars + review + submit).
 */
export default function MaterialQualityFeedback({
  title,
  subtitle,
  rating: ratingProp,
  defaultRating = 0,
  onRatingChange,
  review: reviewProp,
  defaultReview = '',
  onReviewChange,
  onSubmit,
  className = '',
}) {
  const { t } = useTranslation()
  const [ratingInternal, setRatingInternal] = useState(defaultRating)
  const [reviewInternal, setReviewInternal] = useState(defaultReview)

  const rating = ratingProp ?? ratingInternal
  const review = reviewProp ?? reviewInternal

  const setRating = (next) => {
    onRatingChange?.(next)
    if (ratingProp === undefined) setRatingInternal(next)
  }

  const setReview = (next) => {
    onReviewChange?.(next)
    if (reviewProp === undefined) setReviewInternal(next)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.({ rating, review: review.trim() })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-auto w-full max-w-3xl rounded-2xl bg-[#E8F5F1] px-6 py-8 sm:px-10 sm:py-10 ${className}`}
    >
      <div className="text-center">
        <h1 className="text-xl font-bold text-[var(--primary-text)] sm:text-2xl">
          {title ?? t('materialQualityFeedback.title')}
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[var(--secondary-text)] sm:text-base">
          {subtitle ?? t('materialQualityFeedback.subtitle')}
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <p className="text-sm font-semibold text-[var(--primary-text)]">
            {t('materialQualityFeedback.rateLabel')}
          </p>
          <div className="mt-3 flex justify-center sm:justify-start">
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-[var(--primary-text)]">
            {t('materialQualityFeedback.reviewLabel')}
          </span>
          <textarea
            value={review}
            onChange={(event) => setReview(event.target.value)}
            rows={6}
            placeholder={t('materialQualityFeedback.reviewPlaceholder')}
            className="mt-3 w-full resize-y rounded-xl border border-transparent bg-white px-4 py-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]"
          />
        </label>

        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--active)] text-base font-bold text-white transition-opacity hover:opacity-95"
        >
          {t('materialQualityFeedback.submit')}
        </button>
      </div>
    </form>
  )
}
