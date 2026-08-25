import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import Messenger from "@/components/common/messenger/Messenger";
import {
  useCreateSupplierQuoteOfferMutation,
  useGetSupplierQuoteByIdQuery,
  useGetSupplierQuoteChatsQuery,
  useGetSupplierQuoteMessagesQuery,
  useSendSupplierQuoteMessageMutation,
} from "@/features/supplier/quotes/quotesApi";

export default function ChatPage() {
  const { t } = useTranslation();
  const [activeQuoteId, setActiveQuoteId] = useState(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [actionMessageId, setActionMessageId] = useState(null);

  const { data: chatsResponse, isLoading: isChatsLoading } =
    useGetSupplierQuoteChatsQuery({ page: 1, limit: 12 });
  const chats = useMemo(() => chatsResponse?.chats ?? [], [chatsResponse]);

  const { data: selectedThread } = useGetSupplierQuoteByIdQuery(activeQuoteId, {
    skip: !activeQuoteId,
  });

  const resolvedActiveQuoteId = activeQuoteId ?? chats[0]?.id ?? null;

  const { data: messages = [], isLoading: isMessagesLoading } =
    useGetSupplierQuoteMessagesQuery(
      { quoteId: resolvedActiveQuoteId },
      { skip: !resolvedActiveQuoteId },
    );

  const [sendMessageMutation, { isLoading: isSendingMessage }] =
    useSendSupplierQuoteMessageMutation();
  const [createOfferMutation, { isLoading: isCreatingOffer }] =
    useCreateSupplierQuoteOfferMutation();

  const activeChat = useMemo(() => {
    const activeFromList = chats.find(
      (chat) => chat.id === resolvedActiveQuoteId,
    );
    return selectedThread ?? activeFromList ?? null;
  }, [selectedThread, resolvedActiveQuoteId, chats]);

  const selectChat = useCallback((id) => {
    setActiveQuoteId(id);
    setIsPartnerTyping(false);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const value = String(text || "").trim();
      if (!value || !resolvedActiveQuoteId) return false;

      await sendMessageMutation({
        quoteId: resolvedActiveQuoteId,
        message: value,
      });
      return true;
    },
    [resolvedActiveQuoteId, sendMessageMutation],
  );

  const editMessage = useCallback(async () => false, []);
  const deleteMessage = useCallback(async () => false, []);
  const handleTyping = useCallback(() => {
    setIsPartnerTyping(true);
  }, []);
  const stopTyping = useCallback(() => {
    setIsPartnerTyping(false);
  }, []);

  const createOffer = useCallback(
    async (form) => {
      if (!resolvedActiveQuoteId) return false;

      await createOfferMutation({
        quoteId: resolvedActiveQuoteId,
        payload: form,
      });

      return true;
    },
    [resolvedActiveQuoteId, createOfferMutation],
  );

  const handleSendMessage = useCallback(
    async (text) => {
      setActionMessageId(null);
      return sendMessage(text);
    },
    [sendMessage],
  );

  return (
    <>
      <Seo title={t("panel.supplierChat.title")} />

      <div className="h-[min(720px,calc(100dvh-10rem))] min-h-[780px] w-full">
        <Messenger
          className="h-full shadow-sm"
          chats={chats}
          messages={messages}
          activePartnerId={resolvedActiveQuoteId}
          activeChat={activeChat}
          onSelectChat={selectChat}
          onSend={handleSendMessage}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
          onTyping={handleTyping}
          onStopTyping={stopTyping}
          onCreateOffer={createOffer}
          isPartnerTyping={isPartnerTyping}
          isSending={isSendingMessage || isCreatingOffer}
          isLoading={isChatsLoading || isMessagesLoading}
          actionMessageId={actionMessageId}
          sidebarTitle={t("panel.supplierChat.sidebarTitle")}
          showSidebarEdit
        />
      </div>
    </>
  );
}
