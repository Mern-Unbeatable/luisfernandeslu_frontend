import { baseApi } from "../../../services/api/baseApi";
import { pickList, pickPage, pickTotal } from "../apiError";

function normalizeReturnStatus(value) {
  return (
    String(value ?? "")
      .trim()
      .toLowerCase() || "pending"
  );
}

function mapReturnRequestItem(item) {
  if (!item || typeof item !== "object") return null;

  return {
    id: String(item.id ?? item.returnId ?? ""),
    returnId: String(item.returnId ?? item.id ?? ""),
    orderId: String(item.orderId ?? ""),
    customerName: String(item.customerName ?? ""),
    customerEmail: String(item.customerEmail ?? ""),
    productName: String(item.productName ?? ""),
    reason: String(item.reason ?? ""),
    requestDate: String(item.requestDate ?? ""),
    status: normalizeReturnStatus(item.status),
    raw: item,
  };
}

function mapReturnRequestDetail(payload) {
  const request = payload?.data ?? payload ?? {};
  if (!request || typeof request !== "object") return null;

  return {
    id: String(request.id ?? request.returnId ?? ""),
    returnId: String(request.returnId ?? request.id ?? ""),
    orderId: String(request.orderId ?? ""),
    receivedDate: String(request.receivedDate ?? request.requestDate ?? ""),
    status: normalizeReturnStatus(request.status),
    reason: String(request.reason ?? ""),
    description: String(request.description ?? ""),
    refundAccountNumber: String(request.refundAccountNumber ?? ""),
    refundAmount: String(request.refundAmount ?? ""),
    products: Array.isArray(request.products)
      ? request.products.map((product) => ({
          id: String(product?.id ?? ""),
          name: String(product?.name ?? ""),
          sku: String(product?.sku ?? ""),
          quantity: Number(product?.quantity ?? 0),
          price: String(product?.price ?? ""),
          image: String(product?.image ?? ""),
        }))
      : [],
    evidence: Array.isArray(request.evidence)
      ? request.evidence.map(String)
      : [],
    customer: {
      id: String(request.customer?.id ?? ""),
      name: String(request.customer?.name ?? request.customerName ?? ""),
      email: String(request.customer?.email ?? request.customerEmail ?? ""),
      phone: String(request.customer?.phone ?? ""),
      address: String(request.customer?.address ?? ""),
      avatarColor: String(request.customer?.avatarColor ?? "#3B82F6"),
    },
    orderSummary: {
      orderId: String(request.orderSummary?.orderId ?? request.orderId ?? ""),
      itemCount: Number(request.orderSummary?.itemCount ?? 0),
      requestDate: String(
        request.orderSummary?.requestDate ??
          request.receivedDate ??
          request.requestDate ??
          "",
      ),
      totalValue: String(request.orderSummary?.totalValue ?? ""),
    },
    raw: request,
  };
}

export const supplierReturnRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierReturnRequests: builder.query({
      query: () => ({
        url: "/api/supplier/return-requests",
        method: "GET",
      }),
      transformResponse: (response) => {
        const source = response ?? {};
        const returns = pickList(source, ["returns", "items", "data"])
          .map(mapReturnRequestItem)
          .filter(Boolean);

        return {
          stats: {
            total: Number(source?.stats?.total ?? returns.length),
            pendingReview: Number(source?.stats?.pendingReview ?? 0),
            approved: Number(source?.stats?.approved ?? 0),
            rejected: Number(source?.stats?.rejected ?? 0),
          },
          returns,
          pagination: {
            page: pickPage(source, 1),
            total: pickTotal(source, returns.length),
          },
        };
      },
      providesTags: (result) => [
        { type: "ReturnRequest", id: "LIST" },
        ...(result?.returns ?? []).map((item) => ({
          type: "ReturnRequest",
          id: item.id,
        })),
      ],
    }),
    getSupplierReturnRequestById: builder.query({
      query: (returnId) => ({
        url: `/api/supplier/return-requests/${returnId}`,
        method: "GET",
      }),
      transformResponse: mapReturnRequestDetail,
      providesTags: (_result, _error, returnId) => [
        { type: "ReturnRequest", id: returnId },
      ],
    }),
    updateSupplierReturnRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/supplier/return-requests/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ReturnRequest", id },
        { type: "ReturnRequest", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSupplierReturnRequestsQuery,
  useGetSupplierReturnRequestByIdQuery,
  useUpdateSupplierReturnRequestStatusMutation,
} = supplierReturnRequestsApi;
