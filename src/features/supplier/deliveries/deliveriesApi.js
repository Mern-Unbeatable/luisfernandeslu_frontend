import { baseApi } from "../../../services/api/baseApi";

const DELIVERY_TAG = { type: "Delivery", id: "SUPPLIER" };
const EARNINGS_TAG = { type: "Delivery", id: "EARNINGS" };
const PAYOUTS_TAG = { type: "Delivery", id: "PAYOUTS" };

function listOf(value) {
  return Array.isArray(value) ? value : [];
}

export const supplierDeliveriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierDeliveries: builder.query({
      query: () => ({ url: "/api/supplier/deliveries", method: "GET" }),
      transformResponse: (response) => ({
        pending: listOf(response?.pending),
        self: listOf(response?.self),
        awaitingCarrier: listOf(response?.awaitingCarrier),
        clockOffset: response?.serverTime
          ? new Date(response.serverTime).getTime() - Date.now()
          : 0,
      }),
      providesTags: [DELIVERY_TAG],
    }),
    chooseSelfDelivery: builder.mutation({
      query: (orderId) => ({
        url: `/api/supplier/deliveries/${orderId}/self`,
        method: "POST",
      }),
      invalidatesTags: [DELIVERY_TAG],
    }),
    sendDeliveryToCarriers: builder.mutation({
      query: (orderId) => ({
        url: `/api/supplier/deliveries/${orderId}/carrier`,
        method: "POST",
      }),
      invalidatesTags: [DELIVERY_TAG],
    }),
    markSelfDeliveryDelivered: builder.mutation({
      query: (orderId) => ({
        url: `/api/supplier/deliveries/${orderId}/delivered`,
        method: "POST",
      }),
      invalidatesTags: [DELIVERY_TAG, EARNINGS_TAG],
    }),
    getSupplierDeliveryEarnings: builder.query({
      query: () => ({ url: "/api/supplier/deliveries/earnings", method: "GET" }),
      transformResponse: (response) => ({
        availableBalance: Number(response?.availableBalance) || 0,
        pendingEarnings: Number(response?.pendingEarnings) || 0,
        totalEarned: Number(response?.totalEarned) || 0,
        defaultAccountNumber: response?.defaultAccountNumber || "",
        withdrawals: listOf(response?.withdrawals),
      }),
      providesTags: [EARNINGS_TAG],
    }),
    requestDeliveryWithdrawal: builder.mutation({
      query: (body) => ({
        url: "/api/supplier/deliveries/withdrawals",
        method: "POST",
        body,
      }),
      invalidatesTags: [EARNINGS_TAG],
    }),
    getAdminPayouts: builder.query({
      query: (params = {}) => ({ url: "/api/admin/payouts", method: "GET", params }),
      transformResponse: (response) => ({
        payouts: listOf(response?.payouts),
        pendingTotal: Number(response?.pendingTotal) || 0,
        pagination: response?.pagination || { page: 1, limit: 7, total: 0, totalPages: 1 },
      }),
      providesTags: [PAYOUTS_TAG],
    }),
    updateAdminPayoutStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/admin/payouts/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [PAYOUTS_TAG],
    }),
    getAdminSelfDeliveries: builder.query({
      query: ({ late = false } = {}) => ({
        url: "/api/admin/self-deliveries",
        method: "GET",
        params: late ? { late: true } : undefined,
      }),
      transformResponse: (response) =>
        listOf(response?.deliveries ?? response?.items ?? response?.data),
      providesTags: [{ type: "Delivery", id: "ADMIN" }],
    }),
  }),
});

export const {
  useGetSupplierDeliveriesQuery,
  useChooseSelfDeliveryMutation,
  useSendDeliveryToCarriersMutation,
  useMarkSelfDeliveryDeliveredMutation,
  useGetAdminSelfDeliveriesQuery,
  useGetSupplierDeliveryEarningsQuery,
  useRequestDeliveryWithdrawalMutation,
  useGetAdminPayoutsQuery,
  useUpdateAdminPayoutStatusMutation,
} = supplierDeliveriesApi;
