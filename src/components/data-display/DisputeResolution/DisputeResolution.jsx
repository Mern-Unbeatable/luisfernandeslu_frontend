import { useEffect, useRef, useState } from 'react'
import { FiPaperclip, FiSend } from 'react-icons/fi'

/**
 * Dispute Resolution — common page component.
 *
 * variant="public"    → status + created on description; no page header; no status pills
 * variant="dashboard" → page header; status pills in composer
 */
export default function DisputeResolution({
  variant = 'public',
  dispute = {},
  currentUserRole = 'buyer',
  currentUserId = null,
  onSendMessage,
  onAttach,
  onStatusChange,
  className = '',
}) {
  const isDashboard = variant === 'dashboard'
  const items = dispute.items || []
  const messages = dispute.messages || []
  const evidence = dispute.evidence || []
  const status = dispute.status || 'under_review'

  return (
    <div className={`mx-auto w-full ${className}`}>
      {isDashboard ? (
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            Disputes &amp; Returns Center
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage customer disputes, returns, and resolution cases
          </p>
        </header>
      ) : null}

      {/* Left ~42% / Right ~58% — matches design proportions */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <DisputeInfoCard items={items} />
        <DescriptionCard
          description={dispute.description}
          evidence={evidence}
          status={status}
          createdAt={dispute.createdAt}
          showMeta={!isDashboard}
        />
      </div>

      <CommunicationThread
        className="mt-5"
        messages={messages}
        currentUserRole={currentUserRole}
        currentUserId={currentUserId}
        showStatusPills={isDashboard}
        status={status}
        onStatusChange={onStatusChange}
        onSendMessage={onSendMessage}
        onAttach={onAttach}
      />
    </div>
  )
}

function Card({ children, className = '' }) {
  return (
    <section
      className={`rounded-xl border border-[#E5E5E5] bg-white p-5 sm:p-6 ${className}`}
    >
      {children}
    </section>
  )
}

function DisputeInfoCard({ items }) {
  return (
    <Card className="h-full">
      <h2 className="text-lg font-bold text-zinc-950">Dispute Information</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Details about the raised issue
      </p>

      <ul className="mt-6 flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3.5">
            <img
              src={item.image}
              alt=""
              className="size-[72px] shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-zinc-900">
                {item.productName}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Order ID: {item.orderId}
              </p>
              <p className="mt-1.5 text-sm font-medium text-[var(--active)]">
                {item.reason}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function DescriptionCard({
  description,
  evidence,
  status,
  createdAt,
  showMeta,
}) {
  return (
    <Card className="flex h-full flex-col">
      <h2 className="text-lg font-bold text-zinc-950">Description</h2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        {description}
      </p>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-zinc-900">
          Evidence ({evidence.length})
        </h3>
        <div className="mt-3 flex flex-wrap gap-3">
          {evidence.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`Evidence ${index + 1}`}
              className="h-[88px] w-[120px] rounded-lg object-cover"
            />
          ))}
        </div>
      </div>

      {showMeta ? (
        <div className="mt-auto flex flex-col gap-3 pt-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-medium text-neutral-500">Status</span>
            <span className="inline-flex rounded-md bg-[color-mix(in_srgb,var(--active)_16%,white)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--active)] uppercase">
              {formatStatusLabel(status)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-medium text-neutral-500">Created</span>
            <span className="text-sm font-medium text-zinc-800">{createdAt}</span>
          </div>
        </div>
      ) : null}
    </Card>
  )
}

function CommunicationThread({
  messages,
  currentUserRole = 'buyer',
  currentUserId = null,
  showStatusPills,
  status,
  onStatusChange,
  onSendMessage,
  onAttach,
  className = '',
}) {
  const [draft, setDraft] = useState('')
  const fileRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSendMessage?.(text)
    setDraft('')
  }

  const normalizedViewerRole = String(currentUserRole || '').toLowerCase()
  const isViewerBuyer = ['customer', 'company', 'buyer'].includes(normalizedViewerRole)
  const isViewerSupplier = ['supplier', 'seller'].includes(normalizedViewerRole)
  const isViewerAdmin = ['admin'].includes(normalizedViewerRole)

  return (
    <Card className={`flex flex-col overflow-hidden !p-0 ${className}`}>
      <div className="border-b border-[#E5E5E5] px-5 py-4 sm:px-6">
        <h2 className="text-lg font-bold text-zinc-950">
          Communication Thread
        </h2>
      </div>

      <div className="flex max-h-[28rem] min-h-[20rem] flex-col gap-6 overflow-y-auto px-5 py-5 sm:px-6">
        {messages.map((message) => {
          const msgRole = String(message.role || '').toLowerCase()
          const msgRoleLabel = String(message.roleLabel || '').toLowerCase()

          // Check if this message was sent by the current viewer
          let isOwn = false
          if (currentUserId && message.senderId && String(message.senderId) === String(currentUserId)) {
            isOwn = true
          } else if (isViewerBuyer && (msgRole === 'buyer' || msgRoleLabel === 'buyer')) {
            isOwn = true
          } else if (isViewerSupplier && (msgRole === 'supplier' || msgRole === 'seller' || msgRoleLabel === 'seller' || msgRoleLabel === 'supplier')) {
            isOwn = true
          } else if (isViewerAdmin && (msgRole === 'admin' || msgRoleLabel === 'admin')) {
            isOwn = true
          }

          return (
            <div
              key={message.id}
              className={`flex flex-col gap-1.5 ${
                isOwn ? 'items-end' : 'items-start'
              }`}
            >
              <p className="text-xs text-neutral-500">
                <span className="font-medium text-neutral-700">
                  {message.author}
                </span>
                {message.roleLabel ? (
                  <span> ({message.roleLabel})</span>
                ) : null}
                {message.at ? <span> - {message.at}</span> : null}
              </p>
              <div
                className={`max-w-[min(100%,34rem)] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isOwn
                    ? 'rounded-br-md bg-[#2D3036] text-white'
                    : 'rounded-bl-md bg-[#E7E7E8] text-zinc-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex flex-wrap items-center gap-3 border-t border-[#E5E5E5] bg-[#F5F5F5] px-4 py-3 sm:px-5"
      >
        {showStatusPills ? (
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              label="Resolved"
              active={status === 'resolved'}
              tone="success"
              onClick={() => onStatusChange?.('resolved')}
            />
            <StatusPill
              label="Under Review"
              active={status === 'under_review'}
              tone="review"
              onClick={() => onStatusChange?.('under_review')}
            />
          </div>
        ) : null}

        <div className="flex min-w-[12rem] flex-1 items-center gap-2.5">
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            multiple
            accept="image/*,.pdf"
            onChange={(event) => {
              const files = Array.from(event.target.files || [])
              if (files.length) onAttach?.(files)
              event.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-white hover:text-zinc-800"
            aria-label="Attach file"
          >
            <FiPaperclip className="size-5" strokeWidth={1.75} />
          </button>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type your message..."
            className="h-11 min-w-0 flex-1 rounded-xl border border-[#E5E5E5] bg-white px-4 text-sm text-zinc-900 outline-none placeholder:text-neutral-400 focus:border-[var(--active)]"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#2D3036] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <FiSend className="size-4" strokeWidth={2} />
          </button>
        </div>
      </form>
    </Card>
  )
}

function StatusPill({ label, active, tone, onClick }) {
  const tones = {
    success: active
      ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    review: active
      ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-200'
      : 'bg-violet-50 text-violet-600 hover:bg-violet-100',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${tones[tone]}`}
    >
      {label}
    </button>
  )
}

function formatStatusLabel(status) {
  if (status === 'resolved') return 'Resolved'
  if (status === 'under_review') return 'Under Review'
  return String(status || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
