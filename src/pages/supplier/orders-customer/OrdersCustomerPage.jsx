import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import StatusCard from "@/components/data-display/StatusCard";
import {
  useGetSupplierCustomerOrderStatsQuery,
  useGetSupplierCustomerOrdersQuery,
  useUpdateSupplierCustomerOrderStatusMutation,
} from "@/features/orders/orderApi";
import { SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE } from "@/data/demoData";

const CUSTOMER_ORDER_STAT_CARDS = [
  {
    id: "totalOrders",
    labelKey: "panel.supplierCustomerOrders.totalOrders",
    valueKey: "totalOrders",
    variant: "summary",
  },
  {
    id: "pending",
    labelKey: "panel.supplierCustomerOrders.pending",
    valueKey: "pending",
    variant: "badge",
    tone: "warning",
  },
  {
    id: "processing",
    labelKey: "panel.supplierCustomerOrders.processing",
    valueKey: "processing",
    variant: "summary",
  },
  {
    id: "completed",
    labelKey: "panel.supplierCustomerOrders.completed",
    valueKey: "completed",
    variant: "badge",
    tone: "success",
  },
];

const STATUS_LABEL_KEYS = {
  new: "panel.supplierCustomerOrders.statusNew",
  pending: "panel.supplierCustomerOrders.statusPending",
  processing: "panel.supplierCustomerOrders.statusProcessing",
  assigned: "panel.supplierCustomerOrders.statusAssigned",
  completed: "panel.supplierCustomerOrders.statusCompleted",
  cancel: "panel.supplierCustomerOrders.statusCancel",
};

const APPROVED_STATUS_OPTIONS = [
  "pending",
  "processing",
  "assigned",
  "completed",
  "cancel",
];

