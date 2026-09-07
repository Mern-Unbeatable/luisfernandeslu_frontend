import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaCheckCircle } from 'react-icons/fa'

export default function PaymentMethodSelector({ value, onChange, mbwayPhone, onMbwayPhoneChange }) {
  const { t } = useTranslation()

  const methods = [
    {
      id: 'MULTIBANCO',
      title: 'Multibanco',
      description: 'Pay via ATM or Home Banking',
      icon: '🏧'
    },
    {
      id: 'MBWAY',
      title: 'MB WAY',
      description: 'Pay directly from your phone',
      icon: '📱'
    },
    {
      id: 'CREDITCARD',
      title: 'Credit Card',
      description: 'Visa, Mastercard',
      icon: '💳'
    },
    {
      id: 'PAYSHOP',
      title: 'Payshop',
      description: 'Pay at any Payshop agent',
      icon: '🏪'
    }
  ]

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6 lg:p-8 mt-6">
      <h2 className="mb-4 text-xl font-bold text-[var(--primary-text)]">
        Payment Method
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {methods.map((method) => {
          const isSelected = value === method.id
          return (
            <div
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                isSelected
                  ? 'border-[var(--active)] ring-1 ring-[var(--active)] bg-[#F0FAF5]'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-1">
                <div className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-900 flex items-center gap-2">
                    <span className="text-xl">{method.icon}</span>
                    {method.title}
                  </span>
                  <span className="mt-1 flex items-center text-sm text-gray-500">
                    {method.description}
                  </span>
                </div>
              </div>
              {isSelected && (
                <FaCheckCircle
                  className="h-5 w-5 text-[var(--active)]"
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>

      {value === 'MBWAY' && (
        <div className="mt-4 p-4 rounded bg-gray-50 border border-gray-200 animate-fade-in-down">
          <label htmlFor="mbwayPhone" className="block text-sm font-medium text-gray-700">
            MB WAY Phone Number <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">Enter the mobile number associated with your MB WAY account.</p>
          <input
            type="tel"
            id="mbwayPhone"
            value={mbwayPhone}
            onChange={(e) => onMbwayPhoneChange(e.target.value)}
            placeholder="e.g. 912345678"
            className="block w-full max-w-sm rounded-md border-gray-300 shadow-sm focus:border-[var(--active)] focus:ring-[var(--active)] sm:text-sm p-2 border"
            required
          />
        </div>
      )}
    </div>
  )
}
