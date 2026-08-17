import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX } from 'react-icons/fi'

export default function WithdrawModal({ isOpen, onClose, onSubmit }) {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('€400.00')
  const [businessName, setBusinessName] = useState('Marlin Transport & Logistics')
  const [routingNumber, setRoutingNumber] = useState('021000021')
  const [accountNumber, setAccountNumber] = useState('458721369845')

  if (!isOpen) return null

  const handleSubmit = () => {
    onSubmit?.({ amount, businessName, routingNumber, accountNumber })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            {t('transporterPaymentsPayouts.withdraw.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t('transporterPaymentsPayouts.withdraw.close')}
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterPaymentsPayouts.withdraw.amount')}
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-amber-500 px-5 py-2.5 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors"
          >
            {t('transporterPaymentsPayouts.withdraw.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-[color-mix(in_srgb,var(--active)_85%,black)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-95 transition-all"
          >
            {t('transporterPaymentsPayouts.withdraw.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
