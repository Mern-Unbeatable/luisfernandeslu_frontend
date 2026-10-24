import { useCallback, useMemo, useState } from 'react'
import {
  DEMO_MESSENGER_CHATS,
  DEMO_MESSENGER_MESSAGES,
  DEMO_SUPPLIER_MESSENGER_CHATS,
  DEMO_SUPPLIER_MESSENGER_MESSAGES,
} from '@/data/demoData'
import i18n from '@/i18n'

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

  const openThread = useCallback((params) => {
    if (!params.type && !params.chatId) return
    
    const threadId = params.chatId || params.quoteId || params.orderId || params.productId || params.peerUserId || `mock-${Date.now()}`
    
    setChats((prev) => {
      if (prev.find(c => c.id === threadId)) return prev
      
      let name = i18n.t('fallback.newChat')
      if (params.type === 'QUOTE') name = i18n.t('fallback.quoteRequest')
      else if (params.type === 'ORDER_TRANSPORT') name = i18n.t('fallback.orderTransport')
      else if (params.type === 'FACTORY_SUPPLIER') name = i18n.t('fallback.factorySupplier')
      else if (params.type === 'ADMIN_SUPPORT') name = i18n.t('fallback.adminSupport')

      return [
        {
          id: threadId,
          name,
          avatar: '/images/avatar-placeholder.png',
          lastMessage: i18n.t('fallback.chatOpened'),
          time: i18n.t('fallback.justNow'),
          unreadCount: 0,
          status: 'online',
          type: params.type,
        },
        ...prev
      ]
    })
    
    setActivePartnerId(threadId)
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
            ? { ...chat, lastMessage: value, time: i18n.t('fallback.justNow') }
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
        return [
          {
            label: i18n.t('fallback.installmentN', { n: index + 1 }),
            value: row.price ? `€${row.price}` : '—',
            icon: 'dollar',
          },
          {
            label: i18n.t('ui.quantity'),
            value: row.quantity ? i18n.t('fallback.bagsCount', { count: row.quantity }) : '—',
          },
        ]
      })

      if (form.totalPrice) {
        pricing.unshift(
          { label: i18n.t('ui.totalPrice'), value: `€${form.totalPrice}`, icon: 'dollar' },
          {
            label: i18n.t('ui.installment'),
            value: form.installmentMonths
              ? i18n.t('fallback.monthsCount', { count: form.installmentMonths })
              : '—',
            icon: 'calendar',
          },
        )
      }

      const firstPrice = form.installments?.[0]?.price
      const totalNum = Number(form.totalPrice) || 0
      const firstNum = Number(firstPrice) || 0
      const remaining = Math.max(totalNum - firstNum, 0)
      const installMonths = parseInt(form.installmentMonths, 10) || 0
      const remainingMonths = firstPrice ? Math.max(installMonths - 1, 0) : installMonths
      const monthly = remainingMonths > 0 ? (remaining / remainingMonths).toFixed(2) : null

      const offer = {
        title: i18n.t('fallback.offerCard'),
        statusLabel: i18n.t('fallback.awaitingTheirResponse'),
        product: form.product || '—',
        quantity: form.totalQuantity ? i18n.t('fallback.bagsCount', { count: form.totalQuantity }) : '—',
        projectName: form.projectName || '—',
        address: form.deliveryLocation || '—',
        unloadingType: form.unloadingType || '—',
        accessConditions: form.accessConditions || '—',
        pricing,
        summary: firstPrice
          ? {
              firstInstallment: `€${firstPrice}`,
              remainingBalance: form.totalPrice
                ? `€${remaining.toFixed(2)}`
                : '—',
              note: monthly
                ? i18n.t(remainingMonths === 1 ? 'fallback.payMonthlyOne' : 'fallback.payMonthly', { amount: monthly, count: remainingMonths })
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
                lastMessage: i18n.t('fallback.offerFor', { product: form.product || i18n.t('ui.product') }),
                time: i18n.t('fallback.justNow'),
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
    openThread,
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
