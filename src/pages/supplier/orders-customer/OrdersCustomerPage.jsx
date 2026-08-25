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
import {
  CUSTOMER_ORDER_FILTER_STATUSES,
  CUSTOMER_ORDER_STATUS_ALL,
  CUSTOMER_ORDER_STATUS_CONFIG,
  CUSTOMER_ORDER_STATUSES,
  CUSTOMER_ORDER_STATUS_LABEL_KEYS,
  normalizeCustomerOrderStatus,
} from "@/features/orders/customerOrderStatus";
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
    id: "assigned",
    labelKey: "panel.supplierCustomerOrders.statusAssigned",
    valueKey: "assigned",
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

const FALLBACK_STATUS_TRANSITIONS = {
  [CUSTOMER_ORDER_STATUSES.PENDING]: [
    CUSTOMER_ORDER_STATUSES.PROCESSING,
    CUSTOMER_ORDER_STATUSES.CANCELLED,
  ],
  [CUSTOMER_ORDER_STATUSES.PROCESSING]: [
    CUSTOMER_ORDER_STATUSES.IN_TRANSIT,
    CUSTOMER_ORDER_STATUSES.CANCELLED,
  ],
  [CUSTOMER_ORDER_STATUSES.IN_TRANSIT]: [
    CUSTOMER_ORDER_STATUSES.COMPLETED,
    CUSTOMER_ORDER_STATUSES.CANCELLED,
  ],
};

