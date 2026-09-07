import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiX } from 'react-icons/fi'
import { useCancelCustomerOrderMutation } from '@/features/customer/customerOrderApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

const fieldClass =
  'min-h-[120px] w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]'

export default function CancelReasonModal({
  open,
  onClose,
  order,
  onCancelled,
}) {
  const { t } = useTranslation()
  const titleId = useId()
  const [reason, setReason] = useState('')
  const [cancelOrder, { isLoading: isSubmitting }] =
    useCancelCustomerOrderMutation()

  useEffect(() => {
    if (!open) return undefined
    setReason('')
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedReason = reason.trim()
    if (!trimmedReason) {
      toast.error(t('cancelReasonModal.reasonRequired'))
      return
    }

    if (!order?.id) return

    try {
      const result = await cancelOrder({
        orderId: order.id,
        reason: trimmedReason,
      }).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t('buyerOrders.cancelFailed')))
        return
      }

      toast.success(result?.message || t('buyerOrders.cancelSuccess'))
      onCancelled?.()
      onClose?.()
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t('buyerOrders.cancelFailed')))
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label={t('cancelReasonModal.close')}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2
            id={titleId}
            className="text-base font-bold text-[var(--primary-text)]"
          >
            {t('cancelReasonModal.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('cancelReasonModal.close')}
            className="inline-flex size-9 items-center justify-center rounded-md text-[var(--secondary-text)] hover:bg-gray-100"
          >
            <FiX className="size-5" aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--primary-text)]">
              {t('cancelReasonModal.label')}
            </span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={5}
              className={fieldClass}
              placeholder={t('cancelReasonModal.placeholder')}
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[var(--active)] text-sm font-bold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t('cancelReasonModal.submit')}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  )
}
