import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import Messenger from '@/components/common/messenger/Messenger'
import useLiveChat from '@/features/chat/useLiveChat'

/** Default thread on load (optional). */
const DEFAULT_CHAT_ID = 'c1'

export default function ChatPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const state = useLiveChat()

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    if (params.type || params.chat) {
      state.openThread({
        chatId: params.chat,
        type: params.type,
        quoteId: params.quoteId,
        orderId: params.orderId,
        productId: params.productId,
        peerUserId: params.peerUserId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <>
      <Seo title={t('panel.nav.chat')} />

      <div className="h-[calc(100vh-7rem)] min-h-[520px]">
        <Messenger
          className="h-full shadow-sm"
          chats={state.chats}
          messages={state.messages}
          activePartnerId={state.activePartnerId}
          activeChat={state.activeChat}
          onSelectChat={state.selectChat}
          onSend={state.sendMessage}
          onEditMessage={state.editMessage}
          onDeleteMessage={state.deleteMessage}
          onTyping={state.handleTyping}
          onStopTyping={state.stopTyping}
          isPartnerTyping={state.isPartnerTyping}
          isSending={state.isSending}
          isLoading={state.isLoading}
          actionMessageId={state.actionMessageId}
          sidebarTitle={t('messagesPage.sidebarTitle')}
        />
      </div>
    </>
  )
}
