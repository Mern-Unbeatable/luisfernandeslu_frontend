import { baseApi } from "../../../services/api/baseApi";
import { pickList, pickPage, pickTotal } from "../apiError";

const COMPANY_ORDER_STATUS_MAP = {
  NEW: "new",
  PENDING: "pending",
  PROCESSING: "processing",
  ASSIGNED: "assigned",
  IN_TRANSIT: "assigned",
  CANCELLED: "cancel",
  CANCELED: "cancel",
  CANCEL: "cancel",
  COMPLETED: "completed",
};

function normalizeCompanyOrderStatus(rawStatus) {
  const value = String(rawStatus ?? "").trim();
  if (!value) return "new";

  const upper = value.toUpperCase();
  if (COMPANY_ORDER_STATUS_MAP[upper]) return COMPANY_ORDER_STATUS_MAP[upper];

  const lower = value.toLowerCase();
  if (COMPANY_ORDER_STATUS_MAP[lower]) return COMPANY_ORDER_STATUS_MAP[lower];

  return lower.replace(/\s+/g, "_");
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

function resolveCompanyOrderListItem(item) {
  if (!item || typeof item !== "object") return null;

  const id = item.id ?? item._id ?? "";
  const status = normalizeCompanyOrderStatus(
    item.status ?? item.orderStatus ?? item.state,
  );
  const tab =
    item.tab ??
    item.type ??
    (item.installmentAmount != null ||
    item.hasInstallment ||
    item.installmentNumber != null
      ? "chat"
      : "direct");
  const orderId =
    item.orderId ??
    item.orderNumber ??
    item.number ??
    item.reference ??
    (id ? `#${String(id)}` : "");

  const common = {
    id,
    companyId: item.companyId ?? item.company?.id ?? item.companyId ?? "",
    tab,
    status,
    statusLabel: item.statusLabel ?? item.status ?? status,
    date: formatDateValue(item.createdAt ?? item.orderDate ?? item.date),
    raw: item,
  };

  if (tab === "chat") {
    return {
      ...common,
      orderId:
        item.orderId ??
        item.orderNumber ??
        item.reference ??
        (id ? `CO-${String(id)}` : ""),
      companyName:
        item.companyName ?? item.company?.name ?? item.customer?.name ?? "",
      total: formatCurrencyValue(
        item.total ?? item.totalPrice ?? item.amount ?? item.grandTotal ?? 0,
      ),
      installmentAmount: formatCurrencyValue(
        item.installmentAmount ?? item.currentInstallmentAmount ?? 0,
      ),
      installmentNumber: String(
        item.installmentNumber ??
          item.currentInstallment ??
          item.installment ??
          1,
      ),
    };
  }

  return {
    ...common,
    orderId,
    customerName:
      item.customerName ?? item.customer?.name ?? item.company?.name ?? "",
    email: item.email ?? item.customer?.email ?? item.company?.email ?? "",
    items: String(
      item.items ??
        item.itemCount ??
        item.products?.length ??
        (Array.isArray(item.lineItems) ? item.lineItems.length : 0) ??
        0,
    ),
    total: formatCurrencyValue(
      item.total ?? item.totalPrice ?? item.amount ?? item.grandTotal ?? 0,
    ),
  };
}

export function mapSupplierCompanyOrderList(payload, fallbackPage = 1) {
  const list = pickList(payload, ["orders", "items", "data"])
    .map(resolveCompanyOrderListItem)
    .filter(Boolean);
  const total = pickTotal(payload, list.length);
  const page = pickPage(payload, fallbackPage);
  const limitValue =
    payload?.limit ??
    payload?.pagination?.limit ??
    payload?.meta?.limit ??
    list.length;
  const limit = Number(limitValue || 1) || list.length || 1;

  return {
    orders: list,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil((total || list.length) / limit)),
  };
}

