import { baseApi } from "../../../services/api/baseApi";
import { pickList, pickPage, pickTotal } from "../apiError";

function normalizeOverviewStatus(value) {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return "pending";

  if (["assign", "assigned", "assigning"].includes(raw)) return "assign";
  if (["completed", "complete", "success"].includes(raw)) return "completed";
  if (["pending", "processing", "new", "in_review"].includes(raw))
    return "pending";
  if (["cancel", "cancelled", "canceled", "rejected"].includes(raw))
    return "cancel";

  return raw;
}

function formatCurrencyValue(value) {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed)) return "€0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
}

function mapOverviewOrder(item) {
  if (!item || typeof item !== "object") return null;

  const type = String(item.type ?? "Regular").trim();
  const rawStatus = normalizeOverviewStatus(item.status ?? item.orderStatus);
  const payment = item.payment ?? item.paymentStatus ?? "—";
  const priceValue = item.price ?? item.total ?? item.amount ?? 0;

  return {
    id: item.id ?? item._id ?? "",
    orderId: item.orderId ?? item.orderNumber ?? item.number ?? item.id ?? "",
    customerName: item.customerName ?? item.customer?.name ?? "",
    type: type === "Company" ? "Company" : "Regular",
    price: formatCurrencyValue(priceValue),
    payment: payment || "—",
    status: rawStatus,
    statusLabel: item.statusLabel ?? rawStatus,
    tab: item.tab ?? item.type ?? "direct",
    raw: item,
  };
}

export const supplierOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierOverview: builder.query({
      query: ({ period, page = 1, limit = 7 } = {}) => ({
        url: "/api/supplier/overview",
        method: "GET",
        params: {
          period: period ?? new Date().getFullYear(),
          page,
          limit,
        },
      }),
      transformResponse: (response, _meta, arg) => {
        const source = response ?? {};
        const orders = pickList(source.orders ?? [], [
          "orders",
          "items",
          "data",
        ])
          .map(mapOverviewOrder)
          .filter(Boolean);

        const revenueSource = source.revenue ?? {};
        const series = Array.isArray(revenueSource.series)
          ? revenueSource.series.map((item) => ({
              ...item,
              points: Array.isArray(item.points)
                ? item.points.map((point) => ({
                    ...point,
                    value: Number(point?.value ?? 0),
                  }))
                : [],
            }))
          : [];

        return {
          stats: {
            totalSalesRegular: Number(source?.stats?.totalSalesRegular ?? 0),
            totalSalesCompany: Number(source?.stats?.totalSalesCompany ?? 0),
            activeOrders: Number(source?.stats?.activeOrders ?? 0),
            cancelOrders: Number(source?.stats?.cancelOrders ?? 0),
            totalProducts: Number(source?.stats?.totalProducts ?? 0),
          },
          revenue: {
            year: Number(revenueSource?.year ?? new Date().getFullYear()),
            maxValue: Number(revenueSource?.maxValue ?? 0),
            yTicks: Array.isArray(revenueSource?.yTicks)
              ? revenueSource.yTicks.map((value) => Number(value ?? 0))
              : [0, 5000, 10000, 15000, 20000],
            series,
          },
          orders,
          pagination: {
            page: pickPage(source, arg?.page ?? 1),
            limit: Number(source?.pagination?.limit ?? arg?.limit ?? 7) || 7,
            total: pickTotal(source, orders.length),
            totalPages: Number(
              source?.pagination?.totalPages ??
                Math.max(
                  1,
                  Math.ceil(
                    (pickTotal(source, orders.length) || 1) /
                      (Number(source?.pagination?.limit ?? arg?.limit ?? 7) ||
                        7),
                  ),
                ),
            ),
          },
        };
      },
    }),
  }),
});

export const { useGetSupplierOverviewQuery } = supplierOverviewApi;