export default function OrdersCustomerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: ordersResponse,
    isLoading,
    isFetching,
  } = useGetSupplierCustomerOrdersQuery({
    page,
    limit: SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE,
    status: statusFilter,
    search,
  });
  const { data: statsResponse } = useGetSupplierCustomerOrderStatsQuery();
  const [updateSupplierCustomerOrderStatus] =
    useUpdateSupplierCustomerOrderStatusMutation();

  const orders = useMemo(() => ordersResponse?.orders ?? [], [ordersResponse]);
  const normalizedOrders = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        status: String(order.status ?? "")
          .trim()
          .toLowerCase(),
      })),
    [orders],
  );
  const stats = useMemo(
    () => ({
      totalOrders: statsResponse?.totalOrders ?? 0,
      pending: statsResponse?.pending ?? 0,
      processing: statsResponse?.processing ?? 0,
      completed: statsResponse?.completed ?? 0,
    }),
    [statsResponse],
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("panel.supplierCustomerOrders.allStatus") },
      { value: "new", label: t("panel.supplierCustomerOrders.statusNew") },
      {
        value: "pending",
        label: t("panel.supplierCustomerOrders.statusPending"),
      },
      {
        value: "processing",
        label: t("panel.supplierCustomerOrders.statusProcessing"),
      },
      {
        value: "assigned",
        label: t("panel.supplierCustomerOrders.statusAssigned"),
      },
      {
        value: "cancel",
        label: t("panel.supplierCustomerOrders.statusCancel"),
      },
      {
        value: "completed",
        label: t("panel.supplierCustomerOrders.statusCompleted"),
      },
    ],
    [t],
  );

  const handleStatusChange = useCallback(
    (row, status) => {
      updateSupplierCustomerOrderStatus({ id: row.id, status });
    },
    [updateSupplierCustomerOrderStatus],
  );

  const handleAcceptOrder = useCallback(
    (row) => {
      handleStatusChange(row, "pending");
    },
    [handleStatusChange],
  );

  const getRowActions = useCallback(
    (row) => {
      const seeDetails = {
        id: "see-details",
        label: t("panel.supplierCustomerOrders.actionSeeDetails"),
        variant: "header",
        onClick: (order) => {
          navigate(`/supplier/orders-customer/${order.id}`, {
            state: { status: order.status },
          });
        },
      };

      if (row.status === "new") {
        return [
          seeDetails,
          {
            id: "accept",
            label: t("panel.supplierCustomerOrders.actionAccept"),
            onClick: handleAcceptOrder,
          },
        ];
      }

      return [
        seeDetails,
        {
          id: "status-section",
          label: t("panel.supplierCustomerOrders.statusSection"),
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

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return normalizedOrders.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = [
        row.orderId,
        row.customerName,
        row.email,
        row.items,
        row.total,
        row.status,
        row.statusLabel,
        row.date,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [normalizedOrders, search, statusFilter]);

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
        placeholder: t("panel.supplierCustomerOrders.allStatus"),
      },
    ],
    [statusFilter, statusOptions, t],
  );

  const total =
    statusFilter !== "all" || search.trim()
      ? filteredOrders.length
      : (ordersResponse?.total ?? filteredOrders.length);
  const pageCount = Math.max(
    1,
    Math.ceil(total / SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);
  const pagedOrders = filteredOrders;

  const columns = useMemo(
    () => [
      {
        key: "orderId",
        header: t("panel.supplierCustomerOrders.colOrderId"),
      },
      {
        key: "customerName",
        header: t("panel.supplierCustomerOrders.colCustomerName"),
      },
      {
        key: "email",
        header: t("panel.supplierCustomerOrders.colEmail"),
      },
      {
        key: "items",
        header: t("panel.supplierCustomerOrders.colItems"),
      },
      {
        key: "total",
        header: t("panel.supplierCustomerOrders.colTotal"),
      },
      {
        key: "status",
        header: t("panel.supplierCustomerOrders.colStatus"),
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
        header: t("panel.supplierCustomerOrders.colDate"),
      },
    ],
    [t],
  );

  const from =
    total === 0 ? 0 : (safePage - 1) * SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE + 1;
  const to =
    total === 0
      ? 0
      : Math.min(safePage * SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE, total);

  return (
    <>
      <Seo title={t("panel.supplierCustomerOrders.title")} />

      <div className="mb-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t("panel.supplierCustomerOrders.title")}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("panel.supplierCustomerOrders.subtitle")}
          </p>
        </header>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CUSTOMER_ORDER_STAT_CARDS.map((card) => {
          const value = stats[card.valueKey] ?? 0;

          return (
            <StatusCard
              key={card.id}
              variant={card.variant}
              label={t(card.labelKey)}
              value={value}
              badge={card.variant === "badge" ? value : undefined}
              icon={card.icon}
              iconTone={card.iconTone}
              tone={card.tone}
              className="shadow-sm"
            />
          );
        })}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <DataTable
          showCard={false}
          columns={columns}
          data={pagedOrders}
          getRowKey={(row) => row.id}
          showActions
          getActions={getRowActions}
          actionHeader={t("panel.supplierCustomerOrders.colAction")}
          emptyMessage={
            isLoading || isFetching
              ? t("panel.supplierCustomerOrders.loadingOrders")
              : t("panel.supplierCustomerOrders.emptyOrders")
          }
          showPagination
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder={t(
            "panel.supplierCustomerOrders.searchPlaceholder",
          )}
          showFilters
          filterLabel={t("panel.supplierProducts.filters")}
          filters={tableFilters}
          pagination={{
            page: safePage,
            pageSize: SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE,
            total,
            from,
            to,
            hasPrevious: safePage > 1,
            hasNext: safePage < pageCount,
            onPageChange: setPage,
            summaryLabel: t("panel.supplierCustomerOrders.showingResults", {
              from,
              to,
              total,
            }),
            previousLabel: t("panel.supplierCustomerOrders.previous"),
            nextLabel: t("panel.supplierCustomerOrders.next"),
          }}
        />
      </section>
    </>
  );
}
