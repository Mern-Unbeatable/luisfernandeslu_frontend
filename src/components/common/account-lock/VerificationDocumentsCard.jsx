import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiEye,
  FiFileText,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import {
  DOCUMENT_FIELD_META,
  DOCUMENTS_SECTION_ID,
  ROLE_DEFAULT_DOCUMENTS,
  getDocumentLabel,
  getUploadFieldName,
  parseRejectionReason,
} from './documentFields'
import useSubmitVerificationDocuments from './useSubmitVerificationDocuments'

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,application/pdf'
const MAX_FILES_PER_DOCUMENT = 5

const STATUS_STYLES = {
  UNVERIFIED: { icon: FiAlertTriangle, badge: 'bg-amber-100 text-amber-800' },
  PENDING_REVIEW: { icon: FiClock, badge: 'bg-sky-100 text-sky-800' },
  APPROVED: { icon: FiCheckCircle, badge: 'bg-emerald-100 text-emerald-800' },
  REJECTED: { icon: FiAlertTriangle, badge: 'bg-red-100 text-red-700' },
}

function isPdfUrl(url) {
  return /\.pdf($|[?#])/i.test(String(url || ''))
}

function DocumentPreviewModal({ url, title, onClose }) {
  const { t } = useTranslation()

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t('verificationDocuments.close')}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-3">
          <h3 className="truncate text-sm font-semibold text-[var(--primary-text)]">{title}</h3>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[var(--primary-text)] hover:bg-gray-50"
            >
              <FiExternalLink className="size-3.5" aria-hidden />
              {t('verificationDocuments.openNewTab')}
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('verificationDocuments.close')}
              className="rounded-md p-1.5 text-[var(--secondary-text)] hover:bg-gray-100"
            >
              <FiX className="size-5" aria-hidden />
            </button>
          </div>
        </div>
        <div className="flex min-h-[50vh] flex-1 items-center justify-center overflow-auto bg-gray-50 p-4">
          {isPdfUrl(url) ? (
            <iframe title={title} src={url} className="h-[75vh] w-full rounded-lg bg-white" />
          ) : (
            <img src={url} alt={title} className="max-h-[75vh] max-w-full rounded-lg object-contain" />
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function DocumentRow({ fieldKey, urls, stagedFiles, invalid, onStage, onClear, onPreview }) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const meta = DOCUMENT_FIELD_META[fieldKey] || {}
  const label = t(`accountLock.documents.${fieldKey}.label`, {
    defaultValue: getDocumentLabel(fieldKey),
  })
  const hasUploaded = urls.length > 0
  const hasStaged = stagedFiles.length > 0

  let state = { text: t('verificationDocuments.missing'), className: 'bg-gray-100 text-gray-700' }
  if (hasStaged) {
    state = { text: t('verificationDocuments.readyToSubmit'), className: 'bg-amber-100 text-amber-800' }
  } else if (invalid) {
    state = { text: t('verificationDocuments.needsUpload'), className: 'bg-red-100 text-red-700' }
  } else if (hasUploaded) {
    state = { text: t('verificationDocuments.uploaded'), className: 'bg-emerald-100 text-emerald-800' }
  }

  return (
    <li
      className={`rounded-xl border p-4 ${invalid && !hasStaged ? 'border-red-200 bg-red-50/40' : 'border-gray-200 bg-white'}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF4E5] text-[var(--active)]">
            <FiFileText className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-[var(--primary-text)]">{label}</h3>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${state.className}`}>
                {state.text}
              </span>
            </div>
            {meta.description ? (
              <p className="mt-1 text-xs text-[var(--secondary-text)]">
                {t(`accountLock.documents.${fieldKey}.description`, {
                  defaultValue: meta.description,
                })}
              </p>
            ) : null}
            {hasStaged ? (
              <p className="mt-2 break-all text-xs font-medium text-[var(--active)]">
                {stagedFiles.map((file) => file.name).join(', ')}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {urls.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() =>
                onPreview({
                  url,
                  title: urls.length > 1 ? `${label} (${index + 1})` : label,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[var(--primary-text)] hover:bg-gray-50"
            >
              <FiEye className="size-3.5" aria-hidden />
              {urls.length > 1
                ? t('verificationDocuments.previewN', { n: index + 1 })
                : t('verificationDocuments.preview')}
            </button>
          ))}
          {hasStaged ? (
            <button
              type="button"
              onClick={() => onClear(fieldKey)}
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-[var(--secondary-text)] hover:bg-gray-100"
            >
              {t('verificationDocuments.removeFile')}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--active)] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-95"
          >
            <FiUploadCloud className="size-3.5" aria-hidden />
            {hasUploaded || hasStaged
              ? t('verificationDocuments.replace')
              : t('verificationDocuments.upload')}
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files || []).slice(0, MAX_FILES_PER_DOCUMENT)
              if (files.length) onStage(fieldKey, files)
              event.target.value = ''
            }}
          />
        </div>
      </div>
    </li>
  )
}

/**
 * Profile section listing the account's verification documents with preview,
 * upload and replace. Replacing documents sends the account back to admin review.
 */
export default function VerificationDocumentsCard({
  role,
  documents = [],
  verificationStatus = 'UNVERIFIED',
  rejectionReason,
}) {
  const { t } = useTranslation()
  const location = useLocation()
  const sectionRef = useRef(null)
  const { submit, isLoading } = useSubmitVerificationDocuments(role)
  const [staged, setStaged] = useState({})
  const [preview, setPreview] = useState(null)
  const [confirming, setConfirming] = useState(false)

  const { reason, invalidDocuments } = useMemo(
    () => parseRejectionReason(verificationStatus === 'REJECTED' ? rejectionReason : ''),
    [rejectionReason, verificationStatus],
  )

  const rows = useMemo(() => {
    const byKey = new Map(documents.map((doc) => [doc.key, doc.urls || []]))
    const keys = documents.length ? documents.map((doc) => doc.key) : ROLE_DEFAULT_DOCUMENTS[role] || []
    return keys.map((key) => ({ key, urls: byKey.get(key) || [] }))
  }, [documents, role])

  useEffect(() => {
    if (location.hash === `#${DOCUMENTS_SECTION_ID}`) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  const stagedKeys = Object.keys(staged).filter((key) => staged[key]?.length)
  const status = STATUS_STYLES[verificationStatus] ? verificationStatus : 'UNVERIFIED'
  const StatusIcon = STATUS_STYLES[status].icon
  const isApproved = status === 'APPROVED'

  const stageFiles = (key, files) => setStaged((current) => ({ ...current, [key]: files }))
  const clearFiles = (key) =>
    setStaged((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })

  const validate = () => {
    if (!stagedKeys.length) {
      toast.error(t('verificationDocuments.noChanges'))
      return false
    }
    const missing = rows.filter((row) => !row.urls.length && !staged[row.key]?.length)
    if (missing.length) {
      toast.error(t('verificationDocuments.allRequired'))
      return false
    }
    const unresolved = invalidDocuments.filter((key) => !staged[key]?.length)
    if (unresolved.length) {
      toast.error(t('verificationDocuments.invalidRequired'))
      return false
    }
    return true
  }

  const sendDocuments = async () => {
    const formData = new FormData()
    for (const key of stagedKeys) {
      for (const file of staged[key]) formData.append(getUploadFieldName(key), file)
    }
    try {
      await submit(formData)
      setStaged({})
      setConfirming(false)
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t('accountLock.submitFailed', 'Failed to submit documents')))
    }
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (isApproved) {
      setConfirming(true)
      return
    }
    sendDocuments()
  }

  return (
    <section
      id={DOCUMENTS_SECTION_ID}
      ref={sectionRef}
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--primary-text)]">
            {t('verificationDocuments.title')}
          </h2>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t(`verificationDocuments.hint.${status}`)}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status].badge}`}
        >
          <StatusIcon className="size-3.5" aria-hidden />
          {t(`verificationDocuments.status.${status}`)}
        </span>
      </div>

      {status === 'REJECTED' && reason ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="font-semibold">{t('common.rejectionReason', 'Reason')}:</span> {reason}
        </p>
      ) : null}

      <ul className="mt-5 space-y-3">
        {rows.map((row) => (
          <DocumentRow
            key={row.key}
            fieldKey={row.key}
            urls={row.urls}
            stagedFiles={staged[row.key] || []}
            invalid={invalidDocuments.includes(row.key)}
            onStage={stageFiles}
            onClear={clearFiles}
            onPreview={setPreview}
          />
        ))}
      </ul>

      <p className="mt-4 text-xs text-[var(--secondary-text)]">
        {t('verificationDocuments.fileHint')}
      </p>

      {stagedKeys.length ? (
        <div className="mt-5 space-y-3">
          {isApproved ? (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <FiAlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p>
                {t(
                  role === 'transporter'
                    ? 'verificationDocuments.approvedWarningTransporter'
                    : 'verificationDocuments.approvedWarning',
                )}
              </p>
            </div>
          ) : null}

          {confirming ? (
            <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-[var(--primary-text)]">
                {t('verificationDocuments.confirmReplace')}
              </p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={isLoading}
                  className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50"
                >
                  {t('panel.profile.cancel')}
                </button>
                <button
                  type="button"
                  onClick={sendDocuments}
                  disabled={isLoading}
                  className="rounded-md bg-[var(--active)] px-4 py-2 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60"
                >
                  {isLoading ? t('accountLock.submitting', 'Submitting…') : t('verificationDocuments.confirm')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStaged({})}
                disabled={isLoading}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50"
              >
                {t('panel.profile.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="rounded-md bg-[var(--active)] px-4 py-2 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-60"
              >
                {isLoading ? t('accountLock.submitting', 'Submitting…') : t('verificationDocuments.submit')}
              </button>
            </div>
          )}
        </div>
      ) : null}

      {preview ? (
        <DocumentPreviewModal
          url={preview.url}
          title={preview.title}
          onClose={() => setPreview(null)}
        />
      ) : null}
    </section>
  )
}