function mapCompanyOrderDetail(payload) {
  const order = payload?.order ?? payload?.data ?? payload ?? {};
  const tab =
    order.tab ??
    order.type ??
    (order.hasInstallment ||
    order.installmentAmount != null ||
    order.installmentNumber != null
      ? "chat"
      : "direct");
  const status = normalizeCompanyOrderStatus(order.status);
  const customer = order.customer ?? {};
  const company = order.company ?? {};
  const totals = order.totals ?? {
    subtotal: order.subtotal ?? 0,
    shipping: order.shipping ?? 0,
    tax: order.tax ?? 0,
    total: order.total ?? order.totalPrice ?? 0,
  };

  const payment =
    order.payment ??
    (tab === "chat"
      ? {
          totalPrice: formatCurrencyValue(
            order.total ?? order.totalPrice ?? order.amount ?? 0,
          ),
          paidAmount: formatCurrencyValue(
            order.paidAmount ?? order.amountPaid ?? 0,
          ),
          remainingBalance: formatCurrencyValue(
            order.remainingBalance ??
              (order.total ?? order.totalPrice ?? 0) -
                (order.paidAmount ?? order.amountPaid ?? 0),
          ),
          duration:
            order.duration ??
            `${order.installmentNumber ?? 1} installment${
              (order.installmentNumber ?? 1) > 1 ? "s" : ""
            }`,
        }
      : {});

  return {
    id: order.id ?? "",
    orderId: order.orderId ?? order.orderNumber ?? order.id ?? "",
    orderDate: formatDateValue(
      order.orderDate ?? order.createdAt ?? order.date,
    ),
    status,
    hasInstallment: Boolean(order.hasInstallment || tab === "chat"),
    recipientType:
      order.recipientType ?? (customer?.id ? "customer" : "company"),
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
      project: customer.project ?? order.project ?? "",
    },
    company: {
      id: company.id ?? "",
      name: company.name ?? company.fullName ?? "",
      email: company.email ?? "",
      phone: company.phone ?? company.mobile ?? "",
      project: company.project ?? customer.project ?? order.project ?? "",
    },
    logistics: order.logistics ?? {},
    products: Array.isArray(order.products)
      ? order.products
      : Array.isArray(order.items)
        ? order.items
        : [],
    totals,
    transporter: order.transporter ?? null,
    payment,
    installmentBreakdown: order.installmentBreakdown ?? [],
    installments: order.installments ?? [],
    cancelReason: order.cancelReason ?? null,
    raw: order,
  };
}

export const supplierCompanyOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierCompanyOrderStats: builder.query({
      query: ({ type = "direct" } = {}) => ({
        url: "/api/supplier/company-orders/stats",
        method: "GET",
        params: { type },
      }),
      transformResponse: (response) => response?.stats ?? response ?? {},
      providesTags: (_result, _error, arg) => [
        { type: "CompanyOrder", id: `STATS-${arg?.type ?? "direct"}` },
      ],
    }),
    getSupplierCompanyOrderCompanies: builder.query({
      query: () => ({
        url: "/api/supplier/company-orders/companies",
        method: "GET",
      }),
      transformResponse: (response) =>
        pickList(response, ["companies", "items", "data"]).map((company) => ({
          value: company.id ?? company.value ?? company.companyId ?? "",
          label: company.name ?? company.label ?? company.companyName ?? "",
        })),
      providesTags: [{ type: "CompanyOrder", id: "COMPANIES" }],
    }),
    getSupplierCompanyOrdersDirect: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status = "all",
        search = "",
        companyId = "",
      } = {}) => ({
        url: "/api/supplier/company-orders/direct",
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
        mapSupplierCompanyOrderList(response, arg?.page ?? 1),
      providesTags: (result) =>
        result?.orders?.length
          ? [
              ...result.orders.map(({ id }) => ({ type: "CompanyOrder", id })),
              { type: "CompanyOrder", id: "LIST-DIRECT" },
            ]
          : [{ type: "CompanyOrder", id: "LIST-DIRECT" }],
    }),
    getSupplierCompanyOrdersChat: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status = "all",
        search = "",
        companyId = "",
      } = {}) => ({
        url: "/api/supplier/company-orders/chat",
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
        mapSupplierCompanyOrderList(response, arg?.page ?? 1),
      providesTags: (result) =>
        result?.orders?.length
          ? [
              ...result.orders.map(({ id }) => ({ type: "CompanyOrder", id })),
              { type: "CompanyOrder", id: "LIST-CHAT" },
            ]
          : [{ type: "CompanyOrder", id: "LIST-CHAT" }],
    }),
    getSupplierCompanyOrderById: builder.query({
      query: (id) => ({
        url: `/api/supplier/company-orders/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => mapCompanyOrderDetail(response),
      providesTags: (_result, _error, id) => [{ type: "CompanyOrder", id }],
    }),
    getSupplierCompanyOrderInvoice: builder.query({
      query: (id) => ({
        url: `/api/supplier/company-orders/${id}/invoice`,
        method: "GET",
        responseType: "blob",
      }),
      providesTags: (_result, _error, id) => [
        { type: "CompanyOrder", id: `INVOICE-${id}` },
      ],
    }),
    updateSupplierCompanyOrderStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `/api/supplier/company-orders/${id}/status`,
        method: "PATCH",
        data: {
          ...(status ? { status } : {}),
          ...(reason ? { reason } : {}),
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "CompanyOrder", id },
        { type: "CompanyOrder", id: "LIST-DIRECT" },
        { type: "CompanyOrder", id: "LIST-CHAT" },
      ],
    }),
  }),
});

export const {
  useGetSupplierCompanyOrderStatsQuery,
  useGetSupplierCompanyOrderCompaniesQuery,
  useGetSupplierCompanyOrdersDirectQuery,
  useGetSupplierCompanyOrdersChatQuery,
  useGetSupplierCompanyOrderByIdQuery,
  useLazyGetSupplierCompanyOrderInvoiceQuery,
  useUpdateSupplierCompanyOrderStatusMutation,
} = supplierCompanyOrdersApi;
