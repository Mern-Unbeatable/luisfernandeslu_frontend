import { baseApi } from "../../services/api/baseApi";
import { pickList } from "../supplier/apiError";
import {
  CUSTOMER_ORDER_STATUS_ALL,
  normalizeCustomerOrderStatus,
} from "./customerOrderStatus";

function toApiCustomerOrderStatus(status) {
  return normalizeCustomerOrderStatus(status);
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
    statusLabel:
      order.statusLabel ?? order.orderStatus ?? order.status ?? status,
    date: formatDateValue(order.createdAt ?? order.date ?? order.orderDate),
    canAccept: Boolean(order.canAccept),
    canMarkProcessing: Boolean(order.canMarkProcessing),
    canMarkInTransit: Boolean(order.canMarkInTransit),
    canComplete: Boolean(order.canComplete),
    canCancel: Boolean(order.canCancel),
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
  const page =
    Number(
      payload?.pagination?.page ??
        payload?.meta?.page ??
        payload?.page ??
        fallbackPage,
    ) || fallbackPage;
  const limit = Number(
    payload?.pagination?.limit ??
      payload?.meta?.limit ??
      payload?.limit ??
      payload?.perPage ??
      payload?.pageSize,
  );
  const safeLimit =
    Number.isFinite(limit) && limit > 0 ? limit : orders.length || 1;
  const totalPages = Number(
    payload?.pagination?.totalPages ??
      payload?.meta?.totalPages ??
      payload?.totalPages ??
      Math.ceil((Number.isFinite(total) ? total : orders.length) / safeLimit),
  );
  const from = Number(
    payload?.pagination?.from ??
      payload?.meta?.from ??
      (total > 0 ? (page - 1) * safeLimit + 1 : 0),
  );
  const to = Number(
    payload?.pagination?.to ??
      payload?.meta?.to ??
      (total > 0 ? Math.min(page * safeLimit, total) : 0),
  );
  const hasPrevious =
    payload?.pagination?.hasPrevious ?? payload?.meta?.hasPrevious ?? page > 1;
  const hasNext =
    payload?.pagination?.hasNext ??
    payload?.meta?.hasNext ??
    page < (Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1);

  return {
    orders,
    total: Number.isFinite(total) ? total : orders.length,
    page,
    limit: safeLimit,
    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
    from: Number.isFinite(from) ? from : 0,
    to: Number.isFinite(to) ? to : 0,
    hasPrevious: Boolean(hasPrevious),
    hasNext: Boolean(hasNext),
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
      query: ({
        page = 1,
        limit = 10,
        status = CUSTOMER_ORDER_STATUS_ALL,
        search = "",
      } = {}) => ({
        url: "/api/supplier/customer-orders",
        method: "GET",
        params: {
          page,
          limit,
          ...(status && status !== CUSTOMER_ORDER_STATUS_ALL
            ? { status: toApiCustomerOrderStatus(status) }
            : { status: CUSTOMER_ORDER_STATUS_ALL }),
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
