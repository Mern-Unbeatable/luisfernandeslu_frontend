import { useCallback, useMemo, useState } from 'react'
import {
  DEMO_MESSENGER_CHATS,
  DEMO_MESSENGER_MESSAGES,
  DEMO_SUPPLIER_MESSENGER_CHATS,
  DEMO_SUPPLIER_MESSENGER_MESSAGES,
} from '@/data/demoData'

/**
 * Frontend-only chat state (mock). Swap internals later for API.
 */
export default function useMessages({ variant = 'default' } = {}) {
  const isSupplier = variant === 'supplier'
  const initialChats = isSupplier
    ? DEMO_SUPPLIER_MESSENGER_CHATS
    : DEMO_MESSENGER_CHATS
  const initialMessages = isSupplier
    ? DEMO_SUPPLIER_MESSENGER_MESSAGES
    : DEMO_MESSENGER_MESSAGES
  const defaultActiveId = isSupplier ? 'c-ope' : null

  const [chats, setChats] = useState(initialChats)
  const [messagesByChat, setMessagesByChat] = useState(initialMessages)
  const [activePartnerId, setActivePartnerId] = useState(defaultActiveId)
  const [isSending, setIsSending] = useState(false)
  const [isPartnerTyping] = useState(false)
  const [actionMessageId, setActionMessageId] = useState(null)
  const [isLoading] = useState(false)

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activePartnerId) || null,
    [chats, activePartnerId],
  )

  const messages = messagesByChat[activePartnerId] || []

  const selectChat = useCallback((id) => {
    setActivePartnerId(id)
    if (!id) return
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, unreadCount: 0 } : chat,
      ),
    )
  }, [])

  const sendMessage = useCallback(
    async (text) => {
      const value = String(text || '').trim()
      if (!value || !activePartnerId) return false
      setIsSending(true)
      await new Promise((r) => setTimeout(r, 250))

      const next = {
        id: `local-${Date.now()}`,
        sender: 'me',
        text: value,
        time: formatNow(),
        status: 'Sent',
      }

      setMessagesByChat((prev) => ({
        ...prev,
        [activePartnerId]: [...(prev[activePartnerId] || []), next],
      }))
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activePartnerId
            ? { ...chat, lastMessage: value, time: 'Just now' }
            : chat,
        ),
      )
      setIsSending(false)
      return true
    },
    [activePartnerId],
  )

  const editMessage = useCallback(
    async (messageId, text) => {
      const value = String(text || '').trim()
      if (!value || !activePartnerId) return false
      setActionMessageId(messageId)
      await new Promise((r) => setTimeout(r, 200))
      setMessagesByChat((prev) => ({
        ...prev,
        [activePartnerId]: (prev[activePartnerId] || []).map((msg) =>
          msg.id === messageId
            ? { ...msg, text: value, editedAt: formatNow() }
            : msg,
        ),
      }))
      setActionMessageId(null)
      return true
    },
    [activePartnerId],
  )

  const deleteMessage = useCallback(
    async (messageId) => {
      if (!activePartnerId) return false
      setActionMessageId(messageId)
      await new Promise((r) => setTimeout(r, 200))
      setMessagesByChat((prev) => ({
        ...prev,
        [activePartnerId]: (prev[activePartnerId] || []).map((msg) =>
          msg.id === messageId
            ? { ...msg, isDeleted: true, text: '' }
            : msg,
        ),
      }))
      setActionMessageId(null)
      return true
    },
    [activePartnerId],
  )

  const handleTyping = useCallback(() => {}, [])
  const stopTyping = useCallback(() => {}, [])

  const createOffer = useCallback(
    async (form) => {
      if (!activePartnerId) return false
      setIsSending(true)
      await new Promise((r) => setTimeout(r, 200))

      const pricing = (form.installments || []).flatMap((row, index) => {
        const n = index + 1
        const ord =
          n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`
        return [
          {
            label: `${ord} Installment`,
            value: row.price ? `$${row.price}` : '—',
            icon: 'dollar',
          },
          {
            label: 'Quantity',
            value: row.quantity ? `${row.quantity} Bags` : '—',
          },
        ]
      })

      if (form.totalPrice) {
        pricing.unshift(
          { label: 'Total Price', value: `$${form.totalPrice}`, icon: 'dollar' },
          {
            label: 'Installment',
            value: form.installmentMonths
              ? `${form.installmentMonths} months`
              : '—',
            icon: 'calendar',
          },
        )
      }

      const firstPrice = form.installments?.[0]?.price
      const offer = {
        title: 'Offer Card',
        statusLabel: 'Awaiting their response',
        product: form.product || '—',
        quantity: form.totalQuantity ? `${form.totalQuantity} Bags` : '—',
        projectName: form.projectName || '—',
        address: form.deliveryLocation || '—',
        unloadingType: form.unloadingType || '—',
        accessConditions: form.accessConditions || '—',
        pricing,
        summary: firstPrice
          ? {
              firstInstallment: `$${firstPrice}`,
              remainingBalance: form.totalPrice
                ? `$${Math.max(
                    Number(form.totalPrice) - Number(firstPrice),
                    0,
                  )}`
                : '—',
              note: form.installmentMonths
                ? `Pay in ${form.installmentMonths} installments`
                : '',
            }
          : undefined,
      }

      const next = {
        id: `offer-${Date.now()}`,
        sender: 'me',
        type: 'offer',
        time: formatNow(),
        status: 'Delivered',
        offer,
      }

      setMessagesByChat((prev) => ({
        ...prev,
        [activePartnerId]: [...(prev[activePartnerId] || []), next],
      }))
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activePartnerId
            ? {
                ...chat,
                lastMessage: `Offer: ${form.product || 'Product'}`,
                time: 'Just now',
              }
            : chat,
        ),
      )
      setIsSending(false)
      return true
    },
    [activePartnerId],
  )

  return {
    chats,
    messages,
    activePartnerId,
    activeChat,
    selectChat,
    sendMessage,
    editMessage,
    deleteMessage,
    createOffer,
    handleTyping,
    stopTyping,
    isPartnerTyping,
    isSending,
    actionMessageId,
    isLoading,
    sharedInbox: false,
  }
}

function formatNow() {
  return new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}
