import {
  FiAlertCircle,
  FiDollarSign,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import StatusCard from "@/components/data-display/StatusCard";
import { DEMO_SUPPLIER_ANALYTICS } from "@/data/demoData";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import { useGetSupplierAnalyticsQuery } from "@/features/supplier/analytics/analyticsApi";
import {
  RevenueBreakdownChart,
  RevenueExpensesProfitChart,
  SalesByCustomerTypeChart,
} from "./AnalyticsCharts";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, error } = useGetSupplierAnalyticsQuery();
  const analytics = data ?? DEMO_SUPPLIER_ANALYTICS;
  const stats = analytics.stats;
  const errorMessage = error
    ? getApiErrorMessage(error, t("common.requestFailed"))
    : "";

  return (
    <>
      <Seo title={t("supplierAnalytics.title")} />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t("supplierAnalytics.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t("supplierAnalytics.subtitle")}
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {isLoading || isFetching ? (
          <div className="text-sm text-[var(--secondary-text)]">
            {t("common.loading")}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            variant="filled"
            tone="brand"
            label={t("supplierAnalytics.cards.totalRevenue")}
            value={stats.totalRevenue}
            description={stats.totalRevenueGrowth}
            icon={FiDollarSign}
          />
          <StatusCard
            label={t("supplierAnalytics.cards.procurementExpenses")}
            value={stats.procurementExpenses}
            description={t("supplierAnalytics.cards.factoryPurchases")}
            icon={FiTrendingDown}
            iconTone="red"
            className="shadow-sm"
          />
          <StatusCard
            variant="status"
            tone="success"
            label={t("supplierAnalytics.cards.netProfit")}
            value={stats.netProfit}
            icon={FiTrendingUp}
            className="shadow-sm"
          />
          <StatusCard
            variant="status"
            tone="warning"
            label={t("supplierAnalytics.cards.outstandingDues")}
            value={stats.outstandingDues}
            description={t("supplierAnalytics.cards.fromCompanyClients")}
            icon={FiAlertCircle}
            className="shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <RevenueExpensesProfitChart analytics={analytics} />
          <RevenueBreakdownChart analytics={analytics} />
        </div>

        <SalesByCustomerTypeChart analytics={analytics} />
      </div>
    </>
  );
}
