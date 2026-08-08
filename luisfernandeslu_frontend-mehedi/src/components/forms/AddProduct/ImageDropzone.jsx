import { useEffect, useRef, useState } from 'react'
import { FiUploadCloud, FiX } from 'react-icons/fi'

function formatMeta(meta = []) {
  return meta.map((item) => (
    <span
      key={item}
      className="inline-flex items-center gap-1 text-sm font-medium text-slate-400"
    >
      <span className="size-3 rounded-sm bg-slate-400/80" />
      {item}
    </span>
  ))
}

function fileKey(file, index) {
  if (!file) return `missing-${index}`
  if (typeof file === 'string') return file
  return `${file.name}-${file.size}-${file.lastModified}-${index}`
}

function toList(files, maxFiles) {
  if (maxFiles === 1) return files ? [files] : []
  return Array.isArray(files) ? files.filter(Boolean) : []
}

export default function ImageDropzone({
  label,
  files = [],
  maxFiles = 1,
  accept = 'image/jpeg,image/png',
  meta = ['JPEG, PNG', '1920x1080px recommended'],
  onChange,
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [previews, setPreviews] = useState([])

  const list = toList(files, maxFiles)

  useEffect(() => {
    const current = toList(files, maxFiles)
    const urls = current.map((file) =>
      typeof file === 'string' ? file : URL.createObjectURL(file),
    )
    setPreviews(urls)
    return () => {
      urls.forEach((url, index) => {
        if (typeof current[index] !== 'string') URL.revokeObjectURL(url)
      })
    }
  }, [files, maxFiles])

  const openPicker = () => inputRef.current?.click()

  const takeFiles = (fileList) => {
    const picked = Array.from(fileList || []).filter(Boolean)
    if (!picked.length) return

    if (maxFiles === 1) {
      onChange?.(picked[0] || null)
      return
    }

    onChange?.([...list, ...picked].slice(0, maxFiles))
  }

  const removeAt = (event, index) => {
    event.stopPropagation()
    if (maxFiles === 1) {
      onChange?.(null)
    } else {
      onChange?.(list.filter((_, i) => i !== index))
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  const hasFiles = list.length > 0

  return (
    <div className="flex w-full flex-col gap-2">
      {label ? (
        <p className="text-base font-medium text-gray-800">{label}</p>
      ) : null}

      <div
        className={`flex w-full flex-col gap-3 rounded-xl border-2 bg-white px-4 py-6 transition-colors ${
          dragging
            ? 'border-[var(--active)] bg-[color-mix(in_srgb,var(--active)_6%,white)]'
            : 'border-sky-950/20'
        } ${hasFiles ? 'min-h-0' : 'min-h-64'}`}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          takeFiles(event.dataTransfer.files)
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          className="hidden"
          onChange={(event) => {
            takeFiles(event.target.files)
            event.target.value = ''
          }}
        />

        {hasFiles ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {list.map((file, index) => {
              const url = previews[index]
              if (!url) return null
              return (
                <div
                  key={fileKey(file, index)}
                  className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                >
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`Remove image ${index + 1}`}
                    onClick={(event) => removeAt(event, index)}
                    className="absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <FiX className="size-3.5" />
                  </button>
                </div>
              )
            })}

            {list.length < maxFiles ? (
              <button
                type="button"
                onClick={openPicker}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-sky-950/30 text-sm text-slate-500 hover:border-[var(--active)] hover:text-[var(--active)]"
              >
                <FiUploadCloud className="size-6" />
                Add more
              </button>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="flex w-full flex-1 flex-col items-center justify-center gap-1 py-8 text-center"
          >
            <span className="mb-2 inline-flex size-16 items-center justify-center rounded-full bg-sky-950/5">
              <FiUploadCloud className="size-7 text-sky-950" />
            </span>
            <p className="text-lg font-bold leading-7 text-slate-900">
              Drag and drop photos here
            </p>
            <p className="text-sm leading-5 text-slate-500">
              Or click to browse from your computer
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              {formatMeta([
                ...meta.slice(0, 1),
                maxFiles === 1 ? 'Max 1 photos' : `Max ${maxFiles} photos`,
                ...meta.slice(1),
              ])}
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
