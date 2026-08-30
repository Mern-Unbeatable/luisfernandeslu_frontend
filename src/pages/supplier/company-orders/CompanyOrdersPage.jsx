import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import StatusCard from "@/components/data-display/StatusCard";
import {
  useGetSupplierCompanyOrderCompaniesQuery,
  useGetSupplierCompanyOrderStatsQuery,
  useGetSupplierCompanyOrdersChatQuery,
  useGetSupplierCompanyOrdersDirectQuery,
  useUpdateSupplierCompanyOrderStatusMutation,
} from "@/features/supplier/company-orders/companyOrdersApi";
import { SUPPLIER_COMPANY_ORDERS_PAGE_SIZE } from "@/data/demoData";

const TAB_IDS = {
  direct: "direct",
  chat: "chat",
};

const STATUS_LABEL_KEYS = {
  new: "panel.supplierCompanyOrders.statusNew",
  pending: "panel.supplierCompanyOrders.statusPending",
  processing: "panel.supplierCompanyOrders.statusProcessing",
  assigned: "panel.supplierCompanyOrders.statusAssigned",
  completed: "panel.supplierCompanyOrders.statusCompleted",
  cancel: "panel.supplierCompanyOrders.statusCancel",
};

const APPROVED_STATUS_OPTIONS = ["pending", "processing", "cancel"];

const STATUS_API_VALUE_MAP = {
  new: "PENDING",
  pending: "PENDING",
  processing: "PROCESSING",
  cancel: "CANCELLED",
  cancelled: "CANCELLED",
  canceled: "CANCELLED",
  completed: "COMPLETED",
  assigned: "PENDING",
};

function normalizeCompanyOrderStatus(rawStatus) {
  const value = String(rawStatus ?? "").trim();
  if (!value) return "new";

  const normalized = value.toLowerCase();
  if (normalized === "in_transit") return "assigned";
  if (normalized === "cancelled" || normalized === "canceled") return "cancel";
  if (normalized === "completed") return "completed";
  if (normalized === "new") return "new";
  if (normalized === "pending") return "pending";
  if (normalized === "processing") return "processing";
  if (normalized === "assigned") return "assigned";
  return normalized;
}

