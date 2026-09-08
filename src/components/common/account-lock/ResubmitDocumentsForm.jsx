import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiFileText, FiUploadCloud } from 'react-icons/fi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import {
  DOCUMENT_FIELD_META,
  getDocumentLabel,
  getUploadFieldName,
  resolveDocumentsToUpload,
} from './documentFields'

function DocumentDropzone({ fieldKey, files, onChange }) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const meta = DOCUMENT_FIELD_META[fieldKey] || {}
  const label = getDocumentLabel(fieldKey)

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[var(--primary-text)]">{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex min-h-[160px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#F0C48A] bg-[#FFF4E5] px-4 py-8 text-center transition-colors hover:bg-[#FFEFDA]"
      >
        <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#FFE0B8] text-[var(--active)]">
          <FiUploadCloud className="size-6" aria-hidden />
        </span>
        <span className="text-sm font-semibold text-[var(--primary-text)]">
          {t('accountLock.clickToUpload', 'Click to upload images')}
        </span>
        <span className="mt-1 text-xs text-[var(--secondary-text)]">
          {t('accountLock.uploadHint', 'Upload images (JPG, PNG, PDF, WEBP)')}
        </span>
        {files.length > 0 ? (
          <span className="mt-3 text-xs font-medium text-[var(--active)]">
            {files.map((f) => f.name).join(', ')}
          </span>
        ) : null}
      </button>
      {meta.description ? (
        <p className="mt-2 text-xs text-[var(--secondary-text)]">{meta.description}</p>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="sr-only"
        onChange={(e) => {
          const next = Array.from(e.target.files || []).slice(0, 5)
          onChange(fieldKey, next)
          e.target.value = ''
        }}
      />
    </div>
  )
}

function InsuranceCard({ fieldKey, files, onChange }) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const meta = DOCUMENT_FIELD_META[fieldKey] || {}

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-700">
          <FiFileText className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[var(--primary-text)]">
            {getDocumentLabel(fieldKey)}
          </h3>
          {meta.description ? (
            <p className="mt-1 text-xs text-[var(--secondary-text)]">{meta.description}</p>
          ) : null}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[var(--active)] px-3 py-2 text-xs font-bold text-white uppercase hover:brightness-95"
          >
            <FiUploadCloud className="size-3.5" aria-hidden />
            {t('accountLock.uploadInsurance', 'Upload Insurance')}
          </button>
          {files.length > 0 ? (
            <p className="mt-2 text-xs font-medium text-[var(--active)]">
              {files.map((f) => f.name).join(', ')}
            </p>
          ) : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="sr-only"
        onChange={(e) => {
          const next = Array.from(e.target.files || []).slice(0, 5)
          onChange(fieldKey, next)
          e.target.value = ''
        }}
      />
    </div>
  )
}

export default function ResubmitDocumentsForm({
  role,
  invalidDocuments = [],
  onSubmit,
  isSubmitting = false,
  onBack,
}) {
  const { t } = useTranslation()
  const fields = useMemo(
    () => resolveDocumentsToUpload(role, invalidDocuments),
    [role, invalidDocuments],
  )
  const [filesByKey, setFilesByKey] = useState({})

  const insuranceOnly =
    fields.length > 0 && fields.every((key) => DOCUMENT_FIELD_META[key]?.insurance)

  const setFiles = (key, files) => {
    setFilesByKey((prev) => ({ ...prev, [key]: files }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const missing = fields.filter((key) => !filesByKey[key]?.length)
    if (missing.length > 0) {
      toast.error(
        t('accountLock.allDocumentsRequired', 'Please upload all required documents.'),
      )
      return
    }

    const formData = new FormData()
    for (const key of fields) {
      const uploadKey = getUploadFieldName(key)
      for (const file of filesByKey[key] || []) {
        formData.append(uploadKey, file)
      }
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      toast.error(
        getAuthErrorMessage(
          err,
          t('accountLock.submitFailed', 'Failed to submit documents'),
        ),
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
            {t(
              'accountLock.uploadTitle',
              'Please upload your documents for verification',
            )}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t('accountLock.uploadSubtitle', 'Get the full access.')}
          </p>
        </div>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-[var(--secondary-text)] hover:text-[var(--primary-text)]"
          >
            {t('common.back', 'Back')}
          </button>
        ) : null}
      </div>

      {insuranceOnly ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t('accountLock.requiredInsurance', 'Required Insurance Types')}
          </h2>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t(
              'accountLock.requiredInsuranceHint',
              'Both insurance types are mandatory before accepting delivery jobs.',
            )}
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((key) => (
              <InsuranceCard
                key={key}
                fieldKey={key}
                files={filesByKey[key] || []}
                onChange={setFiles}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {fields.map((key) =>
            DOCUMENT_FIELD_META[key]?.insurance ? (
              <InsuranceCard
                key={key}
                fieldKey={key}
                files={filesByKey[key] || []}
                onChange={setFiles}
              />
            ) : (
              <DocumentDropzone
                key={key}
                fieldKey={key}
                files={filesByKey[key] || []}
                onChange={setFiles}
              />
            ),
          )}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[180px] rounded-lg bg-[var(--active)] px-8 py-3 text-sm font-bold tracking-wide text-white uppercase hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? t('accountLock.submitting', 'Submitting…')
            : t('accountLock.submit', 'SUBMIT')}
        </button>
      </div>
    </form>
  )
}
