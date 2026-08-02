import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiMoreVertical } from 'react-icons/fi'
import OfferCard from './OfferCard'
import UserAvatar from './UserAvatar'

export default function MessageBubble({
  message,
  onStartEdit,
  onDeleteMessage,
  onPayNow,
  onNegotiate,
  actionMessageId,
  isBeingEdited,
}) {
  const isOutgoing = message.sender === 'me'
  const isBusy = actionMessageId === message.id
  const displayText = message.isDeleted
    ? 'This message was deleted'
    : message.text

  if (message.type === 'offer' && message.offer && !message.isDeleted) {
    return (
      <div
        className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'}`}
      >
        <div className="flex max-w-[min(100%,28rem)] flex-col gap-1">
          <OfferCard
            offer={message.offer}
            onPayNow={() => onPayNow?.(message)}
            onNegotiate={() => onNegotiate?.(message)}
          />
          <Meta
            time={message.time}
            editedAt={message.editedAt}
            status={message.status}
            align={isOutgoing ? 'right' : 'left'}
          />
        </div>
      </div>
    )
  }

  if (isOutgoing) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[75%] flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            {!message.isDeleted && !isBeingEdited ? (
              <MessageActions
                disabled={isBusy}
                onEdit={() => onStartEdit?.(message)}
                onDelete={() => onDeleteMessage?.(message.id)}
              />
            ) : null}
            <div
              className={`rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm leading-relaxed ${
                message.isDeleted
                  ? 'bg-gray-100 italic text-[var(--secondary-text)]'
                  : 'bg-[#E8EEF5] text-[var(--primary-text)]'
              } ${isBeingEdited ? 'ring-2 ring-[var(--active)]' : ''}`}
            >
              {displayText}
            </div>
          </div>
          <Meta
            time={message.time}
            editedAt={message.editedAt}
            status={message.status}
            align="right"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2">
      <UserAvatar
        partner={message.partner}
        className="size-8"
        textClassName="text-[10px]"
      />
      <div className="flex max-w-[75%] flex-col gap-1">
        <div
          className={`rounded-2xl rounded-bl-md border border-gray-100 bg-white px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
            message.isDeleted
              ? 'italic text-[var(--secondary-text)]'
              : 'text-[var(--primary-text)]'
          }`}
        >
          {displayText}
        </div>
        <Meta time={message.time} align="left" />
      </div>
    </div>
  )
}

function Meta({ time, editedAt, status, align = 'left' }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 text-[10px] text-[var(--secondary-text)] ${
        align === 'right' ? 'justify-end' : 'justify-start'
      }`}
    >
      {time ? <span>{time}</span> : null}
      {editedAt ? <span>· Edited</span> : null}
      {status ? <span>· {status}</span> : null}
    </div>
  )
}

function MessageActions({ onEdit, onDelete, disabled }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState(null)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const menuId = useId()

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setCoords(null)
      return undefined
    }

    const updatePosition = () => {
      const rect = buttonRef.current.getBoundingClientRect()
      const menuHeight = menuRef.current?.offsetHeight ?? 88
      const menuWidth = menuRef.current?.offsetWidth ?? 112
      const gap = 4
      const spaceBelow = window.innerHeight - rect.bottom
      const openBelow = spaceBelow >= menuHeight + gap

      let top = openBelow
        ? rect.bottom + gap
        : rect.top - menuHeight - gap
      let left = rect.right - menuWidth

      top = Math.max(8, Math.min(top, window.innerHeight - menuHeight - 8))
      left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8))

      setCoords({ top, left })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event) => {
      const inTrigger = rootRef.current?.contains(event.target)
      const inMenu = menuRef.current?.contains(event.target)
      if (!inTrigger && !inMenu) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100 disabled:opacity-50"
      >
        <FiMoreVertical className="size-4" />
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              style={
                coords
                  ? { top: coords.top, left: coords.left }
                  : { top: 0, left: 0, visibility: 'hidden' }
              }
              className="fixed z-50 min-w-[7rem] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-sm text-[var(--primary-text)] hover:bg-gray-50"
                onClick={() => {
                  setOpen(false)
                  onEdit?.()
                }}
              >
                Edit
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                onClick={() => {
                  setOpen(false)
                  onDelete?.()
                }}
              >
                Delete
              </button>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