export default function CompanyOrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_IDS.direct);
  const [companyFilter, setCompanyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: companiesResponse } =
    useGetSupplierCompanyOrderCompaniesQuery();
  const { data: directStatsResponse } = useGetSupplierCompanyOrderStatsQuery(
    { type: TAB_IDS.direct },
    { skip: false },
  );
  const { data: chatStatsResponse } = useGetSupplierCompanyOrderStatsQuery(
    { type: TAB_IDS.chat },
    { skip: false },
  );

  const {
    data: directOrdersResponse,
    isLoading: isDirectLoading,
    isFetching: isDirectFetching,
  } = useGetSupplierCompanyOrdersDirectQuery({
    page,
    limit: SUPPLIER_COMPANY_ORDERS_PAGE_SIZE,
    status: statusFilter,
    search,
    companyId: companyFilter,
  });

  const {
    data: chatOrdersResponse,
    isLoading: isChatLoading,
    isFetching: isChatFetching,
  } = useGetSupplierCompanyOrdersChatQuery({
    page,
    limit: SUPPLIER_COMPANY_ORDERS_PAGE_SIZE,
    status: statusFilter,
    search,
    companyId: companyFilter,
  });

  const [updateSupplierCompanyOrderStatus] =
    useUpdateSupplierCompanyOrderStatusMutation();

  const activeOrdersResponse =
    activeTab === TAB_IDS.direct ? directOrdersResponse : chatOrdersResponse;
  const activeStatsResponse =
    activeTab === TAB_IDS.direct ? directStatsResponse : chatStatsResponse;

  const orders = useMemo(
    () => activeOrdersResponse?.orders ?? [],
    [activeOrdersResponse],
  );

  const total = activeOrdersResponse?.total ?? 0;
  const pageCount = Math.max(
    1,
    Math.ceil(total / SUPPLIER_COMPANY_ORDERS_PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);

  const stats = useMemo(() => {
    const source = activeStatsResponse?.stats ?? activeStatsResponse ?? {};

    if (activeTab === TAB_IDS.direct) {
      return {
        totalOrders: Number(source.totalOrders ?? source.total ?? 0),
        pending: Number(source.pending ?? 0),
        processing: Number(source.processing ?? 0),
        completed: Number(source.completed ?? 0),
      };
    }

    return {
      activeCompanyOrders: Number(source.activeCompanyOrders ?? 0),
      totalB2bRevenue: source.totalB2bRevenue ?? source.totalRevenue ?? "€0",
      installmentActive: source.installmentActive ?? source.installment ?? "0",
      paymentOverdue: source.paymentOverdue ?? source.overdue ?? "€0",
    };
  }, [activeStatsResponse, activeTab]);

  const tabs = useMemo(
    () => [
      {
        id: TAB_IDS.direct,
        label: t("panel.supplierCompanyOrders.tabDirectOrders"),
      },
      {
        id: TAB_IDS.chat,
        label: t("panel.supplierCompanyOrders.tabChatOrders"),
      },
    ],
    [t],
  );

  const companyOptions = useMemo(
    () => [
      { value: "all", label: t("panel.supplierCompanyOrders.allCompany") },
      ...(companiesResponse ?? []).map((company) => ({
        value: company.value,
        label: company.label,
      })),
    ],
    [companiesResponse, t],
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("panel.supplierCompanyOrders.allStatus") },
      { value: "new", label: t("panel.supplierCompanyOrders.statusNew") },
      {
        value: "pending",
        label: t("panel.supplierCompanyOrders.statusPending"),
      },
      {
        value: "processing",
        label: t("panel.supplierCompanyOrders.statusProcessing"),
      },
      {
        value: "assigned",
        label: t("panel.supplierCompanyOrders.statusAssigned"),
      },
      { value: "cancel", label: t("panel.supplierCompanyOrders.statusCancel") },
      {
        value: "completed",
        label: t("panel.supplierCompanyOrders.statusCompleted"),
      },
    ],
    [t],
  );

  const statCards = useMemo(() => {
    if (activeTab === TAB_IDS.direct) {
      return [
        {
          id: "totalOrders",
          labelKey: "panel.supplierCompanyOrders.totalOrders",
          valueKey: "totalOrders",
          variant: "summary",
        },
        {
          id: "pending",
          labelKey: "panel.supplierCompanyOrders.pending",
          valueKey: "pending",
          variant: "badge",
          tone: "warning",
        },
        {
          id: "processing",
          labelKey: "panel.supplierCompanyOrders.processing",
          valueKey: "processing",
          variant: "summary",
        },
        {
          id: "completed",
          labelKey: "panel.supplierCompanyOrders.completed",
          valueKey: "completed",
          variant: "badge",
          tone: "success",
        },
      ];
    }

    return [
      {
        id: "activeCompanyOrders",
        labelKey: "panel.supplierCompanyOrders.activeCompanyOrders",
        valueKey: "activeCompanyOrders",
        variant: "summary",
      },
      {
        id: "totalB2bRevenue",
        labelKey: "panel.supplierCompanyOrders.totalB2bRevenue",
        valueKey: "totalB2bRevenue",
        variant: "summary",
      },
      {
        id: "installmentActive",
        labelKey: "panel.supplierCompanyOrders.installmentActive",
        valueKey: "installmentActive",
        variant: "summary",
      },
      {
        id: "paymentOverdue",
        labelKey: "panel.supplierCompanyOrders.paymentOverdue",
        valueKey: "paymentOverdue",
        variant: "status",
        tone: "danger",
      },
    ];
  }, [activeTab]);

  const handleStatusChange = useCallback(
    (row, nextStatus) => {
      const mappedStatus = STATUS_API_VALUE_MAP[nextStatus] ?? "PENDING";
      updateSupplierCompanyOrderStatus({
        id: row.id,
        status: mappedStatus,
      });
    },
    [updateSupplierCompanyOrderStatus],
  );

  const handleAcceptOrder = useCallback(
    (row) => {
      handleStatusChange(row, "pending");
    },
    [handleStatusChange],
  );

  const getRowActions = useCallback(
    (row) => {
      const normalizedStatus = normalizeCompanyOrderStatus(row.status);
      const seeDetails = {
        id: "see-details",
        label: t("panel.supplierCompanyOrders.actionSeeDetails"),
        variant: "header",
        onClick: (order) => {
          navigate(`/supplier/company-orders/${order.id}`, {
            state: { status: order.status, tab: order.tab },
          });
        },
      };

      if (normalizedStatus === "new") {
        return [
          seeDetails,
          {
            id: "accept",
            label: t("panel.supplierCompanyOrders.actionAccept"),
            onClick: handleAcceptOrder,
          },
        ];
      }

      return [
        seeDetails,
        {
          id: "status-section",
          label: t("panel.supplierCompanyOrders.statusSection"),
          variant: "section",
        },
        ...APPROVED_STATUS_OPTIONS.map((status) => ({
          id: `set-${status}`,
          label: t(STATUS_LABEL_KEYS[status]),
          onClick: (order) => handleStatusChange(order, status),
        })),
      ];
    },
    [t, handleAcceptOrder, handleStatusChange, navigate],
  );

  const rows = useMemo(
    () =>
      orders.map((row) => {
        const normalizedStatus = normalizeCompanyOrderStatus(row.status);
        return {
          ...row,
          status: normalizedStatus,
          statusLabel: t(STATUS_LABEL_KEYS[normalizedStatus] || ""),
        };
      }),
    [orders, t],
  );

  const directColumns = useMemo(
    () => [
      {
        key: "orderId",
        header: t("panel.supplierCompanyOrders.colOrderId"),
      },
      {
        key: "customerName",
        header: t("panel.supplierCompanyOrders.colCustomerName"),
      },
      {
        key: "email",
        header: t("panel.supplierCompanyOrders.colEmail"),
      },
      {
        key: "items",
        header: t("panel.supplierCompanyOrders.colItems"),
      },
      {
        key: "total",
        header: t("panel.supplierCompanyOrders.colTotal"),
      },
      {
        key: "status",
        header: t("panel.supplierCompanyOrders.colStatus"),
        render: (value, row) => (
          <StatusBadge
            status={value}
            label={row.statusLabel}
            className="rounded-full"
          />
        ),
      },
      {
        key: "date",
        header: t("panel.supplierCompanyOrders.colDate"),
      },
    ],
    [t],
  );

  const chatColumns = useMemo(
    () => [
      {
        key: "orderId",
        header: t("panel.supplierCompanyOrders.colOrderId"),
      },
      {
        key: "companyName",
        header: t("panel.supplierCompanyOrders.colCompanyName"),
      },
      {
        key: "total",
        header: t("panel.supplierCompanyOrders.colTotal"),
      },
      {
        key: "installmentAmount",
        header: t("panel.supplierCompanyOrders.colInstallmentAmount"),
      },
      {
        key: "status",
        header: t("panel.supplierCompanyOrders.colStatus"),
        render: (value, row) => (
          <StatusBadge
            status={value}
            label={row.statusLabel}
            className="rounded-full"
          />
        ),
      },
      {
        key: "installmentNumber",
        header: t("panel.supplierCompanyOrders.colInstallmentNumber"),
      },
      {
        key: "date",
        header: t("panel.supplierCompanyOrders.colDate"),
      },
    ],
    [t],
  );

  const columns = activeTab === TAB_IDS.direct ? directColumns : chatColumns;
  const from =
    total === 0 ? 0 : (safePage - 1) * SUPPLIER_COMPANY_ORDERS_PAGE_SIZE + 1;
  const to =
    total === 0
      ? 0
      : Math.min(safePage * SUPPLIER_COMPANY_ORDERS_PAGE_SIZE, total);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setPage(1);
    setSearch("");
  }, []);

  const tableFilters = useMemo(
    () => [
      {
        id: "company",
        value: companyFilter,
        onChange: (value) => {
          setCompanyFilter(value);
          setPage(1);
        },
        options: companyOptions,
        placeholder: t("panel.supplierCompanyOrders.allCompany"),
      },
      {
        id: "status",
        value: statusFilter,
        onChange: (value) => {
          setStatusFilter(value);
          setPage(1);
        },
        options: statusOptions,
        placeholder: t("panel.supplierCompanyOrders.allStatus"),
      },
    ],
    [companyFilter, statusFilter, companyOptions, statusOptions, t],
  );

  const loading =
    activeTab === TAB_IDS.direct
      ? isDirectLoading || isDirectFetching
      : isChatLoading || isChatFetching;

  return (
    <>
      <Seo title={t("panel.supplierCompanyOrders.title")} />

      <div className="mb-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t("panel.supplierCompanyOrders.title")}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("panel.supplierCompanyOrders.subtitle")}
          </p>
        </header>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const value = stats[card.valueKey];

          return (
            <StatusCard
              key={card.id}
              variant={card.variant}
              label={t(card.labelKey)}
              value={value}
              badge={card.variant === "badge" ? value : undefined}
              tone={card.tone}
              className="shadow-sm"
            />
          );
        })}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <DataTable
          showCard={false}
          showTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          columns={columns}
          data={rows}
          getRowKey={(row) => row.id}
          showActions
          getActions={getRowActions}
          actionHeader={t("panel.supplierCompanyOrders.colAction")}
          emptyMessage={t("panel.supplierCompanyOrders.emptyOrders")}
          showPagination
          showSearch
          loading={loading}
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder={t("panel.supplierCompanyOrders.searchPlaceholder")}
          showFilters
          filterLabel={t("panel.supplierCompanyOrders.sortBy")}
          filters={tableFilters}
          pagination={{
            page: safePage,
            pageSize: SUPPLIER_COMPANY_ORDERS_PAGE_SIZE,
            total,
            from,
            to,
            hasPrevious: safePage > 1,
            hasNext: safePage < pageCount,
            onPageChange: setPage,
            summaryLabel: t("panel.supplierCompanyOrders.showingResults", {
              from,
              to,
              total,
            }),
            previousLabel: t("panel.supplierCompanyOrders.previous"),
            nextLabel: t("panel.supplierCompanyOrders.next"),
          }}
        />
      </section>
    </>
  );
}
