import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import DataTable from "@/components/data-display/DataTable/DataTable";
import {
  DEMO_SUPPLIER_DISPUTES,
  SUPPLIER_DISPUTES_PAGE_SIZE,
} from "@/data/demoData";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import {
  useGetSupplierDisputesQuery,
  useUpdateSupplierDisputeStatusMutation,
} from "@/features/supplier/disputes/disputesApi";
import DisputeStatusBadge from "./DisputeStatusBadge";

const STATUS_FILTER_OPTIONS = ["all", "pending", "under_review", "resolved"];

const STATUS_ACTION_OPTIONS = ["under_review", "resolved"];

export default function DisputesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useGetSupplierDisputesQuery();
  const [updateDisputeStatus] = useUpdateSupplierDisputeStatusMutation();

  const rows = data?.disputes ?? DEMO_SUPPLIER_DISPUTES;
  const stats = data?.stats ?? {
    total: DEMO_SUPPLIER_DISPUTES.length,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
  };

  const pageSize = SUPPLIER_DISPUTES_PAGE_SIZE;
  const errorMessage = error
    ? getApiErrorMessage(error, t("common.requestFailed"))
    : "";

  const statusOptions = useMemo(
    () =>
      STATUS_FILTER_OPTIONS.map((value) => ({
        value,
        label:
          value === "all"
            ? t("supplierDisputesResolution.filters.allStatus")
            : t(`supplierDisputesResolution.status.${value}`),
      })),
    [t],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;

      const statusLabel = t(
        `supplierDisputesResolution.status.${row.status}`,
      ).toLowerCase();

      return (
        String(row.disputeId).toLowerCase().includes(q) ||
        String(row.orderId).toLowerCase().includes(q) ||
        String(row.customer).toLowerCase().includes(q) ||
        String(row.supplier).toLowerCase().includes(q) ||
        String(row.issue).toLowerCase().includes(q) ||
        String(row.registered).toLowerCase().includes(q) ||
        String(row.status).toLowerCase().includes(q) ||
        statusLabel.includes(q)
      );
    });
  }, [rows, statusFilter, search, t]);

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
        placeholder: t("supplierDisputesResolution.filters.allStatus"),
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
        label: t("supplierDisputesResolution.actions.seeDetails"),
        variant: "header",
        onClick: (item) => navigate(`/supplier/disputes/${item.id}`),
      },
      {
        id: "status-heading",
        label: t("supplierDisputesResolution.actions.status"),
        variant: "section",
      },
      ...STATUS_ACTION_OPTIONS.map((status) => ({
        id: `set-${status}`,
        label: t(`supplierDisputesResolution.status.${status}`),
        onClick: (item) => {
          void updateDisputeStatus({ id: item.id, status });
        },
      })),
    ],
    [navigate, t, updateDisputeStatus],
  );

  const columns = useMemo(
    () => [
      {
        key: "disputeId",
        header: t("supplierDisputesResolution.columns.disputeId"),
        render: (value) => (
          <span className="font-medium text-[var(--primary-text)]">
            {value}
          </span>
        ),
      },
      {
        key: "orderId",
        header: t("supplierDisputesResolution.columns.orderId"),
        render: (value) => (
          <span className="text-[var(--secondary-text)]">{value}</span>
        ),
      },
      {
        key: "customer",
        header: t("supplierDisputesResolution.columns.customer"),
      },
      {
        key: "supplier",
        header: t("supplierDisputesResolution.columns.supplier"),
      },
      {
        key: "issue",
        header: t("supplierDisputesResolution.columns.issue"),
      },
      {
        key: "status",
        header: t("supplierDisputesResolution.columns.status"),
        render: (value) => (
          <DisputeStatusBadge
            status={value}
            label={t(`supplierDisputesResolution.status.${value}`)}
          />
        ),
      },
      {
        key: "registered",
        header: t("supplierDisputesResolution.columns.registered"),
      },
    ],
    [t],
  );

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total);

  return (
    <>
      <Seo
        title={t("supplierDisputesResolution.title")}
        description={t("supplierDisputesResolution.subtitle")}
      />
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t("supplierDisputesResolution.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t("supplierDisputesResolution.subtitle")}
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

        <DataTable
          columns={columns}
          data={paged}
          loading={isLoading || isFetching}
          getRowKey={(row) => row.id}
          emptyMessage={t("supplierDisputesResolution.empty")}
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder={t("supplierDisputesResolution.searchPlaceholder")}
          showFilters
          filterLabel={t("supplierDisputesResolution.sortBy")}
          filters={tableFilters}
          showActions
          actionType="menu"
          getActions={getRowActions}
          actionHeader={t("supplierDisputesResolution.columns.action")}
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
            summaryLabel: t("supplierDisputesResolution.pagination.summary", {
              from,
              to,
              total,
            }),
            previousLabel: t("supplierDisputesResolution.pagination.previous"),
            nextLabel: t("supplierDisputesResolution.pagination.next"),
          }}
        />
      </div>
    </>
  );
}
