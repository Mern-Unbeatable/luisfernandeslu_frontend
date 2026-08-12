import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { FiDownload, FiFileText, FiUploadCloud, FiX } from 'react-icons/fi'
import {
  CSV_ALL_COLUMNS,
  CSV_REQUIRED_COLUMNS,
  csvRowsToCatalogItems,
  downloadDemoCsv,
  isCsvFile,
  parseCsvText,
  validateCsv,
} from './csvUpload'

export default function UploadCsvModal({
  open,
  onClose,
  onImported,
  uploadCsv,
}) {
  const { t } = useTranslation()
  const titleId = useId()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!open) return undefined

    setFile(null)
    setErrors([])
    setSuccess('')
    setUploading(false)
    setProgress(0)
    setDragging(false)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape' && !uploading) onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, uploading])

  if (!open) return null

  const formatError = (error) => {
    if (error.columns?.length) {
      return t(`panel.supplierProducts.csv.${error.messageKey}`, {
        columns: error.columns.join(', '),
      })
    }
    if (error.rowNumber) {
      return t(`panel.supplierProducts.csv.${error.messageKey}`, {
        row: error.rowNumber,
        column: error.column,
      })
    }
    return t(`panel.supplierProducts.csv.${error.messageKey}`)
  }

  const takeFile = (nextFile) => {
    setSuccess('')
    setErrors([])
    setProgress(0)

    if (!nextFile) {
      setFile(null)
      return
    }

    if (!isCsvFile(nextFile)) {
      setFile(null)
      setErrors([{ type: 'format', messageKey: 'invalidFormat' }])
      return
    }

    setFile(nextFile)
  }

  const handleSubmit = async () => {
    setSuccess('')
    setErrors([])

    if (!file) {
      setErrors([{ type: 'file', messageKey: 'fileRequired' }])
      return
    }

    if (!isCsvFile(file)) {
      setErrors([{ type: 'format', messageKey: 'invalidFormat' }])
      return
    }

    setUploading(true)
    setProgress(15)

    try {
      const text = await file.text()
      setProgress(35)
      const parsed = parseCsvText(text)
      const result = validateCsv(parsed)

      if (!result.ok) {
        setErrors(result.errors)
        setUploading(false)
        setProgress(0)
        return
      }

      setProgress(60)
      const catalogItems = csvRowsToCatalogItems(result.rows)

      if (typeof uploadCsv === 'function') {
        try {
          await Promise.race([
            uploadCsv(file).unwrap(),
            new Promise((_, reject) => {
              setTimeout(() => reject(new Error('timeout')), 4000)
            }),
          ])
        } catch {
          // Keep locally imported rows when the CSV API is unavailable.
        }
      }

      setProgress(100)
      setSuccess(
        t('panel.supplierProducts.csv.success', { count: catalogItems.length }),
      )
      onImported?.(catalogItems)
    } catch {
      setErrors([{ type: 'upload', messageKey: 'uploadFailed' }])
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t('panel.supplierProducts.csv.closeOverlay')}
        className="absolute inset-0 bg-black/45"
        onClick={() => {
          if (!uploading) onClose?.()
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2
              id={titleId}
              className="text-lg font-bold text-[var(--primary-text)]"
            >
              {t('panel.supplierProducts.csv.title')}
            </h2>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {t('panel.supplierProducts.csv.subtitle')}
            </p>
          </div>
          <button
            type="button"
            aria-label={t('panel.supplierProducts.csv.close')}
            onClick={onClose}
            disabled={uploading}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[var(--secondary-text)] hover:bg-gray-200 disabled:opacity-50"
          >
            <FiX className="size-4" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div
            className={`rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
              dragging
                ? 'border-[var(--active)] bg-[color-mix(in_srgb,var(--active)_6%,white)]'
                : 'border-gray-200 bg-gray-50'
            }`}
            onDragEnter={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              takeFile(event.dataTransfer.files?.[0])
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => {
                takeFile(event.target.files?.[0])
                event.target.value = ''
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex w-full flex-col items-center gap-2 text-center"
            >
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-white text-[var(--active)] shadow-sm">
                <FiUploadCloud className="size-7" />
              </span>
              <p className="text-sm font-semibold text-[var(--primary-text)]">
                {t('panel.supplierProducts.csv.dropTitle')}
              </p>
              <p className="text-xs text-[var(--secondary-text)]">
                {t('panel.supplierProducts.csv.dropHint')}
              </p>
            </button>
            {file ? (
              <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[var(--primary-text)]">
                <FiFileText className="size-4 text-[var(--active)]" />
                {file.name}
              </p>
            ) : null}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--primary-text)]">
              {t('panel.supplierProducts.csv.requiredTitle')}
            </h3>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {t('panel.supplierProducts.csv.requiredBody')}
            </p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-[var(--primary-text)]">
              {CSV_REQUIRED_COLUMNS.join(', ')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--primary-text)]">
              {t('panel.supplierProducts.csv.exampleTitle')}
            </h3>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-50 p-3 text-[11px] leading-5 text-[var(--primary-text)]">
              {`${CSV_ALL_COLUMNS.join(',')}\nPortland Cement Quick Set,wh-santa-ana,cement-mortar-concrete,cements,ordinary-portland-cement-cem-i,800 Bags,120.00,SKU-CEM-001,High-strength cement,20%,10 pcs,900 kg,High Strength,Extra info,CEM I 52.5R,regular`}
            </pre>
          </div>

          <button
            type="button"
            onClick={downloadDemoCsv}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--active)] bg-white px-4 py-2 text-sm font-semibold text-[var(--active)] hover:bg-[color-mix(in_srgb,var(--active)_8%,white)]"
          >
            <FiDownload className="size-4" />
            {t('panel.supplierProducts.csv.downloadDemo')}
          </button>

          {uploading || progress > 0 ? (
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-[var(--secondary-text)]">
                <span>
                  {uploading
                    ? t('panel.supplierProducts.csv.uploading')
                    : t('panel.supplierProducts.csv.complete')}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[var(--active)] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}

          {errors.length > 0 ? (
            <ul className="space-y-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.slice(0, 8).map((error, index) => (
                <li key={`${error.messageKey}-${index}`}>{formatError(error)}</li>
              ))}
              {errors.length > 8 ? (
                <li>
                  {t('panel.supplierProducts.csv.moreErrors', {
                    count: errors.length - 8,
                  })}
                </li>
              ) : null}
            </ul>
          ) : null}

          {success ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50 disabled:opacity-50"
          >
            {t('panel.supplierProducts.csv.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={uploading}
            className="rounded-md bg-[var(--active)] px-4 py-2 text-sm font-semibold text-white hover:brightness-95 disabled:opacity-50"
          >
            {uploading
              ? t('panel.supplierProducts.csv.uploading')
              : t('panel.supplierProducts.csv.submit')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
