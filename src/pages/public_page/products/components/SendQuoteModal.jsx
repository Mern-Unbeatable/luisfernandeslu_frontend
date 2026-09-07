import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'

const BUDGET_MAX = 500
const BUDGET_PRESETS = [80, 50, 70, 60]

const fieldClass =
  'h-11 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]'

export default function SendQuoteModal({
  open,
  onClose,
  product = {},
  onSubmit,
  isSubmitting = false,
}) {
  const { t } = useTranslation()
  const titleId = useId()
  const [budget, setBudget] = useState(0)
  const [quantity, setQuantity] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!open) return undefined

    setBudget(0)
    setQuantity('')
    setMessage('')

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.({
      productId: product.id,
      productTitle: product.title,
      budget,
      quantity: quantity || '1',
      message,
    })
    // Note: onClose is called by parent after successful API call
  }

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label={t('sendQuoteModal.close')}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2
            id={titleId}
            className="text-base font-bold text-[var(--primary-text)]"
          >
            {t('sendQuoteModal.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('sendQuoteModal.close')}
            className="inline-flex size-9 items-center justify-center rounded-md text-[var(--secondary-text)] hover:bg-gray-100"
          >
            <FiX className="size-5" aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5">
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--primary-text)]">
                {t('sendQuoteModal.budget')}
              </p>
              <p className="mt-2 text-2xl font-bold text-[var(--primary-text)]">
                {budget.toFixed(2)}
              </p>
              <div className="mt-4 px-1">
                <div className="relative h-6">
                  <div className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 bg-gray-200" />
                  <input
                    type="range"
                    min={0}
                    max={BUDGET_MAX}
                    step={1}
                    value={budget}
                    onChange={(event) =>
                      setBudget(Number(event.target.value))
                    }
                    className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent accent-[var(--active)] [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--active)] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--active)]"
                    aria-label={t('sendQuoteModal.budget')}
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {BUDGET_PRESETS.map((preset) => {
                  const selected = budget === preset
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBudget(preset)}
                      className={[
                        'rounded-lg border px-2 py-2 text-sm font-medium transition-colors',
                        selected
                          ? 'border-[var(--active)] text-[var(--active)]'
                          : 'border-gray-200 text-[var(--primary-text)] hover:border-gray-300',
                      ].join(' ')}
                    >
                      ${preset}
                    </button>
                  )
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--primary-text)]">
                {t('sendQuoteModal.quantity')}
              </span>
              <input
                type="text"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder={t('sendQuoteModal.quantityPlaceholder')}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--primary-text)]">
                {t('sendQuoteModal.message')}
              </span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                className={`${fieldClass} h-auto min-h-[100px] resize-y py-2.5`}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[var(--active)] text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : t('sendQuoteModal.submit')}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  )
}
