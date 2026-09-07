import { baseApi } from "../../../services/api/baseApi";
import { pickList } from "../apiError";

function normalizeStatus(value) {
  return (
    String(value ?? "")
      .trim()
      .toLowerCase() || "pending"
  );
}

function mapDisputeRow(item) {
  if (!item || typeof item !== "object") return null;

  return {
    id: String(item.id ?? item.disputeId ?? ""),
    disputeId: String(item.disputeId ?? item.id ?? ""),
    orderId: String(item.orderId ?? ""),
    customer: String(item.customer ?? ""),
    supplier: String(item.supplier ?? ""),
    issue: String(item.issue ?? ""),
    status: normalizeStatus(item.status),
    registered: String(item.registered ?? ""),
    raw: item,
  };
}

function mapDisputeDetail(payload) {
  const dispute = payload?.data ?? payload ?? {};
  if (!dispute || typeof dispute !== "object") return null;

  return {
    id: String(dispute.id ?? dispute.disputeId ?? ""),
    disputeId: String(dispute.disputeId ?? dispute.id ?? ""),
    orderId: String(dispute.orderId ?? ""),
    status: normalizeStatus(dispute.status),
    createdAt: String(dispute.createdAt ?? ""),
    description: String(dispute.description ?? ""),
    items: Array.isArray(dispute.items)
      ? dispute.items.map((item) => ({
          id: String(item?.id ?? ""),
          productName: String(item?.productName ?? ""),
          orderId: String(item?.orderId ?? dispute.orderId ?? ""),
          reason: String(item?.reason ?? ""),
          image: String(item?.image ?? ""),
        }))
      : [],
    evidence: Array.isArray(dispute.evidence)
      ? dispute.evidence.map(String)
      : [],
    messages: Array.isArray(dispute.messages) ? dispute.messages : [],
    chat: dispute.chat ?? null,
    raw: dispute,
  };
}

export const supplierDisputesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierDisputes: builder.query({
      query: () => ({
        url: "/api/supplier/disputes",
        method: "GET",
      }),
      transformResponse: (response) => {
        const source = response ?? {};
        const disputes = pickList(source, ["disputes", "items", "data"])
          .map(mapDisputeRow)
          .filter(Boolean);

        return {
          stats: {
            total: Number(source?.stats?.total ?? disputes.length),
            pendingReview: Number(source?.stats?.pendingReview ?? 0),
            approved: Number(source?.stats?.approved ?? 0),
            rejected: Number(source?.stats?.rejected ?? 0),
          },
          disputes,
        };
      },
      providesTags: (result) => [
        { type: "Dispute", id: "LIST" },
        ...(result?.disputes ?? []).map((item) => ({
          type: "Dispute",
          id: item.id,
        })),
      ],
    }),
    getSupplierDisputeById: builder.query({
      query: (disputeId) => ({
        url: `/api/supplier/disputes/${disputeId}`,
        method: "GET",
      }),
      transformResponse: mapDisputeDetail,
      providesTags: (_result, _error, disputeId) => [
        { type: "Dispute", id: disputeId },
      ],
    }),
    updateSupplierDisputeStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/supplier/disputes/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Dispute", id },
        { type: "Dispute", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSupplierDisputesQuery,
  useGetSupplierDisputeByIdQuery,
  useUpdateSupplierDisputeStatusMutation,
} = supplierDisputesApi;
