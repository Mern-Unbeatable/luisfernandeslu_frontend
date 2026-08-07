import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import Messenger from '@/components/common/messenger/Messenger';
import useMessages from '@/components/common/messenger/useMessages';

export default function ChatPage() {
  const { t } = useTranslation();
  const state = useMessages({ variant: 'supplier' });

  // TODO: replace useMessages demo state with supplier chat API

  return (
    <>
      <Seo title={t('panel.supplierChat.title')} />

      <div className="h-[min(720px,calc(100dvh-10rem))] min-h-[480px] w-full">
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
          onCreateOffer={state.createOffer}
          isPartnerTyping={state.isPartnerTyping}
          isSending={state.isSending}
          isLoading={state.isLoading}
          actionMessageId={state.actionMessageId}
          sidebarTitle={t('panel.supplierChat.sidebarTitle')}
          showSidebarEdit
        />
      </div>
    </>
  );
}
