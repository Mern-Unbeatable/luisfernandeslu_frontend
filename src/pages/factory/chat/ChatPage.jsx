import { useState } from 'react'
import Messenger from '@/components/common/messenger/Messenger'
import {
  DEMO_MESSENGER_CHATS,
  DEMO_MESSENGER_MESSAGES,
} from '@/data/demoData'

function formatNow() {
  return new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formToOffer(form) {
  const installments = form.installments || []
  const pricing = [
    { label: 'Total Price', value: form.totalPrice || '—' },
    {
      label: 'Installment',
      value: form.installmentMonths
        ? `${form.installmentMonths} months`
        : '—',
    },
  ]

  installments.forEach((row, index) => {
    const n = index + 1
    const suffix = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    const ordinal = `${n}${suffix[(v - 20) % 10] || suffix[v] || suffix[0]}`
    pricing.push({
      label: `${ordinal} Installment`,
      value: row.price || '—',
    })
    pricing.push({
      label: 'Quantity',
      value: row.quantity || '—',
    })
  })

  const first = installments[0]?.price || ''
  const totalNum = Number(String(form.totalPrice || '').replace(/[^0-9.]/g, ''))
  const firstNum = Number(String(first || '').replace(/[^0-9.]/g, ''))
  const remaining =
    totalNum && firstNum
      ? `€${(totalNum - firstNum).toLocaleString()}`
      : ''

  const months = Number(form.installmentMonths) || 0
  const monthly =
    remaining && months > 0
      ? `€${(Math.round(((totalNum - firstNum) / months) * 100) / 100).toLocaleString()}`
      : ''

  return {
    title: 'Offer Card',
    statusLabel: 'Awaiting their response',
    product: form.product || '—',
    quantity: form.totalQuantity || '',
    projectName: form.projectName || '',
    address: form.deliveryLocation || '',
    unloadingType: form.unloadingType || '',
    accessConditions: form.accessConditions || '',
    pricing,
    summary: {
      firstInstallment: first || '—',
      remainingBalance: remaining || '—',
      note:
        monthly && months
          ? `Pay ${monthly}/month for ${months} months`
          : '',
    },
  }
}

export default function ChatPage() {
  const [chats, setChats] = useState(DEMO_MESSENGER_CHATS)
  const [messagesByChat, setMessagesByChat] = useState(DEMO_MESSENGER_MESSAGES)
  const [activePartnerId, setActivePartnerId] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [actionMessageId, setActionMessageId] = useState(null)

  const activeChat =
    chats.find((chat) => chat.id === activePartnerId) || null
  const messages = messagesByChat[activePartnerId] || []

  const selectChat = (id) => {
    setActivePartnerId(id)
    if (!id) return
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, unreadCount: 0 } : chat,
      ),
    )
  }

  const sendMessage = async (text) => {
    const value = String(text || '').trim()
    if (!value || !activePartnerId) return false

    setIsSending(true)
    await new Promise((r) => setTimeout(r, 200))

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
  }

  const editMessage = async (messageId, text) => {
    const value = String(text || '').trim()
    if (!value || !activePartnerId) return false

    setActionMessageId(messageId)
    await new Promise((r) => setTimeout(r, 150))
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
  }

  const deleteMessage = async (messageId) => {
    if (!activePartnerId) return false

    setActionMessageId(messageId)
    await new Promise((r) => setTimeout(r, 150))
    setMessagesByChat((prev) => ({
      ...prev,
      [activePartnerId]: (prev[activePartnerId] || []).map((msg) =>
        msg.id === messageId ? { ...msg, isDeleted: true, text: '' } : msg,
      ),
    }))
    setActionMessageId(null)
    return true
  }

  const createOffer = (form) => {
    if (!activePartnerId) return

    const next = {
      id: `offer-${Date.now()}`,
      sender: 'me',
      type: 'offer',
      time: formatNow(),
      status: 'Delivered',
      offer: formToOffer(form),
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
              lastMessage: `Offer sent for ${form.product || 'product'}`,
              time: 'Just now',
            }
          : chat,
      ),
    )
  }

  const payOffer = (msg) => {
    if (!activePartnerId || !msg?.id) return
    setMessagesByChat((prev) => ({
      ...prev,
      [activePartnerId]: (prev[activePartnerId] || []).map((item) =>
        item.id === msg.id
          ? {
              ...item,
              offer: {
                ...item.offer,
                statusLabel: 'Paid',
              },
            }
          : item,
      ),
    }))
  }

  const negotiateOffer = (msg) => {
    if (!activePartnerId || !msg?.id) return
    setMessagesByChat((prev) => ({
      ...prev,
      [activePartnerId]: (prev[activePartnerId] || []).map((item) =>
        item.id === msg.id
          ? {
              ...item,
              offer: {
                ...item.offer,
                statusLabel: 'Negotiation requested',
              },
            }
          : item,
      ),
    }))
  }

  return (
    <div className="h-[calc(100vh-7rem)] min-h-[520px]">
      <Messenger
        chats={chats}
        messages={messages}
        activePartnerId={activePartnerId}
        activeChat={activeChat}
        onSelectChat={selectChat}
        onSend={sendMessage}
        onEditMessage={editMessage}
        onDeleteMessage={deleteMessage}
        onCreateOffer={createOffer}
        onPayNow={payOffer}
        onNegotiate={negotiateOffer}
        isSending={isSending}
        actionMessageId={actionMessageId}
        sidebarTitle="Recent Messages"
      />
    </div>
  )
}
