import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaRobot } from 'react-icons/fa'
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi'

const LED_SUGGESTIONS = [
  {
    id: 'basic-led',
    slug: 'electrical-wires',
    titleKey: 'constructionAssistant.products.basic.title',
    priceKey: 'constructionAssistant.products.basic.price',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR3mEJwuZBA-Py_Jr47MGtww4qzAcWJUDyCUpDZ5_2Ww&s=10',
  },
  {
    id: 'standard-led',
    slug: 'electrical-wires',
    titleKey: 'constructionAssistant.products.standard.title',
    priceKey: 'constructionAssistant.products.standard.price',
    image:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'premium-led',
    slug: 'electrical-wires',
    titleKey: 'constructionAssistant.products.premium.title',
    priceKey: 'constructionAssistant.products.premium.price',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80',
  },
]

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
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages(createWelcomeMessages(t))
    }
  }, [open, messages.length, t])

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
  }, [messages, open])

  const pushAssistantReply = useCallback(
    (userText) => {
      const time = formatTime()
      const wantsLighting = /led|light|lighting|lamp/i.test(userText)

      if (wantsLighting) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            type: 'products',
            products: LED_SUGGESTIONS,
            time,
          },
        ])
        return
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          type: 'text',
          text: t('constructionAssistant.fallbackReply'),
          time,
        },
      ])
    },
    [t],
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text) return

    const time = formatTime()
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', type: 'text', text, time },
    ])
    setInput('')
    window.setTimeout(() => pushAssistantReply(text), 500)
  }

  return (
    <div className="pointer-events-none fixed right-4 bottom-5 z-[100] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <div
          className="pointer-events-auto flex max-h-[min(520px,calc(100vh-6rem))] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-[#FFF8EE] shadow-2xl"
          role="dialog"
          aria-label={t('constructionAssistant.title')}
        >
          <div className="flex items-center gap-2 bg-[var(--active)] px-4 py-3 text-white">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <FaRobot className="size-5" aria-hidden />
            </span>
            <h2 className="min-w-0 flex-1 truncate text-base font-bold">
              {t('constructionAssistant.title')}
            </h2>
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
              <ChatMessage key={message.id} message={message} t={t} />
            ))}
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
                className="h-11 min-w-0 flex-1 rounded-lg border border-[color-mix(in_srgb,var(--active)_35%,white)] bg-white px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-[var(--active)] text-white transition-opacity hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
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
            'relative inline-flex size-14 items-center justify-center rounded-full bg-[var(--active)] text-white shadow-lg ring-4 ring-[color-mix(in_srgb,var(--active)_25%,transparent)] transition-[transform,filter] hover:scale-105 hover:brightness-95 active:scale-95',
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

function ChatMessage({ message, t }) {
  const isUser = message.role === 'user'

  if (message.type === 'products') {
    return (
      <div className="flex flex-col items-start gap-1">
        <div className="max-w-full rounded-2xl rounded-bl-md bg-white px-2 py-2 shadow-sm ring-1 ring-black/5">
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {message.products.map((product) => (
              <li key={product.id} className="w-[7.5rem] shrink-0">
                <Link
                  to={`/products/${product.slug}`}
                  className="block rounded-lg transition-opacity hover:opacity-90"
                >
                  <img
                    src={product.image}
                    alt=""
                    className="size-[7.5rem] rounded-md object-cover"
                  />
                  <p className="mt-1.5 line-clamp-2 text-xs font-semibold text-[var(--primary-text)]">
                    {t(product.titleKey)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--secondary-text)]">
                    {t('constructionAssistant.priceLabel', {
                      price: t(product.priceKey),
                    })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <time className="text-[11px] text-[var(--secondary-text)]">
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
            ? 'rounded-br-md bg-[var(--active)] text-white'
            : 'rounded-bl-md bg-white text-[var(--primary-text)] shadow-sm ring-1 ring-black/5'
        }`}
      >
        {message.text}
      </div>
      <time className="text-[11px] text-[var(--secondary-text)]">
        {message.time}
      </time>
    </div>
  )
}
