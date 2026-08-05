import { useCallback, useMemo, useState } from 'react'
import {
  DEMO_MESSENGER_CHATS,
  DEMO_MESSENGER_MESSAGES,
} from '@/data/demoData'

/**
 * Frontend-only chat state (mock). Swap internals later for API.
 */
export default function useMessages() {
  const [chats, setChats] = useState(DEMO_MESSENGER_CHATS)
  const [messagesByChat, setMessagesByChat] = useState(DEMO_MESSENGER_MESSAGES)
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
