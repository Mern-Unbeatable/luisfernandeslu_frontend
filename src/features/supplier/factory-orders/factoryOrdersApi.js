import { baseApi } from "../../../services/api/baseApi";
import { pickList, pickPage, pickTotal } from "../apiError";

const FACTORY_ORDER_STATUS_MAP = {
  NEW: "new",
  IN_PRODUCTION: "in-production",
  PRODUCED: "produced",
  READY: "ready",
  ASSIGNED: "assigned",
  CANCEL: "cancel",
  CANCELLED: "cancel",
  CANCELED: "cancel",
  COMPLETED: "completed",
};

function normalizeFactoryOrderStatus(rawStatus) {
  const value = String(rawStatus ?? "").trim();
  if (!value) return "new";

  const upper = value.toUpperCase().replace(/[\s-]+/g, "_");
  if (FACTORY_ORDER_STATUS_MAP[upper]) return FACTORY_ORDER_STATUS_MAP[upper];

  const lower = value.toLowerCase().replace(/[\s_]+/g, "-");
  if (FACTORY_ORDER_STATUS_MAP[lower]) return FACTORY_ORDER_STATUS_MAP[lower];

  return lower.replace(/\s+/g, "-");
}

function parseNumberValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const cleaned = String(value ?? "")
    .replace(/[^0-9.-]+/g, "")
    .trim();
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrencyValue(value) {
  const amount = parseNumberValue(value);
  if (!Number.isFinite(amount)) return "€0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(amount);
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

function resolveFactoryOrderListItem(item) {
  if (!item || typeof item !== "object") return null;

  const id = item.id ?? item._id ?? "";
  const status = normalizeFactoryOrderStatus(
    item.status ?? item.orderStatus ?? item.state,
  );

  const factoryName =
    item.factoryName ??
    item.factory?.name ??
    item.company?.name ??
    item.supplierName ??
    "";

  const orderNumber =
    item.poNumber ??
    item.orderNumber ??
    item.orderId ??
    item.reference ??
    (id ? `PO-${String(id)}` : "");

  const companyId =
    item.companyId ??
    item.factoryId ??
    item.factory?.id ??
    item.company?.id ??
    "";

  return {
    id,
    tab: item.tab ?? "orders",
    companyId,
    factoryName,
    poNumber: orderNumber,
    total: formatCurrencyValue(
      item.total ?? item.totalPrice ?? item.amount ?? item.grandTotal ?? 0,
    ),
    installmentAmount: formatCurrencyValue(
      item.installmentAmount ??
        item.installment ??
        item.nextInstallmentAmount ??
        item.amountDue ??
        0,
    ),
    status,
    statusLabel:
      item.statusLabel ??
      item.statusText ??
      String(status)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    installmentNumber: String(
      item.installmentNumber ??
        item.currentInstallment ??
        item.installments?.length ??
        1,
    ),
    date: formatDateValue(item.createdAt ?? item.orderDate ?? item.date),
    raw: item,
  };
}

export function mapSupplierFactoryOrderList(payload, fallbackPage = 1) {
  const orders = pickList(payload, ["orders", "items", "data"])
    .map(resolveFactoryOrderListItem)
    .filter(Boolean);

  const total = pickTotal(payload, orders.length);
  const page = pickPage(payload, fallbackPage);
  const limitValue =
    payload?.limit ?? payload?.pagination?.limit ?? payload?.meta?.limit ?? 10;
  const limit = Number(limitValue || 10) || 10;

  return {
    orders,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil((total || orders.length) / limit)),
  };
}

export function mapSupplierFactoryOrderFactories(payload) {
  return pickList(payload, ["factories", "items", "data"])
    .map((factory) => ({
      value: String(factory.id ?? factory.value ?? factory.factoryId ?? ""),
      label:
        factory.name ??
        factory.label ??
        factory.factoryName ??
        "Unnamed factory",
    }))
    .filter((item) => item.value);
}

