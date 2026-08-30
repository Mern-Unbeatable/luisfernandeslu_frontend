import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import DataTable from "@/components/data-display/DataTable/DataTable";
import {
  DEMO_SUPPLIER_RETURN_REQUESTS,
  SUPPLIER_RETURN_REQUESTS_PAGE_SIZE,
} from "@/data/demoData";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import {
  useGetSupplierReturnRequestsQuery,
  useUpdateSupplierReturnRequestStatusMutation,
} from "@/features/supplier/return-requests/returnRequestsApi";
import ReturnStatusBadge from "./ReturnStatusBadge";

const STATUS_FILTER_OPTIONS = [
  "all",
  "pending",
  "under_review",
  "approved",
  "rejected",
  "item_received",
  "inspection_progress",
  "inspection_pass",
  "inspection_rejected",
];

const STATUS_ACTION_OPTIONS = [
  "pending",
  "under_review",
  "approved",
  "rejected",
  "item_received",
  "inspection_progress",
  "inspection_pass",
  "inspection_rejected",
];

function getStatusLabel(status, t) {
  if (status === "rejected") {
    return t("supplierReturnRequests.actionReject");
  }
  return t(`supplierReturnRequests.status.${status}`);
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-[var(--secondary-text)]">{label}</p>
      <p className="mt-4 text-3xl font-bold text-[var(--primary-text)]">
        {value}
      </p>
    </div>
  );
}

export default function ReturnRequestsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } =
    useGetSupplierReturnRequestsQuery();
  const [updateReturnStatus] = useUpdateSupplierReturnRequestStatusMutation();

  const returns = data?.returns ?? [];
  const stats = data?.stats ?? DEMO_SUPPLIER_RETURN_REQUESTS.stats;
  const pageSize = SUPPLIER_RETURN_REQUESTS_PAGE_SIZE;
  const errorMessage = error
    ? getApiErrorMessage(error, t("common.requestFailed"))
    : "";

  const statusOptions = useMemo(
    () =>
      STATUS_FILTER_OPTIONS.map((value) => ({
        value,
        label:
          value === "all"
            ? t("supplierReturnRequests.filters.allStatus")
            : t(`supplierReturnRequests.status.${value}`),
      })),
    [t],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return returns.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;

      const statusLabel = t(
        `supplierReturnRequests.status.${row.status}`,
      ).toLowerCase();

      return (
        String(row.returnId).toLowerCase().includes(q) ||
        String(row.orderId).toLowerCase().includes(q) ||
        String(row.customerName).toLowerCase().includes(q) ||
        String(row.customerEmail).toLowerCase().includes(q) ||
        String(row.productName).toLowerCase().includes(q) ||
        String(row.reason).toLowerCase().includes(q) ||
        String(row.requestDate).toLowerCase().includes(q) ||
        String(row.status).toLowerCase().includes(q) ||
        statusLabel.includes(q)
      );
    });
  }, [returns, statusFilter, search, t]);

  const tableFilters = useMemo(
    () => [
      {
        id: "status",
        value: statusFilter,
        onChange: (value) => {
          setStatusFilter(value);
          setPage(1);
        },
        options: statusOptions,
        placeholder: t("supplierReturnRequests.filters.allStatus"),
      },
    ],
    [statusFilter, statusOptions, t],
  );

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const getRowActions = useCallback(
    (row) => [
      {
        id: "see-details",
        label: t("supplierReturnRequests.actionSeeDetails"),
        variant: "header",
        onClick: (item) => navigate(`/supplier/return-requests/${item.id}`),
      },
      ...STATUS_ACTION_OPTIONS.map((status) => ({
        id: `set-${status}`,
        label: getStatusLabel(status, t),
        onClick: (item) => {
          void updateReturnStatus({ id: item.id, status });
        },
      })),
    ],
    [navigate, t, updateReturnStatus],
  );

  const columns = useMemo(
    () => [
      {
        key: "returnId",
        header: t("supplierReturnRequests.columns.returnId"),
        render: (value) => (
          <span className="font-medium text-[var(--primary-text)]">
            {value}
          </span>
        ),
      },
      {
        key: "orderId",
        header: t("supplierReturnRequests.columns.orderId"),
        render: (value) => (
          <span className="text-[var(--secondary-text)]">{value}</span>
        ),
      },
      {
        key: "customerName",
        header: t("supplierReturnRequests.columns.customer"),
        render: (_, row) => (
          <div className="min-w-0">
            <p className="font-bold text-[var(--primary-text)]">
              {row.customerName}
            </p>
            <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
              {row.customerEmail}
            </p>
          </div>
        ),
      },
      {
        key: "productName",
        header: t("supplierReturnRequests.columns.products"),
      },
      {
        key: "reason",
        header: t("supplierReturnRequests.columns.reason"),
      },
      {
        key: "requestDate",
        header: t("supplierReturnRequests.columns.requestDate"),
      },
      {
        key: "status",
        header: t("supplierReturnRequests.columns.status"),
        render: (value) => (
          <ReturnStatusBadge
            status={value}
            label={t(`supplierReturnRequests.status.${value}`)}
          />
        ),
      },
    ],
    [t],
  );

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total);

  return (
    <>
      <Seo title={t("supplierReturnRequests.title")} />
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t("supplierReturnRequests.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t("supplierReturnRequests.subtitle")}
          </p>
        </header>

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
          <StatCard
            label={t("supplierReturnRequests.stats.total")}
            value={stats.total}
          />
          <StatCard
            label={t("supplierReturnRequests.stats.pendingReview")}
            value={stats.pendingReview}
          />
          <StatCard
            label={t("supplierReturnRequests.stats.approved")}
            value={stats.approved}
          />
          <StatCard
            label={t("supplierReturnRequests.stats.rejected")}
            value={stats.rejected}
          />
        </div>

        <DataTable
          columns={columns}
          data={paged}
          loading={isLoading || isFetching}
          getRowKey={(row) => row.id}
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder={t("supplierReturnRequests.searchPlaceholder")}
          showFilters
          filterLabel={t("supplierReturnRequests.sortBy")}
          filters={tableFilters}
          showActions
          actionType="menu"
          getActions={getRowActions}
          actionHeader={t("supplierReturnRequests.columns.action")}
          showPagination
          pagination={{
            page: safePage,
            pageSize,
            total,
            from,
            to,
            hasPrevious: safePage > 1,
            hasNext: safePage < pageCount,
            onPageChange: setPage,
            summaryLabel: t("supplierReturnRequests.showingResults", {
              from,
              to,
              total,
            }),
            previousLabel: t("supplierReturnRequests.previous"),
            nextLabel: t("supplierReturnRequests.next"),
          }}
        />
      </div>
    </>
  );
}
