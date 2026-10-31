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
  const [iban, setIban] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setAmount('')
    setBusinessName('')
    setIban('')
    setFormError('')
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async () => {
    const numericAmount = parseAmount(amount)

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError(
        t('transporterPaymentsPayouts.withdraw.invalidAmount', {
          defaultValue: 'Introduza um montante válido maior que 0',
        }),
      )
      return
    }

    const cleanIban = String(iban || '').replace(/\s+/g, '').toUpperCase()
    if (cleanIban.length < 15) {
      setFormError(
        t('transporterPaymentsPayouts.withdraw.invalidIban', {
          defaultValue: 'Introduza um IBAN válido (ex.: PT50...)',
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
          defaultValue: 'O montante excede o saldo disponível',
        }),
      )
      return
    }

    setFormError('')
    const ok = await onSubmit?.({
      amount: numericAmount,
      businessName: businessName.trim() || undefined,
      iban: cleanIban,
      accountNumber: cleanIban,
      routingNumber: 'N/A',
    })
    if (ok) {
      onClose?.()
    }
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
              {t('transporterPaymentsPayouts.withdraw.amount')} (€)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterPaymentsPayouts.withdraw.businessName')} ({t('common.optional', { defaultValue: 'Opcional' })})
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t('transporterPaymentsPayouts.withdraw.businessNamePlaceholder', {
                defaultValue: 'Nome da empresa ou titular da conta',
              })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterPaymentsPayouts.withdraw.iban', { defaultValue: 'IBAN' })}
            </label>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value.toUpperCase())}
              placeholder={t('transporterPaymentsPayouts.withdraw.ibanPlaceholder', {
                defaultValue: 'PT50 0000 0000 0000 0000 0000 0',
              })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-mono tracking-wider outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 uppercase"
            />
            <p className="mt-1 text-xs text-gray-500">
              {t('transporterPaymentsPayouts.withdraw.ibanHelp', {
                defaultValue: 'Indique o IBAN da sua conta bancária (ex.: PT50...).',
              })}
            </p>
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
                  defaultValue: 'A enviar…',
                })
              : t('transporterPaymentsPayouts.withdraw.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
