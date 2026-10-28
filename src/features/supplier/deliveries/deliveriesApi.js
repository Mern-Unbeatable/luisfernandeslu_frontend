import { baseApi } from "../../../services/api/baseApi";

const DELIVERY_TAG = { type: "Delivery", id: "SUPPLIER" };

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
      invalidatesTags: [DELIVERY_TAG],
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
} = supplierDeliveriesApi;
