import { useEffect, useRef, useState } from 'react'
import {
  FiArrowLeft,
  FiCheck,
  FiSend,
  FiX,
} from 'react-icons/fi'
import MessageBubble from './MessageBubble'
import UserAvatar from '../components/UserAvatar'

export default function ChatArea({
  activeChat,
  messages = [],
  onBack,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onTyping,
  onStopTyping,
  onCreateOffer,
  onPayNow,
  onNegotiate,
  isPartnerTyping = false,
  isSending = false,
  isLoading = false,
  actionMessageId = null,
}) {
  const [inputText, setInputText] = useState('')
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [isEditPending, setIsEditPending] = useState(false)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return
    // Scroll only inside the chat pane — never the page
    container.scrollTop = container.scrollHeight
  }, [messages, isPartnerTyping])

  useEffect(() => {
    setEditingMessageId(null)
    setInputText('')
    onStopTyping?.()
  }, [activeChat?.id])

  const startEdit = (message) => {
    setEditingMessageId(message.id)
    setInputText(message.text || '')
    inputRef.current?.focus()
  }

  const cancelEdit = () => {
    setEditingMessageId(null)
    setInputText('')
  }

  const handleSubmit = async () => {
    if (!inputText.trim() || isSending) return

    if (editingMessageId) {
      const messageId = editingMessageId
      const text = inputText
      // Optimistic: close edit UI immediately, then send to server
      cancelEdit()
      setIsEditPending(true)
      try {
        await onEditMessage?.(messageId, text)
      } finally {
        setIsEditPending(false)
      }
      return
    }

    const text = inputText
    setInputText('')
    onStopTyping?.()
    await onSendMessage?.(text)
  }

  if (!activeChat) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#F8F8F8] px-6 text-center">
        <h3 className="text-lg font-semibold text-[var(--primary-text)]">
          Your Messages
        </h3>
        <p className="max-w-sm text-sm text-[var(--secondary-text)]">
          Select a conversation from the sidebar to start chatting.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-[#F5F5F5] px-3 py-3 sm:px-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md p-1.5 text-[var(--primary-text)] hover:bg-white/70 md:hidden"
          aria-label="Back to inbox"
        >
          <FiArrowLeft className="size-5" />
        </button>
        <UserAvatar partner={activeChat.partner} />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-[var(--primary-text)] sm:text-base">
            {activeChat.name}
          </h2>
          <p className="text-xs">
            {isPartnerTyping
              ? (
                  <span className="text-[var(--secondary-text)]">Typing...</span>
                )
              : activeChat.online
                ? (
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                      <span
                        className="size-2 rounded-full bg-emerald-500"
                        aria-hidden
                      />
                      Active
                    </span>
                  )
                : (
                  <span className="text-[var(--secondary-text)]">Offline</span>
                )}
          </p>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 space-y-3 overflow-y-auto bg-white px-3 py-4 sm:px-5"
      >
        <p className="text-center text-xs text-[var(--secondary-text)]">
          Thursday, Jan 4 • 6:21 PM
        </p>

        {isLoading && messages.length === 0 ? (
          <p className="text-center text-sm text-[var(--secondary-text)]">
            Loading messages...
          </p>
        ) : (
          messages.map((message, index) => {
            const prev = messages[index - 1]
            const showPartnerAvatar =
              message.sender === 'them' &&
              message.type !== 'offer' &&
              (prev?.sender !== 'them' || prev?.type === 'offer')

            return (
              <MessageBubble
                key={message.id}
                message={message}
                partner={activeChat?.partner}
                showPartnerAvatar={showPartnerAvatar}
                onStartEdit={startEdit}
                onDeleteMessage={onDeleteMessage}
                onPayNow={onPayNow}
                onNegotiate={onNegotiate}
                actionMessageId={actionMessageId}
                isBeingEdited={editingMessageId === message.id}
              />
            )
          })
        )}

        {isPartnerTyping ? (
          <div className="flex items-end gap-2">
            <UserAvatar
              partner={activeChat.partner}
              className="size-7"
              textClassName="text-[9px]"
            />
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-2 rounded-full bg-gray-400"
                  style={{
                    animation: 'typingBounce 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-gray-200 bg-white px-3 py-3 sm:px-4">
        {editingMessageId ? (
          <div className="mb-2 flex items-center justify-between rounded-md bg-[color-mix(in_srgb,var(--active)_10%,white)] px-3 py-1.5 text-xs text-[var(--primary-text)]">
            <span>Editing message</span>
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1 font-medium text-[var(--secondary-text)] hover:text-[var(--primary-text)]"
            >
              <FiX className="size-3.5" />
              Cancel
            </button>
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          {onCreateOffer && !editingMessageId ? (
            <button
              type="button"
              onClick={onCreateOffer}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--active)] px-3 py-2.5 text-xs font-semibold whitespace-nowrap text-white hover:brightness-95"
            >
              Create Offer
            </button>
          ) : null}

          <label className="flex min-w-0 flex-1 items-center rounded-lg border border-gray-200 bg-[#FFFFFF] px-3 py-2.5 focus-within:border-[var(--active)]">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(event) => {
                setInputText(event.target.value)
                if (!editingMessageId) onTyping?.(event.target.value)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleSubmit()
                }
              }}
              placeholder={
                editingMessageId
                  ? 'Edit your message...'
                  : 'Type your message here...'
              }
              className="w-full bg-transparent text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)]"
            />
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSending || !inputText.trim()}
            aria-label={editingMessageId ? 'Save message' : 'Send message'}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-[var(--active)] text-white transition-opacity hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {editingMessageId ? (
              <FiCheck className="size-4" />
            ) : (
              <FiSend className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
