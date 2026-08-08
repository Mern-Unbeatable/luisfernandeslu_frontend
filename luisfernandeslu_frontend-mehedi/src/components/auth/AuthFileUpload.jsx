import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiUploadCloud } from 'react-icons/fi'

/**
 * Drag-and-drop upload zone — matches marketing signup designs:
 * light gray fill, dashed border, circular cloud badge
 */
export default function AuthFileUpload({
  label,
  name,
  onChange,
  files = [],
  hideLabel = false,
}) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const applyFiles = (list) => {
    const next = Array.from(list || []).slice(0, 20)
    onChange?.(name, next)
  }

  return (
    <div className="block">
      {!hideLabel && label ? (
        <span className="text-sm font-semibold text-[var(--primary-text)]">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          applyFiles(e.dataTransfer.files)
        }}
        className={`mt-2 flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-9 text-center transition-colors ${
          dragging
            ? 'border-[var(--active)] bg-[#FFF8EE]'
            : 'border-[#C8CDD5] bg-white hover:border-gray-400'
        }`}
      >
        <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#D6EBFF] text-[#2B6CB0]">
          <FiUploadCloud className="size-5" strokeWidth={1.75} aria-hidden />
        </span>

        <span className="text-sm font-semibold text-[var(--primary-text)]">
          {t('auth.register.dropHere')}
        </span>
        <span className="mt-1 text-sm text-[var(--secondary-text)]">
          {t('auth.register.browse')}
        </span>

        <span className="mt-4 text-[11px] leading-relaxed text-[#9AA1AC]">
          JPEG, PNG &nbsp;|&nbsp; {t('auth.register.maxPhotos')} &nbsp;|&nbsp;
          1920×1080px recommended
        </span>

        {files.length > 0 ? (
          <span className="mt-2 text-xs font-medium text-[var(--active)]">
            {t('auth.register.filesSelected', { count: files.length })}
          </span>
        ) : null}
      </button>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,application/pdf"
        multiple
        className="sr-only"
        onChange={(e) => applyFiles(e.target.files)}
      />
    </div>
  )
}
