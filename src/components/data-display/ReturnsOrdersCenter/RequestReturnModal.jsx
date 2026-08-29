import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiUpload, FiX } from 'react-icons/fi'

const ALLOWED_EVIDENCE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

export default function RequestReturnModal({
  open,
  onClose,
  item,
  onSubmit,
  isSubmitting = false,
}) {
  const { t } = useTranslation()
  const titleId = useId()
  const fileInputId = useId()
  const fileInputRef = useRef(null)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [damagedCount, setDamagedCount] = useState('')
  const [refundAccount, setRefundAccount] = useState('')
  const [evidence, setEvidence] = useState([])

  useEffect(() => {
    if (!open) {
      setReason('')
      setDescription('')
      setDamagedCount('')
      setRefundAccount('')
      setEvidence([])
    }
  }, [open, item?.id])

  if (!open || !item) return null

  const handleFiles = (event) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    const validFiles = files.filter((file) =>
      ALLOWED_EVIDENCE_TYPES.has(file.type),
    )

    if (validFiles.length !== files.length) {
      toast.error(t('returnsCenter.modal.evidenceInvalidType'))
    }

    if (validFiles.length) {
      setEvidence((prev) => [...prev, ...validFiles])
    }

    event.target.value = ''
  }

  const removeEvidence = (index) => {
    setEvidence((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await onSubmit?.({
        item,
        reason: reason.trim(),
        description: description.trim(),
        damagedCount: damagedCount.trim(),
        refundAccount: refundAccount.trim(),
        evidence,
      })
    } catch {
      // Parent handles error feedback.
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
        aria-label={t('returnsCenter.modal.close')}
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100"
          aria-label={t('returnsCenter.modal.close')}
        >
          <FiX className="size-5" />
        </button>

        <h2
          id={titleId}
          className="pr-8 text-lg font-bold text-[var(--primary-text)]"
        >
          {t('returnsCenter.modal.title')}
        </h2>

        <div className="mt-4 flex gap-3 rounded-lg border border-gray-100 bg-[#FAFAFA] p-3">
          <img
            src={item.image}
            alt=""
            className="size-14 shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0">
            <p className="font-bold text-[var(--primary-text)]">{item.title}</p>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {t('returnsCenter.modal.productMeta', {
                qty: item.quantity,
                price: item.price,
              })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-[var(--primary-text)]">
            {t('returnsCenter.modal.reason')}
            <input
              required
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={t('returnsCenter.modal.reasonPh')}
              className="mt-1.5 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[var(--active)]"
            />
          </label>

          <label className="block text-sm font-medium text-[var(--primary-text)]">
            {t('returnsCenter.modal.description')}
            <textarea
              required
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t('returnsCenter.modal.descriptionPh')}
              className="mt-1.5 w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--active)]"
            />
          </label>

          <label className="block text-sm font-medium text-[var(--primary-text)]">
            {t('returnsCenter.modal.damagedItem')}
            <input
              required
              inputMode="numeric"
              value={damagedCount}
              onChange={(event) =>
                setDamagedCount(event.target.value.replace(/\D/g, ''))
              }
              placeholder={t('returnsCenter.modal.damagedItemPh')}
              className="mt-1.5 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[var(--active)]"
            />
          </label>

          <label className="block text-sm font-medium text-[var(--primary-text)]">
            {t('returnsCenter.modal.refundAccount')}
            <input
              required
              inputMode="numeric"
              value={refundAccount}
              onChange={(event) =>
                setRefundAccount(event.target.value.replace(/\D/g, ''))
              }
              placeholder={t('returnsCenter.modal.refundAccountPh')}
              className="mt-1.5 h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[var(--active)]"
            />
          </label>

          <div>
            <p className="text-sm font-medium text-[var(--primary-text)]">
              {t('returnsCenter.modal.evidence')}
            </p>
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,image/jpeg,image/png,image/webp,application/pdf"
              className="sr-only"
              onChange={handleFiles}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-[#FAFAFA] px-4 py-8 text-center transition-colors hover:border-[var(--active)]"
            >
              <FiUpload
                className="size-8 text-[var(--secondary-text)]"
                strokeWidth={1.5}
                aria-hidden
              />
              <span className="mt-2 text-sm font-medium text-[var(--primary-text)]">
                {t('returnsCenter.modal.uploadHint')}
              </span>
              <span className="mt-1 text-xs text-[var(--secondary-text)]">
                {t('returnsCenter.modal.uploadTypes')}
              </span>
            </button>
            {evidence.length > 0 ? (
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
                      onClick={() => removeEvidence(index)}
                      className="shrink-0 text-xs font-semibold text-red-600 hover:underline"
                    >
                      {t('returnsCenter.modal.removeFile')}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg bg-[var(--active)] text-sm font-bold tracking-wide text-white uppercase hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t('returnsCenter.modal.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
