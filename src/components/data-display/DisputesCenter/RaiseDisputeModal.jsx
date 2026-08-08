import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiInfo, FiUpload, FiX } from 'react-icons/fi'

export default function RaiseDisputeModal({
  open,
  onClose,
  orderOptions = [],
  onSubmit,
}) {
  const { t } = useTranslation()
  const titleId = useId()
  const [orderId, setOrderId] = useState('')
  const [issueType, setIssueType] = useState('')
  const [description, setDescription] = useState('')

  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.({ orderId, issueType, description })
    setOrderId('')
    setIssueType('')
    setDescription('')
    onClose?.()
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
        aria-label={t('disputesCenter.modal.close')}
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100"
          aria-label={t('disputesCenter.modal.close')}
        >
          <FiX className="size-5" />
        </button>

        <div className="flex items-start gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--active)_14%,white)] text-[var(--active)]">
            <FiInfo className="size-5" strokeWidth={2} aria-hidden />
          </span>
          <div>
            <h2
              id={titleId}
              className="text-lg font-bold text-[var(--primary-text)]"
            >
              {t('disputesCenter.modal.title')}
            </h2>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {t('disputesCenter.modal.subtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[var(--primary-text)]">
            {t('disputesCenter.modal.selectOrder')}
            <select
              required
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[var(--active)]"
            >
              <option value="">{t('disputesCenter.modal.selectOrderPh')}</option>
              {orderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-[var(--primary-text)]">
            {t('disputesCenter.modal.issueType')}
            <input
              required
              value={issueType}
              onChange={(event) => setIssueType(event.target.value)}
              placeholder={t('disputesCenter.modal.issueTypePh')}
              className="mt-1.5 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[var(--active)]"
            />
          </label>

          <label className="block text-sm font-medium text-[var(--primary-text)]">
            {t('disputesCenter.modal.description')}
            <textarea
              required
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t('disputesCenter.modal.descriptionPh')}
              className="mt-1.5 w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--active)]"
            />
          </label>

          <div>
            <p className="text-sm font-medium text-[var(--primary-text)]">
              {t('disputesCenter.modal.evidence')}
            </p>
            <button
              type="button"
              className="mt-1.5 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-[#FAFAFA] px-4 py-8 text-center transition-colors hover:border-[var(--active)]"
            >
              <FiUpload
                className="size-8 text-[var(--secondary-text)]"
                strokeWidth={1.5}
                aria-hidden
              />
              <span className="mt-2 text-sm font-medium text-[var(--primary-text)]">
                {t('disputesCenter.modal.uploadHint')}
              </span>
              <span className="mt-1 text-xs text-[var(--secondary-text)]">
                {t('disputesCenter.modal.uploadTypes')}
              </span>
            </button>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-gray-300 px-6 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50"
            >
              {t('disputesCenter.modal.cancel')}
            </button>
            <button
              type="submit"
              className="h-11 rounded-lg bg-[var(--active)] px-6 text-sm font-semibold text-white hover:brightness-95"
            >
              {t('disputesCenter.modal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
