import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiChevronDown } from 'react-icons/fi'

const PRESETS = ['20%', '40%', '60%']

export default function SupplierCommissionCell({
  value,
  onChange,
  i18nKey = 'adminSupplierManagement',
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState('')
  const rootRef = useRef(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const applyRate = (next) => {
    onChange?.(next)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-md bg-[color-mix(in_srgb,var(--active)_14%,white)] px-2.5 py-1 text-xs font-semibold text-[var(--active)]"
      >
        {value}
        <FiChevronDown className="size-3.5" aria-hidden />
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute left-0 top-full z-20 mt-2 w-52 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
        >
          <p className="text-sm font-bold text-[var(--primary-text)]">
            {t(`${i18nKey}.commission.title`)}
          </p>
          <ul className="mt-3 space-y-2">
            {PRESETS.map((rate) => (
              <li key={rate}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--primary-text)]">
                  <input
                    type="radio"
                    name={`commission-${panelId}`}
                    checked={value === rate}
                    onChange={() => applyRate(rate)}
                    className="size-4 accent-[var(--active)]"
                  />
                  {rate}
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="text-xs font-medium text-[var(--secondary-text)]">
              {t(`${i18nKey}.commission.custom`)}
            </p>
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder={t(`${i18nKey}.commission.placeholder`)}
                className="h-9 min-w-0 flex-1 rounded-md border border-gray-200 bg-[color-mix(in_srgb,var(--active)_8%,white)] px-2 text-sm outline-none focus:border-[var(--active)]"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = custom.trim()
                  if (trimmed) applyRate(trimmed.includes('%') ? trimmed : `${trimmed}%`)
                }}
                className="rounded-md bg-[var(--active)] px-2 text-xs font-semibold text-white"
              >
                {t(`${i18nKey}.commission.set`)}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
