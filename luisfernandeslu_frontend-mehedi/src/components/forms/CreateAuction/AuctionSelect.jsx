import { useEffect, useId, useRef, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

/**
 * Auction dropdown — orange selected header + white option list (image 3).
 */
export default function AuctionSelect({
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  className = '',
}) {
  const listId = useId()
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)

  const selected = options.find((opt) => opt.value === value)
  const otherOptions = options.filter((opt) => opt.value !== value)

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const pick = (nextValue) => {
    onChange?.(nextValue)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={[
          'flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-transparent bg-gray-100 px-3.5 text-left text-sm outline-none transition-colors',
          'hover:border-gray-200 focus:border-[var(--active)] focus:ring-1 focus:ring-[var(--active)]',
          selected
            ? 'font-medium text-[var(--primary-text)]'
            : 'text-zinc-400',
        ].join(' ')}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <FiChevronDown
          className={`size-4 shrink-0 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-md"
        >
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected
              onClick={() => selected && pick(selected.value)}
              className="w-full bg-[var(--active)] px-4 py-3 text-left text-sm font-semibold text-white"
            >
              {selected?.label || placeholder}
            </button>
          </li>
          {otherOptions.map((opt) => (
            <li key={opt.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => pick(opt.value)}
                className="w-full border-t border-gray-200 bg-white px-4 py-3 text-left text-sm text-[var(--primary-text)] transition-colors hover:bg-gray-50"
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
