import { useEffect } from 'react'
import { FiCheckCircle, FiX } from 'react-icons/fi'

/**
 * Lightweight success/error toast. No external toast library in the project.
 */
export default function Toast({
  open = false,
  message = '',
  variant = 'success',
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!open || !onClose) return undefined
    const timer = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timer)
  }, [open, onClose, duration])

  if (!open || !message) return null

  const isSuccess = variant === 'success'

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4 sm:top-6"
      role="status"
      aria-live="polite"
    >
      <div
        className={[
          'pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-lg',
          isSuccess
            ? 'border-emerald-200 bg-white text-emerald-800'
            : 'border-red-200 bg-white text-red-700',
        ].join(' ')}
      >
        {isSuccess ? (
          <FiCheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        ) : null}
        <p className="flex-1 text-sm font-medium">{message}</p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <FiX className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
