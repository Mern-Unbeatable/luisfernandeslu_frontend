import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiX, FiUploadCloud } from 'react-icons/fi'

const ACCEPTED_TYPES =
  '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,application/pdf,image/jpeg,image/png,image/webp'

export default function UploadInsuranceModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialType = null,
  isRenew = false,
}) {
  const { t } = useTranslation()
  const fileInputRef = useRef(null)
  const [insuranceType, setInsuranceType] = useState('')
  const [provider, setProvider] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [coverageAmount, setCoverageAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [document, setDocument] = useState(null)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setInsuranceType(initialType || '')
    setProvider('')
    setPolicyNumber('')
    setCoverageAmount('')
    setStartDate('')
    setExpiryDate('')
    setDocument(null)
    setFormError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [isOpen, initialType])

  if (!isOpen) return null

  const handleSubmit = async () => {
    const type = insuranceType.trim()
    const providerValue = provider.trim()
    const policyNumberValue = policyNumber.trim()
    const amount = Number(String(coverageAmount).replace(/[^\d.]/g, ''))

    if (!type) {
      setFormError(
        t('transporterInsurance.upload.errors.type', {
          defaultValue: 'Select an insurance type',
        }),
      )
      return
    }
    if (!providerValue) {
      setFormError(
        t('transporterInsurance.upload.errors.provider', {
          defaultValue: 'Enter insurance provider',
        }),
      )
      return
    }
    if (!policyNumberValue) {
      setFormError(
        t('transporterInsurance.upload.errors.policyNumber', {
          defaultValue: 'Enter policy number',
        }),
      )
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError(
        t('transporterInsurance.upload.errors.coverage', {
          defaultValue: 'Enter a valid coverage amount',
        }),
      )
      return
    }
    if (!expiryDate.trim()) {
      setFormError(
        t('transporterInsurance.upload.errors.expiryDate', {
          defaultValue: 'Enter expiry date',
        }),
      )
      return
    }
    if (!isRenew && !document) {
      setFormError(
        t('transporterInsurance.upload.errors.document', {
          defaultValue: 'Upload an insurance document',
        }),
      )
      return
    }

    setFormError('')
    const ok = await onSubmit?.({
      type,
      provider: providerValue,
      policyNumber: policyNumberValue,
      coverageAmount: amount,
      startDate: startDate.trim() || undefined,
      expiryDate: expiryDate.trim(),
      document,
    })
    if (ok) onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="relative my-8 flex w-full max-w-3xl animate-in fade-in zoom-in-95 flex-col overflow-hidden rounded-2xl bg-white shadow-xl duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <FiUploadCloud className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isRenew
                  ? t('transporterInsurance.upload.renewTitle', {
                      defaultValue: 'Renew Insurance Policy',
                    })
                  : t('transporterInsurance.upload.title')}
              </h2>
              <p className="mt-0.5 text-xs text-gray-400">
                {t('transporterInsurance.upload.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-60"
            aria-label={t('transporterInsurance.upload.close')}
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterInsurance.upload.insuranceType')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={insuranceType}
              onChange={(e) => setInsuranceType(e.target.value)}
              disabled={Boolean(initialType)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:bg-gray-50"
            >
              <option value="">
                {t('transporterInsurance.upload.selectType')}
              </option>
              <option value="civil">
                {t('transporterInsurance.upload.civil')}
              </option>
              <option value="cargo">
                {t('transporterInsurance.upload.cargo')}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterInsurance.upload.provider')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={t('transporterInsurance.upload.providerPlaceholder')}
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterInsurance.upload.policyNumber')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={t(
                'transporterInsurance.upload.policyNumberPlaceholder',
              )}
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterInsurance.upload.coverageAmount')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder={t('transporterInsurance.upload.coveragePlaceholder')}
              value={coverageAmount}
              onChange={(e) => setCoverageAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                {t('transporterInsurance.upload.startDate')}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                {t('transporterInsurance.upload.expiryDate')}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              {t('transporterInsurance.upload.document')}{' '}
              {!isRenew ? <span className="text-red-500">*</span> : null}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              className="hidden"
              onChange={(e) => setDocument(e.target.files?.[0] || null)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center transition-colors hover:bg-gray-50"
            >
              <FiUploadCloud className="mb-2 size-8 text-gray-400" />
              <p className="text-sm font-semibold text-gray-700">
                {document
                  ? document.name
                  : t('transporterInsurance.upload.dropTitle')}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {t('transporterInsurance.upload.dropHint')}
              </p>
            </button>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-amber-850">
            <p className="text-xs font-semibold leading-relaxed text-amber-800">
              {t('transporterInsurance.upload.noteLabel')}{' '}
              <span className="font-normal text-amber-700">
                {t('transporterInsurance.upload.noteBody')}
              </span>
            </p>
          </div>

          {formError ? (
            <p className="text-sm text-red-600">{formError}</p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-1/2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
          >
            {t('transporterInsurance.upload.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-1/2 rounded-xl bg-[color-mix(in_srgb,var(--active)_85%,black)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-95 disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting
              ? t('transporterInsurance.upload.submitting', {
                  defaultValue: 'Submitting…',
                })
              : t('transporterInsurance.upload.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
