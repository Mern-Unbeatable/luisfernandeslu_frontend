import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowDownLeft,
  FiBarChart2,
  FiDollarSign,
  FiDownload,
} from "react-icons/fi";
import Seo from "@/components/common/Seo/Seo";
import StatusCard from "@/components/data-display/StatusCard";
import DataTable from "@/components/data-display/DataTable/DataTable";
import {
  DEMO_SUPPLIER_PAYMENTS_STATS,
  SUPPLIER_PAYMENTS_PAGE_SIZE,
} from "@/data/demoData";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import {
  useGetSupplierCommissionInvoicesQuery,
  useLazyGetSupplierCommissionInvoicePdfQuery,
} from "@/features/supplier/commission-invoices/commissionInvoicesApi";

function formatCurrency(value) {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed)) return String(value ?? "€0");

  return `€${parsed.toLocaleString("en-US", {
    minimumFractionDigits: parsed % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function PaymentsFinancePage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const pageSize = SUPPLIER_PAYMENTS_PAGE_SIZE;
  const { data, isLoading, isFetching, error } =
    useGetSupplierCommissionInvoicesQuery({
      page,
      limit: pageSize,
      search,
    });
  const [loadInvoicePdf] = useLazyGetSupplierCommissionInvoicePdfQuery();

  const handleDownload = useCallback(
    async (row) => {
      if (!row?.invoiceId) return;
      try {
        const blob = await loadInvoicePdf(row.invoiceId).unwrap();
        downloadBlob(
          blob,
          `commission-invoice-${String(row.invoiceId).replace(/\s+/g, "-")}.pdf`,
        );
      } catch (downloadError) {
        console.error(downloadError);
      }
    },
    [loadInvoicePdf],
  );

  const columns = useMemo(
    () => [
      {
        key: "date",
        header: t("supplierPaymentsFinance.invoiceColumns.date"),
      },
      {
        key: "invoiceId",
        header: t("supplierPaymentsFinance.invoiceColumns.invoiceId"),
      },
      {
        key: "orderId",
        header: t("supplierPaymentsFinance.invoiceColumns.orderId"),
      },
      {
        key: "participant",
        header: t("supplierPaymentsFinance.invoiceColumns.participant"),
      },
      {
        key: "amount",
        header: t("supplierPaymentsFinance.invoiceColumns.amount"),
        render: (value) => formatCurrency(value),
      },
      {
        key: "actions",
        header: t("supplierPaymentsFinance.invoiceColumns.actions"),
        render: (_, row) => (
          <button
            type="button"
            onClick={() => handleDownload(row)}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-[var(--active)] transition-colors hover:bg-[color-mix(in_srgb,var(--active)_12%,transparent)]"
          >
            <FiDownload className="size-4" aria-hidden />
            {t("supplierPaymentsFinance.invoiceActions.download")}
          </button>
        ),
      },
    ],
    [t],
  );

  const invoices = useMemo(() => data?.invoices || [], [data]);
  const pageCount = Math.max(1, Number(data?.totalPages || 1));
  const safePage = Math.min(page, pageCount);
  const paged = invoices;

  const activeStats = data?.stats || DEMO_SUPPLIER_PAYMENTS_STATS;

  const activeErrorMessage = error
    ? getApiErrorMessage(error, t("common.requestFailed"))
    : "";

  return (
    <>
      <Seo title={t("supplierPaymentsFinance.title")} />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t("supplierPaymentsFinance.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t("supplierPaymentsFinance.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            label={t("supplierPaymentsFinance.cards.totalEarnings")}
            value={
              activeStats.totalEarnings ??
              DEMO_SUPPLIER_PAYMENTS_STATS.totalEarnings
            }
            description={t("supplierPaymentsFinance.cards.thisMonth")}
            icon={FiArrowDownLeft}
            iconTone="brand"
          />
          <StatusCard
            label={t("supplierPaymentsFinance.cards.availableBalance")}
            value={
              activeStats.availableBalance ??
              DEMO_SUPPLIER_PAYMENTS_STATS.availableBalance
            }
            description={t("supplierPaymentsFinance.cards.withdrawNote")}
            icon={FiDollarSign}
            iconTone="brand"
            actionLabel={t('supplierPaymentsFinance.cards.withdrawFunds')}
            onAction={openWithdraw}
          /> 
          {/*<StatusCard
            label={t('supplierPaymentsFinance.cards.pendingAmount')}
            value={DEMO_SUPPLIER_PAYMENTS_STATS.pendingAmount}
            icon={FiBarChart2}
            iconTone="brand"
          />*/}
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t("supplierPaymentsFinance.commissionInvoices")}
          </h2>

          {activeErrorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {activeErrorMessage}
            </div>
          ) : null}

          <DataTable
            showSearch
            searchValue={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            searchPlaceholder={t(
              "supplierPaymentsFinance.invoiceSearchPlaceholder",
            )}
            columns={columns}
            data={paged}
            loading={isLoading || isFetching}
            emptyMessage={t("supplierPaymentsFinance.invoiceEmpty")}
            showPagination
            pagination={{
              page: safePage,
              pageSize,
              total: data?.total || invoices.length,
              onPageChange: setPage,
            }}
          />
        </section>
      </div>
    </>
  );
}
