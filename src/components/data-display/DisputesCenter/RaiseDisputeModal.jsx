import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiInfo, FiUpload, FiX } from 'react-icons/fi'

const ALLOWED_EVIDENCE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

export default function RaiseDisputeModal({
  open,
  onClose,
  orderOptions = [],
  onSubmit,
  isSubmitting = false,
}) {
  const { t } = useTranslation()
  const titleId = useId()
  const fileInputId = useId()
  const fileInputRef = useRef(null)
  const [orderNumber, setOrderNumber] = useState('')
  const [selectedItemIds, setSelectedItemIds] = useState([])
  const [issueType, setIssueType] = useState('')
  const [description, setDescription] = useState('')
  const [evidence, setEvidence] = useState([])

  const selectedOrder = useMemo(
    () => orderOptions.find((option) => option.value === orderNumber),
    [orderOptions, orderNumber],
  )

  const orderItems = selectedOrder?.items ?? []
  const showItemSelection = orderItems.length > 1

  useEffect(() => {
    if (!open) {
      setOrderNumber('')
      setSelectedItemIds([])
      setIssueType('')
      setDescription('')
      setEvidence([])
    }
  }, [open])

  useEffect(() => {
    setSelectedItemIds([])
  }, [orderNumber])

  if (!open) return null

  const handleFiles = (event) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    const validFiles = files.filter((file) =>
      ALLOWED_EVIDENCE_TYPES.has(file.type),
    )

    if (validFiles.length !== files.length) {
      toast.error(t('disputesCenter.modal.evidenceInvalidType'))
    }

    if (validFiles.length) {
      setEvidence((prev) => [...prev, ...validFiles])
    }

    event.target.value = ''
  }

  const removeEvidence = (index) => {
    setEvidence((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
  }

  const toggleItemId = (itemId) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!evidence.length) {
      toast.error(t('disputesCenter.modal.evidenceRequired'))
      return
    }

    try {
      await onSubmit?.({
        orderNumber,
        itemIds: selectedItemIds,
        issueType: issueType.trim(),
        description: description.trim(),
        evidence,
      })
    } catch {
      // Parent handles error feedback.
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose?.()
    }
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
        onClick={handleClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100 disabled:opacity-50"
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
              value={orderNumber}
              disabled={isSubmitting}
              onChange={(event) => setOrderNumber(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[var(--active)] disabled:opacity-60"
            >
              <option value="">{t('disputesCenter.modal.selectOrderPh')}</option>
              {orderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {showItemSelection ? (
            <fieldset className="block">
              <legend className="text-sm font-medium text-[var(--primary-text)]">
                {t('disputesCenter.modal.selectItems')}
              </legend>
              <p className="mt-1 text-xs text-[var(--secondary-text)]">
                {t('disputesCenter.modal.selectItemsHint')}
              </p>
              <ul className="mt-2 space-y-2">
                {orderItems.map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-[#FAFAFA]">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(item.id)}
                        disabled={isSubmitting}
                        onChange={() => toggleItemId(item.id)}
                        className="size-4 rounded border-gray-300 text-[var(--active)] focus:ring-[var(--active)]"
                      />
                      <img
                        src={item.image}
                        alt=""
                        className="size-10 shrink-0 rounded-md object-cover"
                      />
                      <span className="min-w-0 text-sm text-[var(--primary-text)]">
                        {item.productName}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          ) : null}

          <label className="block text-sm font-medium text-[var(--primary-text)]">
            {t('disputesCenter.modal.issueType')}
            <input
              required
              value={issueType}
              disabled={isSubmitting}
              onChange={(event) => setIssueType(event.target.value)}
              placeholder={t('disputesCenter.modal.issueTypePh')}
              className="mt-1.5 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[var(--active)] disabled:opacity-60"
            />
          </label>

          <label className="block text-sm font-medium text-[var(--primary-text)]">
            {t('disputesCenter.modal.description')}
            <textarea
              required
              rows={4}
              value={description}
              disabled={isSubmitting}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t('disputesCenter.modal.descriptionPh')}
              className="mt-1.5 w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--active)] disabled:opacity-60"
            />
          </label>

          <div>
            <p className="text-sm font-medium text-[var(--primary-text)]">
              {t('disputesCenter.modal.evidence')}
            </p>
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={isSubmitting}
              onChange={handleFiles}
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-[#FAFAFA] px-4 py-8 text-center transition-colors hover:border-[var(--active)] disabled:opacity-60"
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
            {evidence.length ? (
              <ul className="mt-3 space-y-2">
                {evidence.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 truncate text-[var(--primary-text)]">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => removeEvidence(index)}
                      className="shrink-0 text-[var(--secondary-text)] hover:text-red-600 disabled:opacity-50"
                      aria-label={t('disputesCenter.modal.removeEvidence')}
                    >
                      <FiX className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-11 rounded-lg border border-gray-300 px-6 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50 disabled:opacity-60"
            >
              {t('disputesCenter.modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-lg bg-[var(--active)] px-6 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60"
            >
              {isSubmitting
                ? t('disputesCenter.modal.submitting')
                : t('disputesCenter.modal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
