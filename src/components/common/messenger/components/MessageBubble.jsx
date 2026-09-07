import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiMoreVertical } from 'react-icons/fi'
import OfferCard from './OfferCard'
import UserAvatar from './UserAvatar'

export default function MessageBubble({
  message,
  partner,
  onStartEdit,
  onDeleteMessage,
  onPayNow,
  onNegotiate,
  actionMessageId,
  isBeingEdited,
  showPartnerAvatar = true,
}) {
  const isOutgoing = message.sender === 'me'
  const isBusy = actionMessageId === message.id
  const displayText = message.isDeleted
    ? 'This message was deleted'
    : message.text

  if (message.type === 'offer' && message.offer && !message.isDeleted) {
    // Only the recipient can Pay / Negotiate — sender just waits.
    const isRecipient = !isOutgoing
    return (
      <div
        className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'}`}
      >
        <div className="flex max-w-[min(100%,28rem)] flex-col gap-1">
          <OfferCard
            offer={message.offer}
            showActions={isRecipient}
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

  if (message.type === 'system' && !message.isDeleted) {
    // Check if it's the initial Quote Request message to style it like a card
    const quoteMatch = displayText.match(/Quote request sent for "(.*?)". Budget: (.*?)\.(.*)/s)
    if (quoteMatch) {
      const [_, product, budget, restText] = quoteMatch
      return (
        <div className="my-2 flex w-full justify-center">
          <div className="w-full max-w-[340px] overflow-hidden rounded-xl border border-indigo-200 bg-indigo-50/50 shadow-sm sm:max-w-md">
            <div className="border-b border-indigo-100 bg-indigo-100/50 px-4 py-3">
              <p className="text-sm font-bold text-indigo-900">New Quote Request</p>
              <p className="text-xs text-indigo-700">Awaiting supplier response</p>
            </div>
            <div className="p-4">
              <div className="mb-3 rounded-lg bg-white p-3 shadow-sm">
                <p className="text-[11px] uppercase tracking-wider text-gray-500">Product</p>
                <p className="mt-0.5 text-sm font-bold text-gray-900">{product}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-lg bg-white p-3 shadow-sm">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">Budget</p>
                  <p className="mt-0.5 text-sm font-bold text-[var(--active)]">{budget}</p>
                </div>
                <div className="flex-1 rounded-lg bg-white p-3 shadow-sm">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">Quantity</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-800">
                    {restText.replace(/Quantity:|^\s+|\s+$/g, '').trim()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center px-4 pb-3">
               <Meta time={message.time} align="center" />
            </div>
          </div>
        </div>
      )
    }

    // Normal system message fallback
    return (
      <div className="my-3 flex w-full justify-center">
        <div className="rounded-lg bg-gray-100 px-4 py-2 text-center text-xs font-medium text-gray-600">
          {displayText}
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
              className={`rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm leading-relaxed ${
                message.isDeleted
                  ? 'bg-gray-100 italic text-[var(--secondary-text)]'
                  : 'bg-[#D9D9D9] text-[var(--primary-text)]'
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
      {showPartnerAvatar ? (
        <UserAvatar
          partner={partner}
          className="size-8"
          textClassName="text-[10px]"
        />
      ) : (
        <span className="size-8 shrink-0" aria-hidden />
      )}
      <div className="flex max-w-[75%] flex-col gap-1">
        <div
          className={`rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm leading-relaxed ${
            message.isDeleted
              ? 'italic text-[var(--secondary-text)]'
              : 'bg-[#ECECEC] text-[var(--primary-text)]'
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
