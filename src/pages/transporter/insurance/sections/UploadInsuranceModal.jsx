import { useState } from 'react'
import { FiX, FiUploadCloud } from 'react-icons/fi'

export default function UploadInsuranceModal({ isOpen, onClose, onSubmit }) {
  const [insuranceType, setInsuranceType] = useState('')
  const [provider, setProvider] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [coverageAmount, setCoverageAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    onSubmit?.({
      insuranceType,
      provider,
      policyNumber,
      coverageAmount,
      startDate,
      expiryDate,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl relative my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <FiUploadCloud className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Upload Insurance Document</h2>
              <p className="text-xs text-gray-400 mt-0.5">Add new insurance policy</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-6 py-5">
          {/* Insurance Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Insurance Type <span className="text-red-500">*</span>
            </label>
            <select
              value={insuranceType}
              onChange={(e) => setInsuranceType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-gray-500"
            >
              <option value="">Select Insurance type..</option>
              <option value="civil">Civil Liability Insurance</option>
              <option value="cargo">Cargo Liability Insurance</option>
            </select>
          </div>

          {/* Insurance Provider */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Insurance Provider <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter insurance company name"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Policy Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Policy Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter policy number"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Coverage Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Coverage Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter coverage amount"
              value={coverageAmount}
              onChange={(e) => setCoverageAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Start and Expiry Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="MM/DD/YY"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="MM/DD/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Upload Drag and Drop box */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Upload Insurance Document <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <FiUploadCloud className="size-8 text-gray-400 mb-2" />
              <p className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 10MB)</p>
            </div>
          </div>

          {/* Note Box */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-amber-850">
            <p className="text-xs font-semibold leading-relaxed text-amber-800">
              Note:{' '}
              <span className="font-normal text-amber-700">
                Your document will be reviewed by our team within 24-48 hours. You'll be notified
                once verification is complete.
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors w-1/2 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-[color-mix(in_srgb,var(--active)_85%,black)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-95 transition-all w-1/2 sm:w-auto"
          >
            Submit for Verification
          </button>
        </div>
      </div>
    </div>
  )
}
