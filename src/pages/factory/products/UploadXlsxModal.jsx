import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { FiDownload, FiUploadCloud, FiX } from 'react-icons/fi'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

function isXlsxFile(file) {
  if (!file) return false
  const name = String(file.name || '').toLowerCase()
  return (
    name.endsWith('.xlsx') ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
}

export default function UploadXlsxModal({
  open,
  onClose,
  onDownloadExample,
  onQueueImport,
}) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    setFile(null)
    setError('')
    setDragging(false)

    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const acceptFile = (nextFile) => {
    if (!nextFile) return
    if (!isXlsxFile(nextFile)) {
      setError(t('factoryProducts.uploadModal.hint'))
      setFile(null)
      return
    }
    if (nextFile.size > MAX_UPLOAD_BYTES) {
      setError(t('factoryProducts.uploadModal.hint'))
      setFile(null)
      return
    }
    setError('')
    setFile(nextFile)
  }

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t('factoryProducts.uploadModal.closeOverlay')}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-xlsx-title"
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="upload-xlsx-title"
              className="text-lg font-bold text-[var(--primary-text)]"
            >
              {t('factoryProducts.uploadModal.title')}
            </h2>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {t('factoryProducts.uploadModal.hint')}
            </p>
          </div>
          <button
            type="button"
            aria-label={t('factoryProducts.uploadModal.close')}
            onClick={onClose}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[var(--secondary-text)] hover:bg-gray-200"
          >
            <FiX className="size-4" />
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="sr-only"
          aria-label={t('factoryProducts.uploadModal.browseAria')}
          onChange={(event) => {
            acceptFile(event.target.files?.[0] || null)
            event.target.value = ''
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            acceptFile(event.dataTransfer.files?.[0] || null)
          }}
          className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
            dragging
              ? 'border-[var(--active)] bg-[#FFF8F0]'
              : 'border-gray-200 bg-[#F8FAFC] hover:border-[var(--active)] hover:bg-[#FFFBF5]'
          }`}
        >
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-white text-[var(--active)] shadow-sm ring-1 ring-gray-100">
            <FiUploadCloud className="size-6" aria-hidden />
          </span>
          <p className="mt-4 text-sm font-semibold text-[var(--primary-text)]">
            {t('factoryProducts.uploadModal.dropTitle')}
          </p>
          <p className="mt-1 max-w-sm text-xs text-[var(--secondary-text)]">
            {t('factoryProducts.uploadModal.dropNote')}
          </p>
          {file ? (
            <p className="mt-3 text-xs font-medium text-[var(--active)]">
              {t('factoryProducts.uploadModal.selected', { name: file.name })}
            </p>
          ) : null}
          {error ? (
            <p className="mt-3 text-xs font-medium text-red-600">{error}</p>
          ) : null}
        </button>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onDownloadExample}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[var(--primary-text)] transition hover:bg-gray-50"
          >
            <FiDownload className="size-4" aria-hidden />
            {t('factoryProducts.uploadModal.downloadExample')}
          </button>
          <button
            type="button"
            onClick={() => onQueueImport?.(file)}
            disabled={!file}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--active)] px-5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('factoryProducts.uploadModal.queueImport')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
