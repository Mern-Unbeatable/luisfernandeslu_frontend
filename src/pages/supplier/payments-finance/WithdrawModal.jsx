import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'

const inputClass =
  'h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-[var(--primary-text)] outline-none transition focus:border-[var(--active)] focus:ring-1 focus:ring-[var(--active)]'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--primary-text)]">
        {label}
      </span>
      {children}
    </label>
  )
}

export default function WithdrawModal({ open, form, onChange, onClose, onSubmit }) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const setField = (key) => (event) => {
    onChange?.({ ...form, [key]: event.target.value })
  }

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t('supplierPaymentsFinance.withdraw.closeOverlay')}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplier-withdraw-funds-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2
            id="supplier-withdraw-funds-title"
            className="text-lg font-bold text-[var(--primary-text)]"
          >
            {t('supplierPaymentsFinance.withdraw.title')}
          </h2>
          <button
            type="button"
            aria-label={t('supplierPaymentsFinance.withdraw.close')}
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-full bg-gray-100 text-[var(--secondary-text)] hover:bg-gray-200"
          >
            <FiX className="size-4" />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit?.(form)
          }}
          className="space-y-4"
        >
          <Field label={t('supplierPaymentsFinance.withdraw.amount')}>
            <input
              type="text"
              value={form.amount}
              onChange={setField('amount')}
              className={inputClass}
            />
          </Field>
          <Field label={t('supplierPaymentsFinance.withdraw.businessName')}>
            <input
              type="text"
              value={form.businessName}
              onChange={setField('businessName')}
              className={inputClass}
            />
          </Field>
          <Field label={t('supplierPaymentsFinance.withdraw.routingNumber')}>
            <input
              type="text"
              value={form.routingNumber}
              onChange={setField('routingNumber')}
              className={inputClass}
            />
          </Field>
          <Field label={t('supplierPaymentsFinance.withdraw.accountNumber')}>
            <input
              type="text"
              value={form.accountNumber}
              onChange={setField('accountNumber')}
              className={inputClass}
            />
          </Field>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[var(--active)] bg-white text-sm font-semibold text-[var(--active)] transition hover:bg-[#FFFBF5]"
            >
              {t('supplierPaymentsFinance.withdraw.cancel')}
            </button>
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--active)] text-sm font-semibold text-white transition hover:brightness-95"
            >
              {t('supplierPaymentsFinance.withdraw.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
