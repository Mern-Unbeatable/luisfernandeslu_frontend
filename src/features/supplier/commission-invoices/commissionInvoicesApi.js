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

function formatCurrencyValue(value) {
  const amount = parseNumberValue(value);
  return `€${amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function resolveInvoiceParticipant(item) {
  return (
    item.participant ??
    item.customerName ??
    item.companyName ??
    item.userName ??
    item.name ??
    item.supplierName ??
    ""
  );
}

function mapCommissionInvoice(item) {
  if (!item || typeof item !== "object") return null;

  const amountValue =
    item.amount ??
    item.commissionAmount ??
    item.total ??
    item.totalAmount ??
    item.value ??
    0;

  const invoiceType = String(
    item.type ??
      item.invoiceType ??
      item.documentType ??
      item.userType ??
      "Invoice",
  );
  const customerName = String(
    item.customer ??
      item.customerName ??
      item.companyName ??
      item.userName ??
      item.name ??
      item.participant ??
      item.supplierName ??
      "",
  );

  return {
    id: String(item.id ?? item.invoiceId ?? item._id ?? ""),
    invoiceId: String(item.invoiceId ?? item.number ?? item.id ?? ""),
    type: invoiceType,
    userType: String(item.userType ?? invoiceType ?? "supplier"),
    orderId: String(
      item.orderId ?? item.orderNumber ?? item.order?.orderId ?? "",
    ),
    customer: customerName,
    participant: customerName,
    amount: formatCurrencyValue(amountValue),
    date: formatDateValue(item.date ?? item.createdAt ?? item.invoiceDate),
    status: String(item.status ?? item.paymentStatus ?? item.state ?? ""),
    raw: item,
  };
}

export function mapSupplierCommissionInvoiceList(payload, fallbackPage = 1) {
  const invoices = pickList(payload, ["invoices", "items", "data"])
    .map(mapCommissionInvoice)
    .filter(Boolean);

  const total = pickTotal(payload, invoices.length);
  const page = pickPage(payload, fallbackPage);
  const limitValue =
    payload?.limit ?? payload?.pagination?.limit ?? payload?.meta?.limit ?? 7;
  const limit = Number(limitValue || 7) || 7;

  return {
    invoices,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil((total || invoices.length) / limit)),
    stats: payload?.stats ?? payload?.summary ?? null,
  };
}

export function mapSupplierCommissionInvoiceDetail(payload) {
  const invoice = payload?.invoice ?? payload?.data ?? payload ?? {};
  return mapCommissionInvoice(invoice) || null;
}

export const supplierCommissionInvoicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierCommissionInvoices: builder.query({
      query: ({ page = 1, limit = 7, search = "" } = {}) => ({
        url: "/api/supplier/commission-invoices",
        method: "GET",
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
        },
      }),
      transformResponse: (response, _meta, arg) =>
        mapSupplierCommissionInvoiceList(response, arg?.page ?? 1),
    }),
    getSupplierCommissionInvoiceById: builder.query({
      query: (commissionInvoiceId) => ({
        url: `/api/supplier/commission-invoices/${commissionInvoiceId}`,
        method: "GET",
      }),
      transformResponse: mapSupplierCommissionInvoiceDetail,
    }),
    getSupplierCommissionInvoicePdf: builder.query({
      query: (commissionInvoiceId) => ({
        url: `/api/supplier/commission-invoices/${commissionInvoiceId}/pdf`,
        method: "GET",
        responseType: "blob",
      }),
    }),
  }),
});

export const {
  useGetSupplierCommissionInvoicesQuery,
  useGetSupplierCommissionInvoiceByIdQuery,
  useLazyGetSupplierCommissionInvoicePdfQuery,
} = supplierCommissionInvoicesApi;
