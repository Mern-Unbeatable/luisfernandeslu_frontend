import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'

export default function OrderStatusSelect({
  status,
  label,
  options = [],
  onChange,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const menuId = useId()

  const updatePosition = () => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const menuWidth = menuRef.current?.offsetWidth || 160
    const menuHeight = menuRef.current?.offsetHeight || options.length * 40 + 8
    const gap = 6

    let top = rect.bottom + gap
    let left = rect.left

    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - gap
    }
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8
    }
    if (left < 8) left = 8

    setCoords({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
  }, [open, options.length])

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      const inButton = buttonRef.current?.contains(event.target)
      const inMenu = menuRef.current?.contains(event.target)
      if (!inButton && !inMenu) setOpen(false)
    }

    const onReposition = () => updatePosition()

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ariaLabel}
        onClick={() => setOpen((value) => !value)}
        className="cursor-pointer rounded-full"
      >
        <StatusBadge
          status={status}
          label={label}
          showChevron
          className="rounded-full"
        />
      </button>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              style={{ top: coords.top, left: coords.left }}
              className="fixed z-[9999] min-w-[160px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onChange?.(option.value)
                    setOpen(false)
                  }}
                  className={`flex w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                    option.value === status
                      ? 'font-semibold text-[var(--primary-text)]'
                      : 'text-[var(--primary-text)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
