import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FaRobot } from 'react-icons/fa'
import { FiMessageCircle, FiSend, FiX, FiBox, FiExternalLink } from 'react-icons/fi'
import {
  useGetAssistantHistoryQuery,
  useSendAssistantMessageMutation,
} from '../../../features/assistant/assistantApi'

function formatTime(date = new Date()) {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function createWelcomeMessages(t) {
  const now = formatTime()
  return [
    {
      id: 'welcome-1',
      role: 'assistant',
      type: 'text',
      text: t('constructionAssistant.welcome1'),
      time: now,
    },
    {
      id: 'welcome-2',
      role: 'assistant',
      type: 'text',
      text: t('constructionAssistant.welcome2'),
      time: now,
    },
    {
      id: 'welcome-3',
      role: 'assistant',
      type: 'text',
      text: t('constructionAssistant.welcome3'),
      time: now,
    },
  ]
}

export default function ConstructionAssistantWidget() {
  const { t } = useTranslation()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const listRef = useRef(null)
  const inputRef = useRef(null)

  const { data: historyMessages, isSuccess: isHistoryLoaded } =
    useGetAssistantHistoryQuery(undefined, {
      skip: !isAuthenticated,
    })

  const [sendAssistantMessage, { isLoading }] = useSendAssistantMessageMutation()

  // Sync messages when authenticated history is loaded
  useEffect(() => {
    if (isAuthenticated && isHistoryLoaded) {
      if (historyMessages && historyMessages.length > 0) {
        setMessages(historyMessages)
      } else if (messages.length === 0) {
        setMessages(createWelcomeMessages(t))
      }
    }
  }, [isAuthenticated, isHistoryLoaded, historyMessages, t])

  // Non-authenticated initial welcome message
  useEffect(() => {
    if (open && messages.length === 0 && !isAuthenticated) {
      setMessages(createWelcomeMessages(t))
    }
  }, [open, messages.length, isAuthenticated, t])


  useEffect(() => {
    if (!open) return undefined
    inputRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, open, isLoading])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    const time = formatTime()
    const userMsg = { id: `u-${Date.now()}`, role: 'user', type: 'text', text, time }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    try {
      const history = messages
        .filter((m) => m.type === 'text')
        .slice(-6)
        .map((m) => ({ role: m.role, text: m.text }))

      const res = await sendAssistantMessage({ message: text, history }).unwrap()
      const replyTime = formatTime()

      const newAssistantMessages = []
      if (res.reply) {
        newAssistantMessages.push({
          id: `a-text-${Date.now()}`,
          role: 'assistant',
          type: 'text',
          text: res.reply,
          time: replyTime,
        })
      }

      if (res.products && res.products.length > 0) {
        newAssistantMessages.push({
          id: `a-prod-${Date.now()}`,
          role: 'assistant',
          type: 'products',
          products: res.products,
          time: replyTime,
        })
      }

      setMessages((prev) => [...prev, ...newAssistantMessages])
    } catch (err) {
      console.error('Assistant error:', err)
      setMessages((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: 'assistant',
          type: 'text',
          text: t('constructionAssistant.fallbackReply'),
          time: formatTime(),
        },
      ])
    }
  }

  return (
    <div className="pointer-events-none fixed right-4 bottom-5 z-[100] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <div
          className="pointer-events-auto flex max-h-[min(540px,calc(100vh-6rem))] w-[min(100vw-2rem,390px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-[#FFF8EE] shadow-2xl"
          role="dialog"
          aria-label={t('constructionAssistant.title')}
        >
          <div className="flex items-center gap-2 bg-[var(--active)] px-4 py-3 text-white shadow-sm">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <FaRobot className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold">
                {t('constructionAssistant.title')}
              </h2>
              <p className="truncate text-[11px] text-white/80">
                AI Building Materials Expert
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/15"
              aria-label={t('constructionAssistant.close')}
            >
              <FiX className="size-5" strokeWidth={2.5} aria-hidden />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-4"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} t={t} onSelect={() => setOpen(false)} />
            ))}

            {isLoading && (
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-black/5">
                  <div className="flex gap-1">
                    <span className="size-2 animate-bounce rounded-full bg-[var(--active)] [animation-delay:-0.3s]" />
                    <span className="size-2 animate-bounce rounded-full bg-[var(--active)] [animation-delay:-0.15s]" />
                    <span className="size-2 animate-bounce rounded-full bg-[var(--active)]" />
                  </div>
                  <span className="text-xs text-gray-500">Checking store catalog...</span>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-[#f0e6d8] bg-[#FFF8EE] p-3"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t('constructionAssistant.inputPlaceholder')}
                disabled={isLoading}
                className="h-11 min-w-0 flex-1 rounded-lg border border-[color-mix(in_srgb,var(--active)_35%,white)] bg-white px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-[var(--active)] text-white transition-opacity hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                aria-label={t('constructionAssistant.send')}
              >
                <FiSend className="size-5" aria-hidden />
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="pointer-events-auto relative">
        {!open ? (
          <span
            className="construction-assistant-fab-ping pointer-events-none absolute inset-0 rounded-full bg-[var(--active)]"
            aria-hidden
          />
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={
            open
              ? t('constructionAssistant.close')
              : t('constructionAssistant.open')
          }
          className={[
            'relative inline-flex size-14 items-center justify-center rounded-full bg-[var(--active)] text-white shadow-lg ring-4 ring-[color-mix(in_srgb,var(--active)_25%,transparent)] transition-[transform,filter] hover:scale-105 hover:brightness-95 active:scale-95 cursor-pointer',
          ].join(' ')}
        >
          {open ? (
            <FiX className="size-7" strokeWidth={2.5} aria-hidden />
          ) : (
            <FiMessageCircle className="size-7" strokeWidth={2} aria-hidden />
          )}
        </button>
      </div>
    </div>
  )
}

function ChatMessage({ message, t, onSelect }) {
  const isUser = message.role === 'user'

  if (message.type === 'products') {
    return (
      <div className="flex flex-col items-start gap-1">
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-1">
          Recommended Products
        </div>
        <div className="max-w-full rounded-2xl rounded-bl-md bg-white p-2 shadow-sm ring-1 ring-black/5">
          <ul className="flex gap-2.5 overflow-x-auto pb-1 max-w-[340px]">
            {message.products.map((product) => {
              const displayTitle = product.title || (product.titleKey ? t(product.titleKey) : 'Product')
              const displayPrice = product.basePrice != null
                ? `€${Number(product.basePrice).toFixed(2)}${product.unitOfMeasure ? ` / ${product.unitOfMeasure}` : ''}`
                : (product.priceKey ? t(product.priceKey) : '')

              return (
                <li key={product.id || product.slug} className="w-[8.5rem] shrink-0">
                  <Link
                    to={`/products/${product.slug}`}
                    onClick={() => onSelect?.()}
                    className="group flex flex-col h-full rounded-xl border border-gray-100 bg-gray-50/50 p-2 transition-all hover:border-[var(--active)] hover:bg-white hover:shadow-md"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={displayTitle}
                          className="size-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <FiBox className="size-8 text-gray-300" />
                      )}
                      <span className="absolute bottom-1 right-1 rounded bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <FiExternalLink className="size-3" />
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs font-semibold text-[var(--primary-text)] group-hover:text-[var(--active)] leading-snug">
                      {displayTitle}
                    </p>
                    {product.category?.name && (
                      <span className="mt-1 truncate text-[10px] text-gray-400">
                        {product.category.name}
                      </span>
                    )}
                    <p className="mt-auto pt-1.5 text-xs font-bold text-[var(--active)]">
                      {displayPrice}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <time className="text-[10px] text-[var(--secondary-text)] px-1">
          {message.time}
        </time>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'rounded-br-md bg-[var(--active)] text-white shadow-sm'
            : 'rounded-bl-md bg-white text-[var(--primary-text)] shadow-sm ring-1 ring-black/5'
        }`}
      >
        {message.text}
      </div>
      <time className="text-[10px] text-[var(--secondary-text)] px-1">
        {message.time}
      </time>
    </div>
  )
}

