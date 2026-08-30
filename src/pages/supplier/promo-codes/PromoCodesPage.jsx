import { useCallback, useMemo, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import Pagination from "@/components/common/Pagination/Pagination";
import ProductCard from "@/components/data-display/ProductCard/ProductCard";
import ProductDetails from "@/components/data-display/ProductDetails/ProductDetails";
import DataTable from "@/components/data-display/DataTable/DataTable";
import {
  DEMO_SUPPLIER_PROMO_PRODUCTS,
  SUPPLIER_PROMO_PRODUCTS_PAGE_SIZE,
  getPromoProductDetail,
} from "@/data/demoData";
import DeleteProductModal from "@/pages/supplier/products/components/DeleteProductModal";
import PromoCodeDetailsModal from "./components/PromoCodeDetailsModal.jsx";
import PromoCodeDeleteModal from "./components/PromoCodeDeleteModal.jsx";
import { TAB_IDS } from "./utils/promoCode.constants.js";
import { usePromoCodeTableController } from "./hooks/usePromoCodeTableController.jsx";

export default function PromoCodesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.tab === TAB_IDS.promoProduct
      ? TAB_IDS.promoProduct
      : TAB_IDS.promoCode,
  );
  const [promoProducts, setPromoProducts] = useState(
    DEMO_SUPPLIER_PROMO_PRODUCTS,
  );
  const [promoProductPage, setPromoProductPage] = useState(1);
  const [selectedPromoProduct, setSelectedPromoProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    search,
    setSearch,
    setPromoCodePage,
    columns,
    rowActions,
    tableFilters,
    pagedPromoCodes,
    isLoading,
    pagination,
    selectedPromoCodeId,
    selectedPromoCode: selectedPromoCodeData,
    isPromoCodeDetailLoading,
    isPromoCodeDetailError,
    closePromoCodeDetails,
    promoCodeToDelete,
    deletingPromoCode,
    confirmDeletePromoCode,
    closeDeletePromoCode,
  } = usePromoCodeTableController({ t, navigate });

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

  const handleTabChange = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      setSearch("");
      if (tabId === TAB_IDS.promoCode) {
        setPromoCodePage(1);
        return;
      }
      setPromoProductPage(1);
    },
    [setPromoCodePage, setSearch],
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
              loading={isPromoCodeTab && isLoading}
              showActions={isPromoCodeTab}
              actions={rowActions}
              actionHeader={t("panel.supplierPromoCodes.colAction")}
              emptyMessage={t("panel.supplierPromoCodes.emptyPromoCodes")}
              showPagination={isPromoCodeTab}
              pagination={{
                page: pagination.page,
                pageSize: pagination.pageSize,
                total: pagination.total,
                from: pagination.from,
                to: pagination.to,
                hasPrevious: pagination.hasPrevious,
                hasNext: pagination.hasNext,
                onPageChange: setPromoCodePage,
                summaryLabel: t("panel.supplierPromoCodes.showingResults", {
                  from: pagination.from,
                  to: pagination.to,
                  total: pagination.total,
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

          <PromoCodeDetailsModal
            promoCodeId={selectedPromoCodeId}
            promoCode={selectedPromoCodeData}
            isLoading={isPromoCodeDetailLoading}
            isError={isPromoCodeDetailError}
            onClose={closePromoCodeDetails}
          />

          <PromoCodeDeleteModal
            open={Boolean(promoCodeToDelete)}
            promoCode={promoCodeToDelete}
            deleting={deletingPromoCode}
            onClose={closeDeletePromoCode}
            onConfirm={confirmDeletePromoCode}
          />
        </>
      )}
    </>
  );
}
