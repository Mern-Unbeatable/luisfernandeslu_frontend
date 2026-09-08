import { FiLock } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

export default function GetFullAccessModal({
  title,
  description,
  actionLabel,
  onAction,
  pending = false,
}) {
  const { t } = useTranslation()

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="get-full-access-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-8 text-center shadow-xl sm:px-8"
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#1B2B4B] text-white">
          <FiLock className="size-6" aria-hidden />
        </div>
        <h2
          id="get-full-access-title"
          className="mt-5 text-xl font-bold text-[var(--primary-text)]"
        >
          {title || t('accountLock.getFullAccess', 'Get Full Access')}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--secondary-text)]">
          {description}
        </p>
        {!pending && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 w-full rounded-lg bg-[var(--active)] px-4 py-3 text-sm font-bold tracking-wide text-white uppercase hover:brightness-95"
          >
            {actionLabel || t('accountLock.update', 'UPDATE')}
          </button>
        ) : null}
      </div>
    </div>
  )
}
