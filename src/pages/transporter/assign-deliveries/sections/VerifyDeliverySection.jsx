import { useRef, useState } from 'react'
import { FiCheck, FiUpload } from 'react-icons/fi'

const PROOF_ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'

export default function VerifyDeliverySection({
  delivery,
  onCancel,
  onComplete,
  isSubmitting = false,
}) {
  const fileInputRef = useRef(null)
  const [pin, setPin] = useState(['', '', '', ''])
  const [proofFile, setProofFile] = useState(null)
  const [localError, setLocalError] = useState('')

  const handlePinChange = (value, idx) => {
    if (/^[0-9]?$/.test(value)) {
      const newPin = [...pin]
      newPin[idx] = value
      setPin(newPin)
      setLocalError('')

      if (value && idx < 3) {
        document.getElementById(`pin-${idx + 1}`)?.focus()
      }
    }
  }

  const handlePinKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) {
      document.getElementById(`pin-${idx - 1}`)?.focus()
    }
  }

  const handleVerifyComplete = async () => {
    if (isSubmitting) return
    const otp = pin.join('')
    if (!/^\d{4}$/.test(otp)) {
      setLocalError('Enter the 4-digit customer PIN')
      return
    }
    setLocalError('')
    await onComplete?.({ otp, proofFile })
  }

  return (
    <div className="mx-auto space-y-6 pb-12">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-500">
          <FiCheck className="size-7" strokeWidth={3} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Verify Delivery</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter the customer&apos;s PIN to confirm delivery completion
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-gray-800">Order Summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Order ID</span>
            <span className="text-right font-semibold text-slate-700">
              {delivery.orderId ||
                delivery.orderLabel?.replace(/^Order ID:\s*/i, '') ||
                delivery.auctionId ||
                '—'}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Product</span>
            <span className="text-right font-semibold text-slate-700">
              {delivery.title || '—'}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Quantity</span>
            <span className="text-right font-semibold text-slate-700">
              {delivery.quantity || '—'}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Customer</span>
            <span className="text-right font-semibold text-slate-700">
              {delivery.customerName || '—'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
            <span className="text-slate-400">Earnings</span>
            <span className="text-base font-bold text-amber-500">
              {delivery.price || '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-gray-800">Customer PIN</h2>
        <p className="mt-1 text-xs text-gray-400">
          Ask the customer for their 4-digit delivery PIN
        </p>
        <div className="mt-5 grid grid-cols-4 gap-4">
          {pin.map((val, idx) => (
            <input
              key={idx}
              id={`pin-${idx}`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={val}
              onChange={(e) => handlePinChange(e.target.value, idx)}
              onKeyDown={(e) => handlePinKeyDown(e, idx)}
              className="h-12 w-full rounded-xl border border-gray-200 text-center text-xl font-bold outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          ))}
        </div>
        {localError ? (
          <p className="mt-3 text-sm text-red-600">{localError}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-gray-800">
          Delivery Proof (Optional)
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Upload a photo of the delivered goods or signed document
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={PROOF_ACCEPT}
          className="hidden"
          onChange={(e) => setProofFile(e.target.files?.[0] || null)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-5 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-10 transition-colors hover:border-amber-400"
        >
          <FiUpload className="size-6 text-gray-400" />
          <span className="mt-2 text-xs font-semibold text-gray-500">
            {proofFile ? proofFile.name : 'Click to upload photo'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-sm font-bold text-amber-600 hover:brightness-95 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleVerifyComplete}
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center gap-1.5 rounded-xl bg-[color-mix(in_srgb,var(--active)_85%,black)] text-sm font-bold text-white shadow-sm hover:brightness-95 disabled:opacity-60"
        >
          <FiCheck className="size-4" strokeWidth={3} />
          {isSubmitting ? 'Verifying…' : 'Verify & Complete'}
        </button>
      </div>
    </div>
  )
}
