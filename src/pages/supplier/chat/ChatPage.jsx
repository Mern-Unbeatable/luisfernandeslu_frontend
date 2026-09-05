import { useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import Messenger from "@/components/common/messenger/Messenger";
import useLiveChat from "@/features/chat/useLiveChat";
import { useCreateSupplierQuoteOfferMutation } from "@/features/supplier/quotes/quotesApi";

export default function ChatPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const state = useLiveChat();

  const [createOfferMutation, { isLoading: isCreatingOffer }] =
    useCreateSupplierQuoteOfferMutation();

  // Open thread from URL params (e.g. from buy-from-factory or quote notification)
  useEffect(() => {
    if (!state.isSocketConnected) return;

    const params = Object.fromEntries(searchParams.entries())
    if (params.type) {
      state.openThread({
        type: params.type,
        quoteRequestId: params.quoteId,
        productId: params.productId,
        orderId: params.orderId,
        peerUserId: params.peerUserId,
      })
    } else if (Object.keys(params).length === 0) {
      // They clicked the sidebar 'Chat' link which has no params, so we reset the selected chat
      state.selectChat(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, state.isSocketConnected])

  const createOffer = useCallback(
    async (form) => {
      if (!state.activeChatId) return false;
      const activeThread = state.activeChat;
      // Get the quote ID from the active thread's raw data
      const quoteId = activeThread?.raw?.quoteRequestId || state.activeChatId;
      await createOfferMutation({
        quoteId,
        payload: form,
      });
      return true;
    },
    [state.activeChatId, state.activeChat, createOfferMutation],
  );

  return (
    <>
      <Seo title={t("panel.supplierChat.title")} />

      <div className="h-[min(720px,calc(100dvh-10rem))] min-h-[780px] w-full">
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
          onCreateOffer={state.activeChat?.raw?.type === 'QUOTE' ? createOffer : undefined}
          onPayNow={(msg) => {
            const quoteId = state.activeChat?.raw?.quoteRequestId || state.activeChat?.id
            const chatType = state.activeChat?.raw?.type
            const stateNav = { directBuy: { offerId: msg?.offer?.id, offer: msg?.offer, quoteId, chatType } }
            navigate('/checkout/company', { state: stateNav })
          }}
          isPartnerTyping={state.isPartnerTyping}
          isSending={state.isSending || isCreatingOffer}
          isLoading={state.isLoading}
          actionMessageId={state.actionMessageId}
          sidebarTitle={t("panel.supplierChat.sidebarTitle")}
        />
      </div>
    </>
  );
}
