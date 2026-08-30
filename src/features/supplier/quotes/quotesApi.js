import { baseApi } from "../../../services/api/baseApi";
import { pickList, pickPage, pickTotal } from "../apiError";

function parseNumberValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const cleaned = String(value ?? "")
    .replace(/[^0-9.-]+/g, "")
    .trim();
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatChatTime(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function resolveQuoteParticipant(quote = {}) {
  const participant =
    quote.company ??
    quote.buyer ??
    quote.user ??
    quote.partner ??
    quote.otherParty ??
    {};

  return {
    id:
      participant.id ??
      participant.userId ??
      participant.companyId ??
      quote.partnerId ??
      quote.userId ??
      quote.companyId ??
      "",
    name:
      participant.name ??
      participant.companyName ??
      participant.businessName ??
      quote.partnerName ??
      quote.name ??
      "Quote",
    avatar: participant.avatar ?? participant.image ?? participant.logo ?? null,
  };
}

function normalizeQuoteMessageText(item = {}) {
  const value =
    item.message ??
    item.text ??
    item.body ??
    item.content ??
    item.note ??
    item.comment ??
    "";

  return typeof value === "string" ? value : (value?.text ?? "");
}

function resolveMessageOffer(item = {}) {
  const offerSource = item.offer ?? item.offerCard ?? item.card ?? null;
  if (!offerSource && item.type !== "OFFER" && item.messageType !== "OFFER") {
    return null;
  }

  const source = offerSource ?? {};
  const pricing = Array.isArray(source.pricing)
    ? source.pricing.map((row) => ({
        label: row.label ?? "Price",
        value: row.value ?? row.amount ?? "—",
        icon: row.icon ?? "dollar",
      }))
    : [];

  const totalQuantity =
    source.totalQuantity ??
    source.quantity ??
    item.totalQuantity ??
    item.quantity ??
    "";

  const summary = source.summary ?? {};

  return {
    title: source.title ?? "Offer Card",
    statusLabel:
      source.statusLabel ??
      (item.action === "accepted" ? "Accepted" : "Pending Response"),
    product:
      source.productName ??
      source.product ??
      source.name ??
      item.productName ??
      item.product ??
      "—",
    quantity:
      totalQuantity && source.quantityUnit
        ? `${totalQuantity} ${source.quantityUnit}`
        : totalQuantity
          ? String(totalQuantity)
          : "—",
    projectName:
      source.projectName ?? source.project ?? item.projectName ?? "—",
    address:
      source.deliveryLocation ?? source.address ?? item.deliveryLocation ?? "—",
    unloadingType: source.unloadingType ?? item.unloadingType ?? "—",
    accessConditions: source.accessConditions ?? item.accessConditions ?? "—",
    pricing,
    summary: {
      firstInstallment:
        summary.firstInstallment ??
        source.firstInstallment ??
        pricing[0]?.value ??
        "—",
      remainingBalance:
        summary.remainingBalance ?? source.remainingBalance ?? "—",
      note: summary.note ?? source.note ?? "",
    },
  };
}

function mapQuoteChatItem(item) {
  if (!item || typeof item !== "object") return null;

  const quoteId = item.id ?? item.quoteId ?? item._id ?? "";
  const participant = resolveQuoteParticipant(item);
  const lastText =
    item.lastMessage ??
    item.latestMessage ??
    item.message ??
    item.lastText ??
    item.preview ??
    "";

  return {
    id: String(quoteId),
    name:
      item.title ??
      item.subject ??
      participant.name ??
      item.productName ??
      "Quote",
    lastMessage: String(lastText || "New quote request"),
    time: formatChatTime(
      item.updatedAt ??
        item.lastMessageAt ??
        item.lastActivityAt ??
        item.createdAt ??
        item.date,
    ),
    unreadCount: Number(item.unreadCount ?? item.unread ?? 0) || 0,
    online: Boolean(item.online ?? item.isOnline ?? false),
    partner: {
      id: participant.id,
      name: participant.name,
      avatar: participant.avatar,
    },
    raw: item,
  };
}

export function mapSupplierQuoteChatList(payload, fallbackPage = 1) {
  const quotes = pickList(payload, ["quotes", "chats", "items", "data"])
    .map(mapQuoteChatItem)
    .filter(Boolean);

  const total = pickTotal(payload, quotes.length);
  const page = pickPage(payload, fallbackPage);
  const limitValue =
    payload?.limit ?? payload?.pagination?.limit ?? payload?.meta?.limit ?? 12;
  const limit = Number(limitValue || 12) || 12;

  return {
    chats: quotes,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil((total || quotes.length) / limit)),
  };
}

