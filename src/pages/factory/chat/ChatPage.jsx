import { useTranslation } from 'react-i18next'
import Messenger from '@/components/common/messenger/Messenger'
import useLiveChat from '@/features/chat/useLiveChat'

export default function ChatPage() {
  const { t } = useTranslation()
  const state = useLiveChat()

  return (
    <div className="h-[calc(100vh-7rem)] min-h-[520px]">
      <Messenger
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
        onCreateOffer={state.createOffer}
        isPartnerTyping={state.isPartnerTyping}
        isSending={state.isSending}
        isLoading={state.isLoading}
        actionMessageId={state.actionMessageId}
        sidebarTitle="Recent Messages"
      />
    </div>
  )
}
