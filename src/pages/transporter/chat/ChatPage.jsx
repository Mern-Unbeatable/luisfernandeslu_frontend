import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import Messenger from '@/components/common/messenger/Messenger'
import useMessages from '@/components/common/messenger/useMessages'

export default function ChatPage() {
  const { t } = useTranslation()
  const state = useMessages()

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
