import { useCallback, useMemo, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import Pagination from "@/components/common/Pagination/Pagination";
import ProductCard from "@/components/data-display/ProductCard/ProductCard";
import ProductDetails from "@/components/data-display/ProductDetails/ProductDetails";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import {
  DEMO_SUPPLIER_PROMO_PRODUCTS,
  SUPPLIER_PROMO_CODES_PAGE_SIZE,
  SUPPLIER_PROMO_PRODUCTS_PAGE_SIZE,
  getPromoProductDetail,
} from "@/data/demoData";
import {
  useDeletePromoCodeMutation,
  useGetPromoCodesQuery,
  useUpdatePromoCodeStatusMutation,
} from "@/features/supplier/promo-codes/promoCodesApi";
import DeleteProductModal from "@/pages/supplier/products/components/DeleteProductModal";

const TAB_IDS = {
  promoCode: "promo_code",
  promoProduct: "promo_product",
};

const STATUS_LABEL_KEYS = {
  active: "panel.supplierPromoCodes.statusActive",
  disabled: "panel.supplierPromoCodes.statusDisabled",
  expired: "panel.supplierPromoCodes.statusExpired",
};

export default function PromoCodesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.tab === TAB_IDS.promoProduct
      ? TAB_IDS.promoProduct
      : TAB_IDS.promoCode,
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [promoCodePage, setPromoCodePage] = useState(1);
  const [promoProducts, setPromoProducts] = useState(
    DEMO_SUPPLIER_PROMO_PRODUCTS,
  );
  const { data: promoCodeResponse } = useGetPromoCodesQuery({
    status: statusFilter,
    page: promoCodePage,
    limit: SUPPLIER_PROMO_CODES_PAGE_SIZE,
  });
  const [updatePromoCodeStatus] = useUpdatePromoCodeStatusMutation();
  const [deletePromoCode] = useDeletePromoCodeMutation();
  const [promoProductPage, setPromoProductPage] = useState(1);
  const [selectedPromoProduct, setSelectedPromoProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const promoCodes = useMemo(
    () => promoCodeResponse?.promoCodes ?? [],
    [promoCodeResponse],
  );

  const promoCodeTotal = promoCodeResponse?.total ?? promoCodes.length;
  const promoCodePageCount = Math.max(
    1,
    Math.ceil(promoCodeTotal / SUPPLIER_PROMO_CODES_PAGE_SIZE),
  );
  const safePromoCodePage = Math.min(promoCodePage, promoCodePageCount);

  const handleStatusChange = useCallback(
    (row, status) => {
      updatePromoCodeStatus({
        id: row.id,
        isActive: status === "active",
      });
    },
    [updatePromoCodeStatus],
  );

  const tabs = useMemo(
    () => [
      {
        id: TAB_IDS.promoCode,
        label: t("panel.supplierPromoCodes.tabPromoCode"),
      },
      {
        id: TAB_IDS.promoProduct,
        label: t("panel.supplierPromoCodes.tabPromoProduct"),
      },
    ],
    [t],
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("panel.supplierPromoCodes.allStatus") },
      { value: "active", label: t("panel.supplierPromoCodes.statusActive") },
      {
        value: "disabled",
        label: t("panel.supplierPromoCodes.statusDisabled"),
      },
      { value: "expired", label: t("panel.supplierPromoCodes.statusExpired") },
    ],
    [t],
  );

  const filteredPromoCodes = useMemo(() => {
    const q = search.trim().toLowerCase();

    return promoCodes.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;

      const statusLabel = t(STATUS_LABEL_KEYS[row.status] || "").toLowerCase();
      const discountTypeLabel =
        row.discountType === "fixed"
          ? t("panel.supplierPromoCodes.discountTypeFixed").toLowerCase()
          : t("panel.supplierPromoCodes.discountTypePercentage").toLowerCase();
      const usageLimitLabel = row.usageLimitUnlimited
        ? t("panel.supplierPromoCodes.unlimited").toLowerCase()
        : String(row.usageLimit ?? "").toLowerCase();
      const usedCountLabel = `${row.usedCount}/${
        row.usageLimitUnlimited
          ? t("panel.supplierPromoCodes.unlimitedLower")
          : row.usageLimit
      }`.toLowerCase();

      return (
        String(row.code).toLowerCase().includes(q) ||
        String(row.discountType).toLowerCase().includes(q) ||
        discountTypeLabel.includes(q) ||
        String(row.discountValue).toLowerCase().includes(q) ||
        String(row.minOrder).toLowerCase().includes(q) ||
        usageLimitLabel.includes(q) ||
        usedCountLabel.includes(q) ||
        String(row.status).toLowerCase().includes(q) ||
        statusLabel.includes(q) ||
        String(row.expiryDate).toLowerCase().includes(q)
      );
    });
  }, [promoCodes, statusFilter, search, t]);

  const renderedPromoCodeTotal = filteredPromoCodes.length;
  const pagedPromoCodes = filteredPromoCodes.slice(
    (safePromoCodePage - 1) * SUPPLIER_PROMO_CODES_PAGE_SIZE,
    safePromoCodePage * SUPPLIER_PROMO_CODES_PAGE_SIZE,
  );
  const promoCodeFrom =
    renderedPromoCodeTotal === 0
      ? 0
      : (safePromoCodePage - 1) * SUPPLIER_PROMO_CODES_PAGE_SIZE + 1;
  const promoCodeTo =
    renderedPromoCodeTotal === 0
      ? 0
      : Math.min(
          safePromoCodePage * SUPPLIER_PROMO_CODES_PAGE_SIZE,
          renderedPromoCodeTotal,
        );

  const promoProductTotalPages = Math.max(
    1,
    Math.ceil(promoProducts.length / SUPPLIER_PROMO_PRODUCTS_PAGE_SIZE),
  );

  const safePromoProductPage = Math.min(
    promoProductPage,
    promoProductTotalPages,
  );

  const visiblePromoProducts = useMemo(() => {
    const start =
      (safePromoProductPage - 1) * SUPPLIER_PROMO_PRODUCTS_PAGE_SIZE;
    return promoProducts.slice(
      start,
      start + SUPPLIER_PROMO_PRODUCTS_PAGE_SIZE,
    );
  }, [promoProducts, safePromoProductPage]);

  const columns = useMemo(
    () => [
      {
        key: "code",
        header: t("panel.supplierPromoCodes.colPromoCode"),
      },
      {
        key: "discountType",
        header: t("panel.supplierPromoCodes.colDiscountType"),
        render: (value) =>
          value === "fixed"
            ? t("panel.supplierPromoCodes.discountTypeFixed")
            : t("panel.supplierPromoCodes.discountTypePercentage"),
      },
      {
        key: "discountValue",
        header: t("panel.supplierPromoCodes.colDiscountValue"),
      },
      {
        key: "minOrder",
        header: t("panel.supplierPromoCodes.colMinOrder"),
      },
      {
        key: "usageLimit",
        header: t("panel.supplierPromoCodes.colUsageLimit"),
        render: (value, row) =>
          row.usageLimitUnlimited
            ? t("panel.supplierPromoCodes.unlimited")
            : value,
      },
      {
        key: "usedCount",
        header: t("panel.supplierPromoCodes.colUsedCount"),
        render: (_, row) => {
          const limitLabel = row.usageLimitUnlimited
            ? t("panel.supplierPromoCodes.unlimitedLower")
            : row.usageLimit;
          return `${row.usedCount}/${limitLabel}`;
        },
      },
      {
        key: "status",
        header: t("panel.supplierPromoCodes.colStatus"),
        render: (value) => (
          <StatusBadge
            status={value}
            label={t(STATUS_LABEL_KEYS[value])}
            className="rounded-full"
          />
        ),
      },
      {
        key: "expiryDate",
        header: t("panel.supplierPromoCodes.colExpiryDate"),
      },
    ],
    [t],
  );

  const rowActions = useMemo(
    () => [
      {
        id: "see-details",
        label: t("panel.supplierPromoCodes.actionSeeDetails"),
        variant: "header",
        onClick: (row) => {
          // TODO: open promo code details when route/modal is available
          void row;
        },
      },
      {
        id: "edit",
        label: t("panel.supplierPromoCodes.actionEdit"),
        onClick: () => {
          // TODO: open edit promo code flow when available
        },
      },
      {
        id: "delete",
        label: t("panel.supplierPromoCodes.actionDelete"),
        onClick: (row) => {
          deletePromoCode(row.id);
        },
      },
      {
        id: "status-section",
        label: t("panel.supplierPromoCodes.statusSection"),
        variant: "section",
      },
      {
        id: "set-active",
        label: t("panel.supplierPromoCodes.statusActive"),
        onClick: (row) => handleStatusChange(row, "active"),
      },
      {
        id: "set-disabled",
        label: t("panel.supplierPromoCodes.statusDisabled"),
        onClick: (row) => handleStatusChange(row, "disabled"),
      },
      {
        id: "set-expired",
        label: t("panel.supplierPromoCodes.statusExpired"),
        onClick: (row) => handleStatusChange(row, "expired"),
      },
    ],
    [t, handleStatusChange, deletePromoCode],
  );

  const promoProductActions = useMemo(
    () => [
      {
        id: "edit",
        kind: "pill",
        label: t("panel.supplierPromoCodes.actionEdit"),
        variant: "primary",
      },
      {
        id: "delete",
        kind: "pill",
        label: t("panel.supplierPromoCodes.actionDelete"),
        variant: "danger",
      },
    ],
    [t],
  );

  const handlePromoProductAction = useCallback(
    (actionId, item) => {
      if (actionId === "view" || actionId === "view_details") {
        setSelectedPromoProduct(item);
        return;
      }
      if (actionId === "edit") {
        navigate(`/supplier/promo-codes/products/${item.id}/edit`);
        return;
      }
      if (actionId === "delete") {
        setProductToDelete(item);
      }
    },
    [navigate],
  );

  const handleProductDetailsAction = useCallback(() => {
    // TODO: wire product details actions to API handlers
  }, []);

  const selectedProductDetail = useMemo(() => {
    if (!selectedPromoProduct) return null;
    return getPromoProductDetail(selectedPromoProduct.id);
  }, [selectedPromoProduct]);

  const handleConfirmDeletePromoProduct = useCallback(
    async (item) => {
      if (!item?.id || deleting) return;

      setDeleting(true);
      // TODO: wire delete promo product API
      setPromoProducts((prev) => {
        const next = prev.filter((entry) => entry.id !== item.id);
        const nextTotalPages = Math.max(
          1,
          Math.ceil(next.length / SUPPLIER_PROMO_PRODUCTS_PAGE_SIZE),
        );
        setPromoProductPage((current) => Math.min(current, nextTotalPages));
        return next;
      });
      setProductToDelete(null);
      setDeleting(false);
      setSelectedPromoProduct((current) =>
        current?.id === item.id ? null : current,
      );
    },
    [deleting],
  );

  const isPromoCodeTab = activeTab === TAB_IDS.promoCode;

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setSearch("");
    if (tabId === TAB_IDS.promoCode) {
      setPromoCodePage(1);
      return;
    }
    setPromoProductPage(1);
  }, []);

  const tableFilters = useMemo(
    () => [
      {
        id: "status",
        value: statusFilter,
        onChange: (value) => {
          setStatusFilter(value);
          setPromoCodePage(1);
        },
        options: statusOptions,
        placeholder: t("panel.supplierPromoCodes.allStatus"),
      },
    ],
    [statusFilter, statusOptions, t],
  );

  return (
    <>
      <Seo title={t("panel.supplierPromoCodes.title")} />

      {selectedPromoProduct && selectedProductDetail ? (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setSelectedPromoProduct(null)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-(--primary-text) transition hover:bg-gray-50"
          >
            <FiArrowLeft className="size-4" />
            {t("panel.supplierPromoCodes.backToPromoProducts")}
          </button>

          <ProductDetails
            role="customer"
            product={selectedProductDetail}
            onAction={handleProductDetailsAction}
          />
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <header>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                {t("panel.supplierPromoCodes.title")}
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                {t("panel.supplierPromoCodes.subtitle")}
              </p>
            </header>

            <button
              type="button"
              onClick={() => navigate("/supplier/promo-codes/create")}
              className="inline-flex shrink-0 items-center justify-center self-start rounded-md bg-(--active) px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-95"
            >
              {t("panel.supplierPromoCodes.createPromoCode")}
            </button>
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <DataTable
              showCard={false}
              showTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              showSearch={isPromoCodeTab}
              searchValue={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPromoCodePage(1);
              }}
              searchPlaceholder={t(
                "panel.supplierPromoCodes.searchPlaceholder",
              )}
              showFilters={isPromoCodeTab}
              filterLabel={t("panel.supplierProducts.filters")}
              filters={tableFilters}
              showTable={isPromoCodeTab}
              columns={columns}
              data={pagedPromoCodes}
              getRowKey={(row) => row.id}
              showActions={isPromoCodeTab}
              actions={rowActions}
              actionHeader={t("panel.supplierPromoCodes.colAction")}
              emptyMessage={t("panel.supplierPromoCodes.emptyPromoCodes")}
              showPagination={isPromoCodeTab}
              pagination={{
                page: safePromoCodePage,
                pageSize: SUPPLIER_PROMO_CODES_PAGE_SIZE,
                total: renderedPromoCodeTotal,
                from: promoCodeFrom,
                to: promoCodeTo,
                hasPrevious: safePromoCodePage > 1,
                hasNext: safePromoCodePage < promoCodePageCount,
                onPageChange: setPromoCodePage,
                summaryLabel: t("panel.supplierPromoCodes.showingResults", {
                  from: promoCodeFrom,
                  to: promoCodeTo,
                  total: renderedPromoCodeTotal,
                }),
                previousLabel: t("panel.supplierPromoCodes.previous"),
                nextLabel: t("panel.supplierPromoCodes.next"),
              }}
            />

            {!isPromoCodeTab && promoProducts.length > 0 ? (
              <>
                <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                  {visiblePromoProducts.map((item) => (
                    <li key={item.id} className="flex min-w-0">
                      <ProductCard
                        type="dashboard"
                        context="promo_code"
                        role="supplier"
                        product={item.product}
                        actions={promoProductActions}
                        onCardClick={() => setSelectedPromoProduct(item)}
                        onAction={(actionId) =>
                          handlePromoProductAction(actionId, item)
                        }
                        className="h-full w-full shadow-sm"
                      />
                    </li>
                  ))}
                </ul>

                <Pagination
                  className="mt-8 sm:mt-10"
                  page={safePromoProductPage}
                  totalPages={promoProductTotalPages}
                  onPageChange={setPromoProductPage}
                />
              </>
            ) : null}

            {!isPromoCodeTab && promoProducts.length === 0 ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-16 text-center">
                <p className="text-base font-semibold text-(--primary-text)">
                  {t("panel.supplierPromoCodes.emptyPromoProductsTitle")}
                </p>
                <p className="mt-2 text-sm text-(--secondary-text)">
                  {t("panel.supplierPromoCodes.emptyPromoProductsHint")}
                </p>
              </div>
            ) : null}
          </section>

          <DeleteProductModal
            open={Boolean(productToDelete)}
            product={productToDelete}
            deleting={deleting}
            onClose={() => {
              if (!deleting) setProductToDelete(null);
            }}
            onConfirm={handleConfirmDeletePromoProduct}
          />
        </>
      )}
    </>
  );
}