export function mapSupplierQuoteThread(payload) {
  const quote = payload?.quote ?? payload?.data ?? payload ?? {};
  if (!quote || typeof quote !== "object") return null;

  const participant = resolveQuoteParticipant(quote);
  return {
    id: String(quote.id ?? quote.quoteId ?? ""),
    name:
      quote.title ??
      quote.subject ??
      participant.name ??
      quote.productName ??
      "Quote",
    lastMessage:
      quote.lastMessage ??
      quote.latestMessage ??
      quote.message ??
      quote.preview ??
      "New quote request",
    time: formatChatTime(
      quote.updatedAt ??
        quote.lastMessageAt ??
        quote.lastActivityAt ??
        quote.createdAt ??
        quote.date,
    ),
    unreadCount: Number(quote.unreadCount ?? quote.unread ?? 0) || 0,
    online: Boolean(quote.online ?? quote.isOnline ?? false),
    partner: {
      id: participant.id,
      name: participant.name,
      avatar: participant.avatar,
    },
    raw: quote,
  };
}

export function mapSupplierQuoteMessages(payload) {
  const list = pickList(payload, ["messages", "items", "data"]);

  const mapped = list.map((message, index) => {
    const isMine =
      Boolean(message?.isMine ?? message?.mine ?? false) ||
      ["supplier", "seller", "me"].includes(
        String(
          message?.senderRole ?? message?.senderType ?? message?.sender ?? "",
        ).toLowerCase(),
      );

    const offer = resolveMessageOffer(message);
    const text = normalizeQuoteMessageText(message);

    return {
      id: String(message?.id ?? message?._id ?? `${index}-${Date.now()}`),
      sender: isMine ? "me" : "them",
      text,
      time: formatChatTime(
        message?.createdAt ??
          message?.sentAt ??
          message?.timestamp ??
          new Date(),
      ),
      status: isMine ? (message?.status ?? "Sent") : undefined,
      type: offer ? "offer" : (message?.type ?? undefined),
      offer,
      partner: resolveQuoteParticipant(message),
      raw: message,
    };
  });

  return mapped.filter((message) => message || message?.text || message?.offer);
}

export function mapQuoteOfferPayload(form = {}) {
  const installments = Array.isArray(form.installments)
    ? form.installments
    : [];

  return {
    warehouseLocation: form.warehouse ?? form.warehouseLocation ?? "",
    productName: form.product ?? form.productName ?? "",
    totalQuantity: parseNumberValue(form.totalQuantity),
    quantityUnit: form.quantityUnit ?? form.unit ?? "bags",
    projectName: form.projectName ?? "",
    deliveryLocation: form.deliveryLocation ?? form.address ?? "",
    unloadingType: form.unloadingType ?? "",
    accessConditions: form.accessConditions ?? "",
    totalPrice: parseNumberValue(form.totalPrice),
    installmentMonths: parseNumberValue(form.installmentMonths),
    installments: installments.map((row) => ({
      price: parseNumberValue(row?.price),
      quantity: parseNumberValue(row?.quantity),
    })),
  };
}

export const supplierQuoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierQuoteChats: builder.query({
      query: ({ page = 1, limit = 12, status } = {}) => ({
        url: "/api/quotes",
        method: "GET",
        params: {
          page,
          limit,
          ...(status && status !== "all" ? { status } : {}),
        },
      }),
      transformResponse: (response, _meta, arg) =>
        mapSupplierQuoteChatList(response, arg?.page ?? 1),
      providesTags: ["Quote"],
    }),

    getSupplierQuoteById: builder.query({
      query: (quoteId) => ({
        url: `/api/quotes/${quoteId}`,
        method: "GET",
      }),
      transformResponse: (response) => mapSupplierQuoteThread(response),
      providesTags: (_result, _error, arg) => [{ type: "Quote", id: arg }],
    }),

    getSupplierQuoteMessages: builder.query({
      query: ({ quoteId, after } = {}) => ({
        url: `/api/quotes/${quoteId}/messages`,
        method: "GET",
        params: after ? { after } : undefined,
      }),
      transformResponse: (response) => mapSupplierQuoteMessages(response),
      providesTags: (_result, _error, arg) => [
        { type: "Quote", id: `${arg?.quoteId}-messages` },
      ],
    }),

    sendSupplierQuoteMessage: builder.mutation({
      query: ({ quoteId, message }) => ({
        url: `/api/quotes/${quoteId}/messages`,
        method: "POST",
        data: { message },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Quote", id: arg?.quoteId },
        { type: "Quote", id: `${arg?.quoteId}-messages` },
      ],
    }),

    createSupplierQuoteOffer: builder.mutation({
      query: ({ quoteId, payload }) => ({
        url: `/api/quotes/${quoteId}/offers`,
        method: "POST",
        data: mapQuoteOfferPayload(payload),
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Quote", id: arg?.quoteId },
        { type: "Quote", id: `${arg?.quoteId}-messages` },
      ],
    }),
  }),
});

export const {
  useGetSupplierQuoteChatsQuery,
  useGetSupplierQuoteByIdQuery,
  useGetSupplierQuoteMessagesQuery,
  useSendSupplierQuoteMessageMutation,
  useCreateSupplierQuoteOfferMutation,
} = supplierQuoteApi;
