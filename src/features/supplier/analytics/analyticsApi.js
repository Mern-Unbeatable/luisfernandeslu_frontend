import { baseApi } from "../../../services/api/baseApi";

function normalizeSeries(series) {
  return Array.isArray(series) ? series.map((value) => Number(value ?? 0)) : [];
}

function normalizeBreakdownItem(item = {}) {
  return {
    percent: Number(item.percent ?? 0),
    amount: String(item.amount ?? "€0"),
    value: Number(item.value ?? 0),
    color: String(item.color ?? "#14B8A6"),
  };
}

export const supplierAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierAnalytics: builder.query({
      query: () => ({
        url: "/api/supplier/analytics",
        method: "GET",
      }),
      transformResponse: (response) => {
        const source = response ?? {};

        return {
          stats: {
            totalRevenue: String(source?.stats?.totalRevenue ?? "€0"),
            totalRevenueGrowth: String(
              source?.stats?.totalRevenueGrowth ?? "0% vs last month",
            ),
            procurementExpenses: String(
              source?.stats?.procurementExpenses ?? "€0",
            ),
            netProfit: String(source?.stats?.netProfit ?? "€0"),
            outstandingDues: String(source?.stats?.outstandingDues ?? "€0"),
          },
          revenueExpensesProfit: {
            revenue: normalizeSeries(source?.revenueExpensesProfit?.revenue),
            expenses: normalizeSeries(source?.revenueExpensesProfit?.expenses),
            profit: normalizeSeries(source?.revenueExpensesProfit?.profit),
          },
          revenueBreakdown: {
            regular: normalizeBreakdownItem(source?.revenueBreakdown?.regular),
            company: normalizeBreakdownItem(source?.revenueBreakdown?.company),
          },
          salesByCustomerType: {
            regular: normalizeSeries(source?.salesByCustomerType?.regular),
            company: normalizeSeries(source?.salesByCustomerType?.company),
          },
          insight: String(source?.insight ?? ""),
        };
      },
    }),
  }),
});

export const { useGetSupplierAnalyticsQuery } = supplierAnalyticsApi;
