import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiGlobe, FiChevronDown } from 'react-icons/fi'
import { SUPPORTED_LANGUAGES } from '../../../i18n'

export default function LanguageSwitcher({
  className = '',
  compact = false,
}) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const current =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === i18n.resolvedLanguage)
    || SUPPORTED_LANGUAGES[0]

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const changeLanguage = (code) => {
    void i18n.changeLanguage(code)
    document.documentElement.lang = code
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t(current.labelKey)}
        onClick={() => setOpen((value) => !value)}
        className={
          compact
            ? 'inline-flex h-9 min-w-[4.25rem] items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 text-[var(--primary-text)] transition-colors hover:bg-gray-50'
            : 'inline-flex h-11 items-center gap-2 rounded-sm px-3 text-neutral-950 outline outline-1 outline-offset-[-1px] outline-gray-200 transition-colors hover:bg-slate-50'
        }
      >
        <FiGlobe
          className={compact ? 'size-4 shrink-0' : 'size-5 shrink-0'}
          aria-hidden
        />
        <span
          className={
            compact
              ? 'text-xs font-semibold uppercase'
              : 'text-base font-medium'
          }
        >
          {compact ? current.code : t(current.labelKey)}
        </span>
        <FiChevronDown
          className={`shrink-0 transition-transform duration-200 ${
            compact ? 'size-3.5' : 'size-4'
          } ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <div
        className={`absolute right-0 top-full z-50 mt-1 min-w-[8.5rem] origin-top-right overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg transition-all duration-200 ease-out ${
          open
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
        role="listbox"
        aria-label="Language"
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const active = lang.code === current.code

          return (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => changeLanguage(lang.code)}
              className={`flex w-full items-center px-3 py-2.5 text-left text-sm transition-colors ${
                active
                  ? 'bg-amber-50 font-semibold text-amber-700'
                  : 'text-neutral-800 hover:bg-slate-50'
              }`}
            >
              {t(lang.labelKey)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
