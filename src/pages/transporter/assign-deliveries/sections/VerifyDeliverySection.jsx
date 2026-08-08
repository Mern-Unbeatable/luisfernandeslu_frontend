import { useState } from 'react'
import { FiCheck, FiUpload } from 'react-icons/fi'

export default function VerifyDeliverySection({ delivery, onCancel, onComplete }) {
  const [pin, setPin] = useState(['', '', '', ''])

  const handlePinChange = (value, idx) => {
    if (/^[0-9]?$/.test(value)) {
      const newPin = [...pin]
      newPin[idx] = value
      setPin(newPin)

      // Auto-focus next field
      if (value && idx < 3) {
        document.getElementById(`pin-${idx + 1}`)?.focus()
      }
    }
  }

  const handleVerifyComplete = () => {
    onComplete?.(delivery)
  }

  return (
    <div className="mx-auto  space-y-6 pb-12">
      {/* Verification Title Block */}
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-200">
          <FiCheck className="size-7" strokeWidth={3} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Verify Delivery</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter the customer's PIN to confirm delivery completion
        </p>
      </div>

      {/* Order Summary Box */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-gray-800">Order Summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Auction ID:</span>
            <span className="font-semibold text-slate-700">
              {delivery.orderLabel?.replace('Auction ID: ', '') || 'AUC-001'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Product</span>
            <span className="font-semibold text-slate-700">{delivery.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Quantity</span>
            <span className="font-semibold text-slate-700">
              {delivery.title.includes('Cement')
                ? '500 bags (50kg each)'
                : delivery.title.includes('Steel')
                ? '200 rods (12m each)'
                : '10,000 pieces'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Customer</span>
            <span className="font-semibold text-slate-700">{delivery.delivery.title}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="text-slate-400">Earnings</span>
            <span className="text-base font-bold text-amber-500">{delivery.price}</span>
          </div>
        </div>
      </div>

      {/* Customer PIN input */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-gray-800">Customer PIN</h2>
        <p className="mt-1 text-xs text-gray-400">Ask the customer for their 4-digit delivery PIN</p>
        <div className="mt-5 grid grid-cols-4 gap-4">
          {pin.map((val, idx) => (
            <input
              key={idx}
              id={`pin-${idx}`}
              type="text"
              maxLength={1}
              value={val}
              onChange={(e) => handlePinChange(e.target.value, idx)}
              className="w-full h-12 rounded-xl border border-gray-200 text-center text-xl font-bold outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          ))}
        </div>
      </div>

      {/* Delivery Proof */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-gray-800">Delivery Proof (Optional)</h2>
        <p className="mt-1 text-xs text-gray-400">Upload a photo of the delivered goods or signed document</p>
        <div className="mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-10 hover:border-amber-400 cursor-pointer">
          <FiUpload className="size-6 text-gray-400" />
          <span className="mt-2 text-xs font-semibold text-gray-500">Click to upload photo</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-12 items-center justify-center rounded-xl bg-amber-50 text-sm font-bold text-amber-600 border border-amber-100 hover:brightness-95"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleVerifyComplete}
          className="flex h-12 items-center justify-center gap-1.5 rounded-xl bg-[color-mix(in_srgb,var(--active)_85%,black)] text-sm font-bold text-white shadow-sm hover:brightness-95"
        >
          <FiCheck className="size-4" strokeWidth={3} />
          Verify & Complete
        </button>
      </div>
    </div>
  )
}
