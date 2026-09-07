import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import {
  useDeleteSupplierFactoryOrderMutation,
  useGetSupplierFactoryOrderFactoriesQuery,
  useGetSupplierFactoryOrdersQuery,
} from "@/features/supplier/factory-orders/factoryOrdersApi";

const SUPPLIER_FACTORY_ORDERS_PAGE_SIZE = 7;

const TAB_IDS = {
  orders: "orders",
  transport: "transport",
};

const STATUS_LABEL_KEYS = {
  produced: "panel.supplierFactoryOrders.statusProduced",
  "in-production": "panel.supplierFactoryOrders.statusInProduction",
  ready: "panel.supplierFactoryOrders.statusReady",
  assigned: "panel.supplierFactoryOrders.statusAssigned",
  cancel: "panel.supplierFactoryOrders.statusCancel",
  completed: "panel.supplierFactoryOrders.statusCompleted",
};

export default function FactoryOrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_IDS.orders);
  const [companyFilter, setCompanyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: factoriesData = [] } =
    useGetSupplierFactoryOrderFactoriesQuery();
  const {
    data: ordersData,
    isLoading,
    isFetching,
  } = useGetSupplierFactoryOrdersQuery({
    page,
    status: statusFilter,
    search,
    companyId: companyFilter,
  });
  const [deleteSupplierFactoryOrder, { isLoading: isDeleting }] =
    useDeleteSupplierFactoryOrderMutation();

  const orders = useMemo(() => ordersData?.orders ?? [], [ordersData]);

  const tabs = useMemo(
    () => [
      {
        id: TAB_IDS.orders,
        label: t("panel.supplierFactoryOrders.tabOrders"),
      },
      {
        id: TAB_IDS.transport,
        label: t("panel.supplierFactoryOrders.tabTransportRequest"),
      },
    ],
    [t],
  );

  const companyOptions = useMemo(
    () => [
      { value: "all", label: t("panel.supplierFactoryOrders.allCompany") },
      ...factoriesData.map((company) => ({
        value: company.value,
        label: company.label,
      })),
    ],
    [t, factoriesData],
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("panel.supplierFactoryOrders.allStatus") },
      {
        value: "produced",
        label: t("panel.supplierFactoryOrders.statusProduced"),
      },
      {
        value: "in-production",
        label: t("panel.supplierFactoryOrders.statusInProduction"),
      },
      {
        value: "ready",
        label: t("panel.supplierFactoryOrders.statusReady"),
      },
      {
        value: "assigned",
        label: t("panel.supplierFactoryOrders.statusAssigned"),
      },
      {
        value: "cancel",
        label: t("panel.supplierFactoryOrders.statusCancel"),
      },
      {
        value: "completed",
        label: t("panel.supplierFactoryOrders.statusCompleted"),
      },
    ],
    [t],
  );

  const handleDelete = useCallback(
    async (row) => {
      if (!row?.id) return;
      await deleteSupplierFactoryOrder(row.id);
    },
    [deleteSupplierFactoryOrder],
  );

  const handleMarkPaid = useCallback(() => {
    // Transport request pay flow is not available in the current Postman contract.
  }, []);

  const handleDecline = useCallback(() => {
    // Transport request decline flow is not available in the current Postman contract.
  }, []);

  const getOrderRowActions = useCallback(
    () => [
      {
        id: "see-details",
        label: t("panel.supplierFactoryOrders.actionSeeDetails"),
        variant: "header",
        onClick: (row) => {
          navigate(`/supplier/factory-orders/${row.id}`, {
            state: { status: row.status, tab: activeTab },
          });
        },
      },
      {
        id: "delete",
        label: t("panel.supplierFactoryOrders.actionDelete"),
        onClick: handleDelete,
      },
    ],
    [t, handleDelete, navigate, activeTab],
  );

  const getTransportRowActions = useCallback(
    () => [
      {
        id: "paid",
        label: t("panel.supplierFactoryOrders.actionPaid"),
        variant: "header",
        onClick: handleMarkPaid,
      },
      {
        id: "decline",
        label: t("panel.supplierFactoryOrders.actionDecline"),
        onClick: handleDecline,
      },
    ],
    [t, handleMarkPaid, handleDecline],
  );

  const companyLabelById = useMemo(
    () =>
      Object.fromEntries(
        factoriesData.map((company) => [company.value, company.label]),
      ),
    [factoriesData],
  );

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((row) => {
      if (row.tab !== activeTab) return false;
      if (activeTab === TAB_IDS.transport && row.transportStatus === "paid") {
        return false;
      }
      if (companyFilter !== "all" && row.companyId !== companyFilter)
        return false;
      if (
        activeTab === TAB_IDS.orders &&
        statusFilter !== "all" &&
        row.status !== statusFilter
      ) {
        return false;
      }
      if (!q) return true;

      const statusLabel = (
        row.statusLabel || t(STATUS_LABEL_KEYS[row.status] || "")
      ).toLowerCase();
      const companyLabel = (
        companyLabelById[row.companyId] ||
        row.factoryName ||
        ""
      ).toLowerCase();

      if (activeTab === TAB_IDS.orders) {
        return (
          String(row.poNumber).toLowerCase().includes(q) ||
          String(row.factoryName).toLowerCase().includes(q) ||
          companyLabel.includes(q) ||
          String(row.total).toLowerCase().includes(q) ||
          String(row.installmentAmount).toLowerCase().includes(q) ||
          String(row.installmentNumber).toLowerCase().includes(q) ||
          String(row.status).toLowerCase().includes(q) ||
          statusLabel.includes(q) ||
          String(row.date).toLowerCase().includes(q)
        );
      }

      return (
        String(row.poNumber).toLowerCase().includes(q) ||
        String(row.factoryName).toLowerCase().includes(q) ||
        companyLabel.includes(q) ||
        String(row.product).toLowerCase().includes(q) ||
        String(row.qty).toLowerCase().includes(q) ||
        String(row.weightSize).toLowerCase().includes(q) ||
        String(row.shippingCharge).toLowerCase().includes(q)
      );
    });
  }, [
    orders,
    activeTab,
    companyFilter,
    statusFilter,
    search,
    companyLabelById,
    t,
  ]);

  const total = ordersData?.total ?? filteredOrders.length;
  const pageCount = Math.max(
    1,
    Math.ceil(total / SUPPLIER_FACTORY_ORDERS_PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);
  const pagedOrders = filteredOrders.slice(
    (safePage - 1) * SUPPLIER_FACTORY_ORDERS_PAGE_SIZE,
    safePage * SUPPLIER_FACTORY_ORDERS_PAGE_SIZE,
  );

  const orderColumns = useMemo(
    () => [
      {
        key: "poNumber",
        header: t("panel.supplierFactoryOrders.colPoNumber"),
      },
      {
        key: "factoryName",
        header: t("panel.supplierFactoryOrders.colFactoryName"),
      },
      {
        key: "total",
        header: t("panel.supplierFactoryOrders.colTotal"),
      },
      {
        key: "installmentAmount",
        header: t("panel.supplierFactoryOrders.colInstallmentAmount"),
      },
      {
        key: "status",
        header: t("panel.supplierFactoryOrders.colStatus"),
        render: (value, row) => (
          <StatusBadge status={value} label={row.statusLabel} />
        ),
      },
      {
        key: "installmentNumber",
        header: t("panel.supplierFactoryOrders.colInstallmentNumber"),
      },
      {
        key: "date",
        header: t("panel.supplierFactoryOrders.colDate"),
      },
    ],
    [t],
  );

  const transportColumns = useMemo(
    () => [
      {
        key: "poNumber",
        header: t("panel.supplierFactoryOrders.colPoNumber"),
      },
      {
        key: "factoryName",
        header: t("panel.supplierFactoryOrders.colFactoryName"),
      },
      {
        key: "product",
        header: t("panel.supplierFactoryOrders.colProduct"),
      },
      {
        key: "qty",
        header: t("panel.supplierFactoryOrders.colQty"),
      },
      {
        key: "weightSize",
        header: t("panel.supplierFactoryOrders.colWeightSize"),
        className: "max-w-[200px] whitespace-normal",
      },
      {
        key: "shippingCharge",
        header: t("panel.supplierFactoryOrders.colShippingCharge"),
      },
    ],
    [t],
  );

  const columns =
    activeTab === TAB_IDS.transport ? transportColumns : orderColumns;
  const getRowActions =
    activeTab === TAB_IDS.transport
      ? getTransportRowActions
      : getOrderRowActions;

  const from =
    total === 0 ? 0 : (safePage - 1) * SUPPLIER_FACTORY_ORDERS_PAGE_SIZE + 1;
  const to =
    total === 0
      ? 0
      : Math.min(safePage * SUPPLIER_FACTORY_ORDERS_PAGE_SIZE, total);

  const emptyMessage =
    activeTab === TAB_IDS.transport
      ? t("panel.supplierFactoryOrders.emptyTransport")
      : t("panel.supplierFactoryOrders.emptyOrders");

  const isOrdersTab = activeTab === TAB_IDS.orders;

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
        placeholder: t("panel.supplierFactoryOrders.allCompany"),
      },
      {
        id: "status",
        value: statusFilter,
        onChange: (value) => {
          setStatusFilter(value);
          setPage(1);
        },
        options: statusOptions,
        placeholder: t("panel.supplierFactoryOrders.allStatus"),
      },
    ],
    [companyFilter, statusFilter, companyOptions, statusOptions, t],
  );

  return (
    <>
      <Seo title={t("panel.supplierFactoryOrders.title")} />

      <div className="mb-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t("panel.supplierFactoryOrders.title")}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("panel.supplierFactoryOrders.subtitle")}
          </p>
        </header>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        {isLoading || isFetching || isDeleting ? (
          <div className="py-10 text-center text-sm text-[var(--secondary-text)]">
            Loading factory orders…
          </div>
        ) : (
          <DataTable
            showCard={false}
            showTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            columns={columns}
            data={pagedOrders}
            getRowKey={(row) => row.id}
            showActions
            getActions={getRowActions}
            actionHeader={t("panel.supplierFactoryOrders.colAction")}
            emptyMessage={emptyMessage}
            showPagination
            showSearch
            searchValue={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            searchPlaceholder={t(
              "panel.supplierFactoryOrders.searchPlaceholder",
            )}
            showFilters={isOrdersTab}
            filterLabel={t("panel.supplierFactoryOrders.sortBy")}
            filters={tableFilters}
            pagination={{
              page: safePage,
              pageSize: SUPPLIER_FACTORY_ORDERS_PAGE_SIZE,
              total,
              from,
              to,
              hasPrevious: safePage > 1,
              hasNext: safePage < pageCount,
              onPageChange: setPage,
              summaryLabel: t("panel.supplierFactoryOrders.showingResults", {
                from,
                to,
                total,
              }),
              previousLabel: t("panel.supplierFactoryOrders.previous"),
              nextLabel: t("panel.supplierFactoryOrders.next"),
            }}
          />
        )}
      </section>
    </>
  );
}
