import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'

function parseAmount(value) {
  const cleaned = String(value || '').replace(/[^\d.]/g, '')
  return Number(cleaned)
}

export default function WithdrawModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  availableBalance,
}) {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setAmount('')
    setBusinessName('')
    setRoutingNumber('')
    setAccountNumber('')
    setFormError('')
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async () => {
    const numericAmount = parseAmount(amount)

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError(
        t('transporterPaymentsPayouts.withdraw.invalidAmount', {
          defaultValue: 'Enter a valid amount greater than 0',
        }),
      )
      return
    }
    if (String(businessName).trim().length < 2) {
      setFormError(
        t('transporterPaymentsPayouts.withdraw.invalidBusinessName', {
          defaultValue: 'Business name must be at least 2 characters',
        }),
      )
      return
    }
    if (String(routingNumber).trim().length < 3) {
      setFormError(
        t('transporterPaymentsPayouts.withdraw.invalidRouting', {
          defaultValue: 'Routing number must be at least 3 characters',
        }),
      )
      return
    }
    if (String(accountNumber).trim().length < 5) {
      setFormError(
        t('transporterPaymentsPayouts.withdraw.invalidAccount', {
          defaultValue: 'Account number must be at least 5 characters',
        }),
      )
      return
    }
    if (
      Number.isFinite(availableBalance) &&
      numericAmount > Number(availableBalance)
    ) {
      setFormError(
        t('transporterPaymentsPayouts.withdraw.insufficientBalance', {
          defaultValue: 'Amount exceeds available balance',
        }),
      )
      return
    }

    setFormError('')
    await onSubmit?.({
      amount: numericAmount,
      businessName: businessName.trim(),
      routingNumber: routingNumber.trim(),
      accountNumber: accountNumber.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl bg-white p-6 shadow-xl duration-200">
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-xl font-bold text-gray-900">
            {t('transporterPaymentsPayouts.withdraw.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-60"
            aria-label={t('transporterPaymentsPayouts.withdraw.close')}
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterPaymentsPayouts.withdraw.amount')}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterPaymentsPayouts.withdraw.businessName')}
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterPaymentsPayouts.withdraw.routingNumber')}
            </label>
            <input
              type="text"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterPaymentsPayouts.withdraw.accountNumber')}
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {formError ? (
            <p className="text-sm text-red-600">{formError}</p>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-amber-500 px-5 py-2.5 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-50 disabled:opacity-60"
          >
            {t('transporterPaymentsPayouts.withdraw.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-[color-mix(in_srgb,var(--active)_85%,black)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-95 disabled:opacity-60"
          >
            {isSubmitting
              ? t('transporterPaymentsPayouts.withdraw.submitting', {
                  defaultValue: 'Submitting…',
                })
              : t('transporterPaymentsPayouts.withdraw.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