function mapFactoryOrderDetail(payload) {
  const order = payload?.order ?? payload?.data ?? payload ?? {};
  const status = normalizeFactoryOrderStatus(
    order.status ?? order.orderStatus ?? order.state,
  );
  const factory = order.factory ?? {};
  const company = order.company ?? {};
  const products = Array.isArray(order.products)
    ? order.products
    : Array.isArray(order.items)
      ? order.items
      : [];

  const installmentCount = Number(
    order.installmentNumber ??
      order.currentInstallment ??
      (Array.isArray(order.installments) ? order.installments.length : 0) ??
      1,
  );

  const payment = order.payment ?? {
    totalPrice: formatCurrencyValue(
      order.total ?? order.totalPrice ?? order.amount ?? 0,
    ),
    paidAmount: formatCurrencyValue(order.paidAmount ?? order.amountPaid ?? 0),
    remainingBalance: formatCurrencyValue(
      order.remainingBalance ??
        parseNumberValue(order.total ?? order.totalPrice ?? order.amount ?? 0) -
          parseNumberValue(order.paidAmount ?? order.amountPaid ?? 0),
    ),
    paidNote: order.paidNote ?? "",
    duration: order.duration ?? `${installmentCount} months`,
  };

  const transporter =
    status === "assigned" || status === "in-production" || status === "ready"
      ? {
          name: order.transporter?.name ?? "John Smith",
          phone: order.transporter?.phone ?? "+1 (555) 123-4567",
          vehicle: order.transporter?.vehicle ?? "Truck #TR-4523",
        }
      : null;

  return {
    id: String(order.id ?? order._id ?? ""),
    orderId:
      order.orderId ?? order.orderNumber ?? order.poNumber ?? order.id ?? "",
    orderDate: formatDateValue(
      order.orderDate ?? order.createdAt ?? order.date,
    ),
    status,
    statusLabel:
      order.statusLabel ??
      order.statusText ??
      String(status)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    hasInstallment: Boolean(order.hasInstallment || installmentCount > 0),
    context: "factory",
    recipientType: order.recipientType ?? "supplier",
    company: {
      name: company.name ?? factory.name ?? "Factory",
      email: company.email ?? factory.email ?? "",
      phone: company.phone ?? factory.phone ?? "",
    },
    logistics: {
      deliveryLocation:
        order.logistics?.deliveryLocation ?? order.deliveryLocation ?? "",
    },
    payment,
    products,
    installmentBreakdown: Array.isArray(order.installmentBreakdown)
      ? order.installmentBreakdown
      : [],
    installments: Array.isArray(order.installments) ? order.installments : [],
    transporter,
    cancelReason: order.cancelReason ?? null,
    raw: order,
  };
}

export const supplierFactoryOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierFactoryOrderFactories: builder.query({
      query: () => ({
        url: "/api/supplier/factory-orders/factories",
        method: "GET",
      }),
      transformResponse: (response) =>
        mapSupplierFactoryOrderFactories(response),
      providesTags: [{ type: "FactoryOrder", id: "FACTORIES" }],
    }),
    getSupplierFactoryOrders: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status = "all",
        search = "",
        companyId = "",
      } = {}) => ({
        url: "/api/supplier/factory-orders",
        method: "GET",
        params: {
          page,
          limit,
          ...(status && status !== "all" ? { status } : {}),
          ...(search ? { search } : {}),
          ...(companyId && companyId !== "all" ? { companyId } : {}),
        },
      }),
      transformResponse: (response, _meta, arg) =>
        mapSupplierFactoryOrderList(response, arg?.page ?? 1),
      providesTags: (result) =>
        result?.orders?.length
          ? [
              ...result.orders.map(({ id }) => ({ type: "FactoryOrder", id })),
              { type: "FactoryOrder", id: "LIST" },
            ]
          : [{ type: "FactoryOrder", id: "LIST" }],
    }),
    getSupplierFactoryOrderById: builder.query({
      query: (id) => ({
        url: `/api/supplier/factory-orders/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => mapFactoryOrderDetail(response),
      providesTags: (_result, _error, id) => [{ type: "FactoryOrder", id }],
    }),
    deleteSupplierFactoryOrder: builder.mutation({
      query: (id) => ({
        url: `/api/supplier/factory-orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "FactoryOrder", id },
        { type: "FactoryOrder", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSupplierFactoryOrderFactoriesQuery,
  useGetSupplierFactoryOrdersQuery,
  useGetSupplierFactoryOrderByIdQuery,
  useDeleteSupplierFactoryOrderMutation,
} = supplierFactoryOrdersApi;
