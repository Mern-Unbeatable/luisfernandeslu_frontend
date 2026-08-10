import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiMoreVertical } from 'react-icons/fi'

export default function DisputeRowActionMenu({
  row,
  onSeeDetails,
  onStatusChange,
  labels,
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
    const menuWidth = menuRef.current?.offsetWidth || 180
    const menuHeight = menuRef.current?.offsetHeight || 200
    const gap = 6

    let top = rect.bottom + gap
    let left = rect.right - menuWidth

    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - gap
    }
    if (left < 8) left = 8
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8
    }

    setCoords({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
  }, [open])

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

  const closeAnd = (fn) => {
    fn?.(row)
    setOpen(false)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100"
      >
        <FiMoreVertical className="size-5" />
      </button>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              style={{ top: coords.top, left: coords.left }}
              className="fixed z-[9999] min-w-[180px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => closeAnd(onSeeDetails)}
                className="flex w-full px-3 py-2.5 text-left text-sm text-[var(--primary-text)] transition-colors hover:bg-gray-50"
              >
                {labels.seeDetails}
              </button>
              <div className="my-1 border-t border-gray-100" />
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
                {labels.statusHeading}
              </p>
              <button
                type="button"
                role="menuitem"
                onClick={() => closeAnd(() => onStatusChange?.(row, 'under_review'))}
                className="flex w-full px-3 py-2.5 text-left text-sm text-[var(--primary-text)] transition-colors hover:bg-gray-50"
              >
                {labels.underReview}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => closeAnd(() => onStatusChange?.(row, 'resolved'))}
                className="flex w-full px-3 py-2.5 text-left text-sm text-[var(--primary-text)] transition-colors hover:bg-gray-50"
              >
                {labels.resolved}
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
