import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiMoreVertical } from 'react-icons/fi'

export default function SupplierRowActionMenu({ row, actions = [] }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const menuId = useId()

  const visibleActions = actions.filter(
    (action) => !action.visible || action.visible(row),
  )

  const updatePosition = () => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const menuWidth = menuRef.current?.offsetWidth || 160
    const menuHeight =
      menuRef.current?.offsetHeight || visibleActions.length * 42 + 8
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
  }, [open, visibleActions.length])

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
              className="fixed z-[9999] min-w-[160px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg"
            >
              {visibleActions.map((action) => {
                const isPrimary = action.variant === 'primary'
                return (
                  <button
                    key={action.id || action.label}
                    type="button"
                    role="menuitem"
                    disabled={action.disabled?.(row)}
                    onClick={() => {
                      action.onClick?.(row)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      isPrimary
                        ? 'bg-[var(--active)] font-semibold text-white hover:brightness-105'
                        : action.variant === 'danger'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-[var(--primary-text)] hover:bg-gray-50'
                    }`}
                  >
                    {action.label}
                  </button>
                )
              })}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
