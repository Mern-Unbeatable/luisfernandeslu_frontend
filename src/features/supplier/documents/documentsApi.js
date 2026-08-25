import { baseApi } from "../../../services/api/baseApi";
import {
  formatEuro,
  pickList,
  pickPage,
  pickTotal,
} from "../apiError";

function formatDateValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function resolveDocumentId(item = {}) {
  return String(
    item.id ??
      item._id ??
      item.documentId ??
      item.invoiceNumber ??
      item.number ??
      item.reference ??
      "",
  );
}

function resolveDocumentListItem(item) {
  if (!item || typeof item !== "object") return null;

  const documentId =
    item.documentId ??
    item.invoiceNumber ??
    item.number ??
    item.reference ??
    resolveDocumentId(item);

  const order = item.order ?? {};
  const customer = item.customer ?? item.company ?? item.buyer ?? order.customer ?? order.company ?? {};
  const amountValue =
    item.amount ??
    item.total ??
    item.totalPrice ??
    item.netTotal ??
    item.grossTotal ??
    item.value ??
    order.total ??
    order.totalPrice ??
    0;

  return {
    id: resolveDocumentId(item) || String(documentId),
    documentId: String(documentId),
    type: String(item.type ?? item.documentType ?? "invoice").toLowerCase(),
    orderId: String(
      item.orderId ??
        item.orderNumber ??
        order.orderId ??
        order.orderNumber ??
        order.reference ??
        "",
    ),
    customer: String(
      item.customerName ??
        item.companyName ??
        item.buyerName ??
        customer.name ??
        customer.businessName ??
        "",
    ),
    amount: formatEuro(amountValue),
    date: formatDateValue(item.date ?? item.createdAt ?? item.generatedAt ?? item.invoiceDate),
    raw: item,
  };
}

function resolveEligibleOrderItem(item) {
  if (!item || typeof item !== "object") return null;

  const value =
    item.orderId ??
    item.orderNumber ??
    item.reference ??
    item.id ??
    item.value ??
    "";
  if (!value) return null;

  const customer = item.customer ?? item.company ?? item.buyer ?? {};
  const labelBase = String(
    item.orderNumber ?? item.orderId ?? item.reference ?? value,
  );
  const customerLabel =
    customer.name ?? customer.businessName ?? item.customerName ?? item.companyName ?? "";

  return {
    value: String(value),
    label: customerLabel ? `${labelBase} - ${customerLabel}` : labelBase,
    raw: item,
  };
}

function resolveDocumentDetail(payload) {
  const document = payload?.document ?? payload?.data ?? payload ?? {};
  if (!document || typeof document !== "object") return null;

  const order = document.order ?? {};
  const customer = document.customer ?? document.company ?? document.buyer ?? order.customer ?? order.company ?? {};
  const amountValue =
    document.amount ??
    document.total ??
    document.totalPrice ??
    document.netTotal ??
    document.grossTotal ??
    order.total ??
    order.totalPrice ??
    0;

  return {
    id: resolveDocumentId(document),
    documentId:
      document.documentId ??
      document.invoiceNumber ??
      document.number ??
      document.reference ??
      resolveDocumentId(document),
    orderId: String(
      document.orderId ??
        document.orderNumber ??
        order.orderId ??
        order.orderNumber ??
        order.reference ??
        "",
    ),
    customer: String(
      document.customerName ??
        document.companyName ??
        document.buyerName ??
        customer.name ??
        customer.businessName ??
        "",
    ),
    amount: formatEuro(amountValue),
    date: formatDateValue(document.date ?? document.createdAt ?? document.generatedAt ?? document.invoiceDate),
    type: String(document.type ?? document.documentType ?? "invoice").toLowerCase(),
    totals: document.totals ?? null,
    order,
    raw: document,
  };
}

export const supplierDocumentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierDocumentStats: builder.query({
      query: () => ({
        url: "/api/supplier/documents/stats",
        method: "GET",
      }),
      transformResponse: (response) => response?.stats ?? response ?? {},
      providesTags: [{ type: "Document", id: "STATS" }],
    }),

    getSupplierDocuments: builder.query({
      query: ({ page = 1, limit = 7, search = "" } = {}) => ({
        url: "/api/supplier/documents",
        method: "GET",
        params: { page, limit, search },
      }),
      transformResponse: (response, _meta, arg) => {
        const documents = pickList(response, ["documents", "items", "data"])
          .map(resolveDocumentListItem)
          .filter(Boolean);
        const total = pickTotal(response, documents.length);
        const page = pickPage(response, arg?.page ?? 1);
        const limitValue =
          response?.limit ?? response?.pagination?.limit ?? response?.meta?.limit ?? arg?.limit ?? 7;
        const limit = Number(limitValue || 7) || 7;

        return {
          documents,
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil((total || documents.length) / limit)),
        };
      },
      providesTags: (result) => [
        { type: "Document", id: "LIST" },
        ...(result?.documents ?? []).map((document) => ({
          type: "Document",
          id: document.id,
        })),
      ],
    }),

    getSupplierDocumentEligibleOrders: builder.query({
      query: ({ search = "" } = {}) => ({
        url: "/api/supplier/documents/eligible-orders",
        method: "GET",
        params: { search },
      }),
      transformResponse: (response) =>
        pickList(response, ["orders", "items", "data"])
          .map(resolveEligibleOrderItem)
          .filter(Boolean),
      providesTags: [{ type: "Document", id: "ELIGIBLE" }],
    }),

    generateSupplierDocument: builder.mutation({
      query: ({ orderId }) => ({
        url: "/api/supplier/documents",
        method: "POST",
        data: { orderId },
      }),
      invalidatesTags: [
        { type: "Document", id: "LIST" },
        { type: "Document", id: "STATS" },
        { type: "Document", id: "ELIGIBLE" },
      ],
    }),

    getSupplierDocumentById: builder.query({
      query: (documentId) => ({
        url: `/api/supplier/documents/${documentId}`,
        method: "GET",
      }),
      transformResponse: (response) => resolveDocumentDetail(response),
      providesTags: (_result, _error, arg) => [{ type: "Document", id: arg }],
    }),

    getSupplierDocumentPdf: builder.query({
      query: ({ documentId, audience } = {}) => ({
        url: `/api/supplier/documents/${documentId}/pdf`,
        method: "GET",
        params: audience ? { audience } : undefined,
        responseType: "blob",
      }),
    }),
  }),
});

export const {
  useGetSupplierDocumentStatsQuery,
  useGetSupplierDocumentsQuery,
  useGetSupplierDocumentEligibleOrdersQuery,
  useGenerateSupplierDocumentMutation,
  useGetSupplierDocumentByIdQuery,
  useLazyGetSupplierDocumentPdfQuery,
} = supplierDocumentsApi;