import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'

const I18N_KEY = 'adminOrders'

export default function AdminOrderCancelModal({
  open,
  orderId,
  orderLabel,
  isSubmitting = false,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation()
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!open) setReason('')
  }, [open, orderId])

  if (!open || !orderId) return null

  const titleId = `${I18N_KEY}-cancel-title`

  const handleSubmit = (event) => {
    event.preventDefault()
    onConfirm?.(reason.trim())
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label={t(`${I18N_KEY}.cancelModal.close`)}
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100"
          aria-label={t(`${I18N_KEY}.cancelModal.close`)}
        >
          <FiX className="size-5" />
        </button>

        <h2 id={titleId} className="pr-8 text-lg font-bold text-[var(--primary-text)]">
          {t(`${I18N_KEY}.cancelModal.title`, { id: orderLabel || orderId })}
        </h2>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.cancelModal.subtitle`)}
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor={`${titleId}-reason`}
              className="text-sm font-semibold text-[var(--primary-text)]"
            >
              {t(`${I18N_KEY}.cancelModal.reasonLabel`)}
            </label>
            <textarea
              id={`${titleId}-reason`}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              placeholder={t(`${I18N_KEY}.cancelModal.reasonPlaceholder`)}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-[var(--primary-text)] hover:bg-gray-50"
            >
              {t(`${I18N_KEY}.cancelModal.close`)}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t(`${I18N_KEY}.cancelModal.submit`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
