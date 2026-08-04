import { useCallback, useMemo, useState } from 'react'

const MOCK_CHATS = [
  {
    id: 'c1',
    name: 'TechPrint Hub',
    lastMessage: 'Offer sent for Portland Cement',
    time: '7:25pm',
    unreadCount: 0,
    online: true,
    partner: { id: 'p1', name: 'TechPrint Hub', avatar: null },
  },
  {
    id: 'c2',
    name: 'Ope',
    lastMessage: 'Looking forward to your reply',
    time: '6:21pm',
    unreadCount: 0,
    online: true,
    partner: { id: 'p2', name: 'Ope', avatar: null },
  },
  {
    id: 'c3',
    name: '3D Maker Store',
    lastMessage: 'Thanks for the update',
    time: 'Yesterday',
    unreadCount: 0,
    online: false,
    partner: { id: 'p3', name: '3D Maker Store', avatar: null },
  },
  {
    id: 'c4',
    name: 'SteelWorks Inc',
    lastMessage: 'Can we schedule a call?',
    time: 'Mon',
    unreadCount: 1,
    online: false,
    partner: { id: 'p4', name: 'SteelWorks Inc', avatar: null },
  },
]

const SAMPLE_OFFER = {
  title: 'Offer Card',
  statusLabel: 'Pending Response',
  product: 'Cements',
  quantity: '180 Bags',
  projectName: 'Downtown Office Complex',
  address: '123 Main St, Downtown District',
  unloadingType: 'Tipper truck',
  accessConditions: 'Manual Unloading',
  pricing: [
    { label: 'Total Price', value: '$125,500' },
    { label: 'Installment', value: '10 months' },
    { label: '1st Installment', value: '$125,500' },
    { label: 'Quantity', value: '30 Bags' },
    { label: '2nd Installment', value: '$125,500' },
    { label: 'Quantity', value: '30 Bags' },
  ],
  summary: {
    firstInstallment: '$25,100',
    remainingBalance: '$100,400',
    note: 'Pay $10,040/month for 10 months',
  },
}

const MOCK_MESSAGES = {
  c1: [
    {
      id: 'm1',
      sender: 'them',
      text: 'Hi — we need cement for the riverside project.',
      time: '4:05 PM',
      partner: { id: 'p1', name: 'TechPrint Hub' },
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'Sure. I can prepare an offer with installment options.',
      time: '4:12 PM',
      status: 'Read',
    },
  ],
  c2: [
    {
      id: 'm10',
      sender: 'them',
      text: 'Hey, are you available for a quick quote on bulk cement?',
      time: '6:05 PM',
      partner: { id: 'p2', name: 'Ope' },
    },
    {
      id: 'm11',
      sender: 'me',
      text: 'Yes — here is a detailed offer for your project.',
      time: '6:12 PM',
      status: 'Read',
    },
    {
      id: 'm12',
      sender: 'me',
      type: 'offer',
      time: '6:21 PM',
      status: 'Delivered',
      offer: SAMPLE_OFFER,
    },
  ],
}

/**
 * Frontend-only chat state (mock). Swap internals later for API.
 */
export default function useMessages() {
  const [chats, setChats] = useState(MOCK_CHATS)
  const [messagesByChat, setMessagesByChat] = useState(MOCK_MESSAGES)
  const [activePartnerId, setActivePartnerId] = useState(null)
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

  return {
    chats,
    messages,
    activePartnerId,
    activeChat,
    selectChat,
    sendMessage,
    editMessage,
    deleteMessage,
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