function titleCaseStatus(status) {
  return String(status ?? "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function normalizeSearchStatusTerm(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export default function OrdersCustomerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState(CUSTOMER_ORDER_STATUS_ALL);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const searchStatusAliases = useMemo(() => {
    const list = [
      {
        term: t("panel.supplierCustomerOrders.statusNew"),
        status: CUSTOMER_ORDER_STATUSES.NEW,
      },
      {
        term: t("panel.supplierCustomerOrders.statusPending"),
        status: CUSTOMER_ORDER_STATUSES.PENDING,
      },
      {
        term: t("panel.supplierCustomerOrders.statusProcessing"),
        status: CUSTOMER_ORDER_STATUSES.PROCESSING,
      },
      {
        term: t("panel.supplierCustomerOrders.statusAssigned"),
        status: CUSTOMER_ORDER_STATUSES.IN_TRANSIT,
      },
      {
        term: t("panel.supplierCustomerOrders.statusCancel"),
        status: CUSTOMER_ORDER_STATUSES.CANCELLED,
      },
      {
        term: t("panel.supplierCustomerOrders.statusCompleted"),
        status: CUSTOMER_ORDER_STATUSES.COMPLETED,
      },
    ];

    return Object.fromEntries(
      list.map((item) => [normalizeSearchStatusTerm(item.term), item.status]),
    );
  }, [t]);

  const apiSearch = useMemo(() => {
    const normalized = normalizeSearchStatusTerm(search);
    return searchStatusAliases[normalized] ?? search;
  }, [search, searchStatusAliases]);

  const {
    data: ordersResponse,
    isLoading,
    isFetching,
  } = useGetSupplierCustomerOrdersQuery({
    page,
    limit: SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE,
    status: statusFilter,
    search: apiSearch,
  });
  const { data: statsResponse } = useGetSupplierCustomerOrderStatsQuery();
  const [updateSupplierCustomerOrderStatus] =
    useUpdateSupplierCustomerOrderStatusMutation();

  const orders = useMemo(() => ordersResponse?.orders ?? [], [ordersResponse]);

  const stats = useMemo(() => {
    const byStatus =
      statsResponse?.statusCounts ??
      statsResponse?.byStatus ??
      statsResponse?.statuses ??
      {};
    const countByStatus = (status, alternateKeys = []) => {
      const key = String(status ?? "");
      const lowerKey = key.toLowerCase();
      const values = [
        statsResponse?.[key],
        statsResponse?.[lowerKey],
        byStatus?.[key],
        byStatus?.[lowerKey],
        ...alternateKeys.map((item) => statsResponse?.[item]),
        ...alternateKeys.map((item) => byStatus?.[item]),
      ];
      const resolved = values.find((item) => Number.isFinite(Number(item)));
      return Number(resolved ?? 0);
    };

    return {
      totalOrders:
        Number(
          statsResponse?.totalOrders ??
            statsResponse?.total ??
            statsResponse?.count,
        ) || 0,
      pending: countByStatus(CUSTOMER_ORDER_STATUSES.PENDING),
      processing: countByStatus(CUSTOMER_ORDER_STATUSES.PROCESSING),
        assigned: countByStatus(CUSTOMER_ORDER_STATUSES.IN_TRANSIT, [
        "inTransit",
        "in_transit",
      ]),
        cancel: countByStatus(CUSTOMER_ORDER_STATUSES.CANCELLED, [
          "cancelled",
          "canceled",
          "cancel",
        ]),
      completed: countByStatus(CUSTOMER_ORDER_STATUSES.COMPLETED),
    };
  }, [statsResponse]);

  const rows = useMemo(
    () =>
      orders.map((order) => {
        const status = normalizeCustomerOrderStatus(
          order.orderStatus ?? order.status,
        );
        const statusLabelKey = CUSTOMER_ORDER_STATUS_CONFIG[status]?.labelKey;

        return {
          ...order,
          status,
          statusLabel: statusLabelKey ? t(statusLabelKey) : titleCaseStatus(status),
        };
      }),
    [orders, t],
  );

  const statusOptions = useMemo(
    () => [
      {
        value: CUSTOMER_ORDER_STATUS_ALL,
        label: t("panel.supplierCustomerOrders.allStatus"),
      },
      ...CUSTOMER_ORDER_FILTER_STATUSES.map((value) => ({
        value,
        label: t(CUSTOMER_ORDER_STATUS_LABEL_KEYS[value]),
      })),
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
      handleStatusChange(row, CUSTOMER_ORDER_STATUSES.PENDING);
    },
    [handleStatusChange],
  );

  const buildStatusActions = useCallback((row) => {
    const transitions = [];

    if (row.canMarkProcessing) {
      transitions.push(CUSTOMER_ORDER_STATUSES.PROCESSING);
    }
    if (row.canMarkInTransit) {
      transitions.push(CUSTOMER_ORDER_STATUSES.IN_TRANSIT);
    }
    if (row.canComplete) {
      transitions.push(CUSTOMER_ORDER_STATUSES.COMPLETED);
    }
    if (row.canCancel) {
      transitions.push(CUSTOMER_ORDER_STATUSES.CANCELLED);
    }

    if (transitions.length === 0) {
      transitions.push(...(FALLBACK_STATUS_TRANSITIONS[row.status] ?? []));
    }

    return [...new Set(transitions)].filter((status) => status !== row.status);
  }, []);

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

      const transitions = buildStatusActions(row);
      const canAccept =
        row.canAccept === true ||
        normalizeCustomerOrderStatus(row.status) === "NEW";
      const actions = [seeDetails];

      if (canAccept) {
        actions.push({
          id: "accept",
          label: t("panel.supplierCustomerOrders.actionAccept"),
          onClick: handleAcceptOrder,
        });
      }

      if (transitions.length > 0) {
        actions.push({
          id: "status-section",
          label: t("panel.supplierCustomerOrders.statusSection"),
          variant: "section",
        });

        actions.push(
          ...transitions.map((status) => ({
            id: `set-${status}`,
            label: t(CUSTOMER_ORDER_STATUS_CONFIG[status]?.labelKey),
            onClick: (order) => handleStatusChange(order, status),
          })),
        );
      }

      return actions;
    },
    [t, handleAcceptOrder, handleStatusChange, navigate, buildStatusActions],
  );

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

  const total = ordersResponse?.total ?? rows.length;
  const pageCount = Math.max(
    1,
    Number(ordersResponse?.totalPages) ||
      Math.ceil(total / SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);
  const pagedOrders = rows;

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
    Number(ordersResponse?.from) ||
    (total === 0 ? 0 : (safePage - 1) * SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE + 1);
  const to =
    Number(ordersResponse?.to) ||
    (total === 0
      ? 0
      : Math.min(safePage * SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE, total));

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

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
          loading={isLoading || isFetching}
          showActions
          getActions={getRowActions}
          actionHeader={t("panel.supplierCustomerOrders.colAction")}
          emptyMessage={t("panel.supplierCustomerOrders.emptyOrders")}
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
            pageSize:
              Number(ordersResponse?.limit) ||
              SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE,
            total,
            from,
            to,
            hasPrevious:
              ordersResponse?.hasPrevious != null
                ? ordersResponse.hasPrevious
                : safePage > 1,
            hasNext:
              ordersResponse?.hasNext != null
                ? ordersResponse.hasNext
                : safePage < pageCount,
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
