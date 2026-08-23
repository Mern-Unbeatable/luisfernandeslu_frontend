import { baseApi } from "../../services/api/baseApi";
import { pickList } from "../supplier/apiError";

function normalizeCustomerOrderStatus(status) {
  const value = String(status ?? "")
    .trim()
    .toLowerCase();

  if (value === "cancelled" || value === "canceled" || value === "cancel") {
    return "cancel";
  }
  if (value === "in_transit" || value === "in transit") return "processing";
  if (value === "pending") return "pending";
  if (value === "processing") return "processing";
  if (value === "assigned") return "assigned";
  if (value === "completed" || value === "complete") return "completed";
  if (value === "new") return "new";

  return value || "new";
}

function toApiCustomerOrderStatus(status) {
  const value = String(status ?? "")
    .trim()
    .toLowerCase();

  if (value === "cancel") return "CANCELLED";
  if (value === "completed") return "COMPLETED";
  if (value === "assigned") return "ASSIGNED";
  if (value === "processing") return "PROCESSING";
  if (value === "pending") return "PENDING";
  if (value === "new") return "NEW";

  return value ? value.toUpperCase() : "NEW";
}

function formatCurrencyValue(value) {
  const parsed = Number(String(value ?? "").replace(/[^\d.-]+/g, ""));

  if (!Number.isFinite(parsed)) {
    return value ? String(value) : "€0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(parsed);
}

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

function mapSupplierCustomerOrderRow(order) {
  if (!order || typeof order !== "object") return null;

  const status = normalizeCustomerOrderStatus(
    order.orderStatus ?? order.status,
  );
  const totalValue =
    order.total ??
    order.totalAmount ??
    order.amount ??
    order.grandTotal ??
    order.totalPrice ??
    0;
  const itemCount =
    order.items ??
    order.itemsCount ??
    order.itemCount ??
    order.products?.length ??
    (Array.isArray(order.lineItems) ? order.lineItems.length : 0) ??
    0;

  return {
    id: order.id ?? order._id ?? "",
    orderId:
      order.orderId ??
      order.orderNumber ??
      order.number ??
      (order.id ? `#${String(order.id)}` : ""),
    customerName:
      order.customerName ??
      order.customer?.name ??
      order.user?.name ??
      order.companyName ??
      "",
    email:
      order.email ??
      order.customerEmail ??
      order.customer?.email ??
      order.user?.email ??
      "",
    items: String(itemCount),
    total: formatCurrencyValue(totalValue),
    status,
    statusLabel: order.statusLabel ?? status,
    date: formatDateValue(order.createdAt ?? order.date ?? order.orderDate),
    raw: order,
  };
}

function mapSupplierCustomerOrderList(payload, fallbackPage = 1) {
  const orders = pickList(payload, ["orders", "items", "data"])
    .map(mapSupplierCustomerOrderRow)
    .filter(Boolean);

  const total = Number(
    payload?.pagination?.total ??
      payload?.meta?.total ??
      payload?.total ??
      payload?.totalItems ??
      payload?.count ??
      orders.length,
  );

  return {
    orders,
    total: Number.isFinite(total) ? total : orders.length,
    page:
      Number(
        payload?.pagination?.page ??
          payload?.meta?.page ??
          payload?.page ??
          fallbackPage,
      ) || fallbackPage,
  };
}

function mapSupplierCustomerOrderDetail(payload) {
  const order = payload?.order ?? payload?.data ?? payload ?? {};
  if (!order || typeof order !== "object") return null;

  const status = normalizeCustomerOrderStatus(
    order.orderStatus ?? order.status,
  );
  const customer = order.customer ?? {};
  const transporter = order.transporter ?? null;
  const totals = order.totals ?? {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  };

  return {
    id: order.id ?? "",
    orderId: order.orderNumber ?? order.orderId ?? order.id ?? "",
    orderDate: formatDateValue(order.orderDate ?? order.createdAt),
    status,
    hasInstallment: Boolean(order.hasInstallment),
    recipientType: order.recipientType ?? "customer",
    customer: {
      id: customer.id ?? "",
      name: customer.name ?? customer.fullName ?? "",
      email: customer.email ?? "",
      phone: customer.phone ?? customer.mobile ?? "",
      region: customer.region ?? "",
      city: customer.city ?? "",
      zipCode: customer.zipCode ?? customer.postalCode ?? "",
      address: customer.address ?? customer.streetAddress ?? "",
      country: customer.country ?? "",
    },
    logistics: order.logistics ?? {},
    products: Array.isArray(order.products) ? order.products : [],
    totals,
    transporter,
    cancelReason: order.cancelReason ?? null,
    raw: order,
  };
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Order", id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),
    getSupplierCustomerOrderStats: builder.query({
      query: () => ({
        url: "/api/supplier/customer-orders/stats",
        method: "GET",
      }),
      transformResponse: (response) => response?.stats ?? response ?? {},
      providesTags: [{ type: "Order", id: "STATS" }],
    }),
    getSupplierCustomerOrders: builder.query({
      query: ({ page = 1, limit = 10, status = "all", search = "" } = {}) => ({
        url: "/api/supplier/customer-orders",
        method: "GET",
        params: {
          page,
          limit,
          ...(status && status !== "all" ? { status } : { status: "all" }),
          ...(search ? { search } : {}),
        },
      }),
      transformResponse: (response, _meta, arg) =>
        mapSupplierCustomerOrderList(response, arg?.page ?? 1),
      providesTags: (result) =>
        result?.orders?.length
          ? [
              ...result.orders.map(({ id }) => ({ type: "Order", id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    getSupplierCustomerOrderById: builder.query({
      query: (id) => ({
        url: `/api/supplier/customer-orders/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => mapSupplierCustomerOrderDetail(response),
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    updateSupplierCustomerOrderStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `/api/supplier/customer-orders/${id}/status`,
        method: "PATCH",
        data: {
          ...(status ? { status: toApiCustomerOrderStatus(status) } : {}),
          ...(reason ? { reason } : {}),
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        { type: "Order", id: "STATS" },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useGetSupplierCustomerOrderStatsQuery,
  useGetSupplierCustomerOrdersQuery,
  useGetSupplierCustomerOrderByIdQuery,
  useUpdateSupplierCustomerOrderStatusMutation,
} = orderApi;
