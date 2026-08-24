import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/common/Pagination/Pagination";
import DataTable from "@/components/data-display/DataTable/DataTable";
import ProductCard from "@/components/data-display/ProductCard/ProductCard";
import Seo from "@/components/common/Seo/Seo";
import {
  getApiErrorMessage,
  toSelectOptions,
} from "@/features/supplier/apiError";
import { useGetCategoriesQuery } from "@/features/supplier/inventory/inventoryApi";
import {
  useCancelSupplierProductListingMutation,
  useDeleteSupplierProductMutation,
  useGetPromotionPlansQuery,
  useGetSupplierProductsQuery,
  usePaySupplierProductPromotionMutation,
  usePromoteSupplierProductMutation,
  useUploadSupplierProductsCsvMutation,
} from "@/features/supplier/products/productApi";
import { SUPPLIER_PRODUCTS_PAGE_SIZE } from "@/data/demoData";
import DeleteProductModal from "./components/DeleteProductModal";
import PromoteProductModal from "./components/PromoteProductModal";
import UploadCsvModal from "./components/UploadCsvModal";

const TAB_CONFIG = [
  { id: "all", labelKey: "panel.supplierProducts.tabAll" },
  { id: "pending", labelKey: "panel.supplierProducts.tabPending" },
  { id: "rejected", labelKey: "panel.supplierProducts.tabRejected" },
  { id: "regular", labelKey: "panel.supplierProducts.tabRegular" },
  { id: "bulk_order", labelKey: "panel.supplierProducts.tabBulkOrder" },
  { id: "featured", labelKey: "panel.supplierProducts.tabFeatured" },
];

export default function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [csvOpen, setCsvOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToPromote, setProductToPromote] = useState(null);
  const [promoteError, setPromoteError] = useState("");

  const { data: categories = [] } = useGetCategoriesQuery();
  const {
    data: catalog,
    currentData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetSupplierProductsQuery({
    tab: activeTab,
    page,
    limit: SUPPLIER_PRODUCTS_PAGE_SIZE,
    categoryId: category,
  });
  const [uploadProductsCsv] = useUploadSupplierProductsCsvMutation();
  const [deleteProduct, { isLoading: deleting }] =
    useDeleteSupplierProductMutation();
  const [cancelListing, { isLoading: cancelling }] =
    useCancelSupplierProductListingMutation();
  const [promoteProduct, { isLoading: promoting }] =
    usePromoteSupplierProductMutation();
  const [payPromotion, { isLoading: paying }] =
    usePaySupplierProductPromotionMutation();
  const { data: promotionPlans = [], isLoading: plansLoading } =
    useGetPromotionPlansQuery(undefined, {
      skip: !productToPromote,
    });

  const shouldHideStaleResults = isFetching && Boolean(catalog);
  const products = shouldHideStaleResults
    ? []
    : (currentData?.products ?? catalog?.products ?? []);
  const total = shouldHideStaleResults
    ? 0
    : (currentData?.total ?? catalog?.total ?? 0);
  const totalPages = Math.max(
    1,
    Math.ceil(total / SUPPLIER_PRODUCTS_PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const tabCounts = shouldHideStaleResults
    ? {}
    : (currentData?.tabCounts ?? catalog?.tabCounts ?? {});

  const categoryOptions = useMemo(
    () => [
      {
        value: "all",
        label: t("panel.supplierProducts.allCategories"),
      },
      ...toSelectOptions(categories),
    ],
    [categories, t],
  );

  const tabs = useMemo(
    () =>
      TAB_CONFIG.map((tab) => {
        const rawCount =
          tabCounts?.[tab.id] ?? tabCounts?.[tab.id.replace("_", "")];
        const count = Number(rawCount);
        return {
          id: tab.id,
          label: Number.isFinite(count)
            ? `${t(tab.labelKey)} (${count})`
            : t(tab.labelKey),
        };
      }),
    [t, tabCounts],
  );

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const tableFilters = useMemo(
    () => [
      {
        id: "category",
        value: category,
        onChange: handleCategoryChange,
        options: categoryOptions,
        placeholder: t("panel.supplierProducts.allCategories"),
      },
    ],
    [category, categoryOptions, t],
  );

  const handleCardAction = (actionId, item) => {
    if (actionId === "edit") {
      navigate(`/supplier/products/${item.id}/edit`);
      return;
    }
    if (actionId === "resubmit") {
      navigate(`/supplier/products/${item.id}/edit?resubmit=1`);
      return;
    }
    if (actionId === "promote") {
      setPromoteError("");
      setProductToPromote(item);
      return;
    }
    if (actionId === "cancel") {
      cancelListing(item.id)
        .unwrap()
        .catch((apiError) => {
          toast.error(
            getApiErrorMessage(
              apiError,
              t("panel.supplierProducts.cancelFailed", {
                defaultValue: "Could not cancel this listing.",
              }),
            ),
          );
        });
      return;
    }
    if (actionId === "delete") {
      setProductToDelete(item);
    }
  };

  const handleConfirmDelete = async (item) => {
    if (!item?.id || deleting || cancelling) return;

    try {
      if (item.status === "pending") {
        await cancelListing(item.id).unwrap();
      } else {
        await deleteProduct(item.id).unwrap();
      }
      setProductToDelete(null);
    } catch (apiError) {
      toast.error(
        getApiErrorMessage(
          apiError,
          t("panel.supplierProducts.deleteFailed", {
            defaultValue: "Could not delete this product.",
          }),
        ),
      );
    }
  };

  const handleConfirmPromote = async (planId) => {
    if (!productToPromote?.id || !planId) return;
    setPromoteError("");

    try {
      const promoted = await promoteProduct({
        id: productToPromote.id,
        planId,
      }).unwrap();
      const promotionId =
        promoted?.promotion?.id || promoted?.id || promoted?.promotionId;

      if (promotionId) {
        await payPromotion({
          productId: productToPromote.id,
          promotionId,
          paymentRef: `PROMO-${Date.now()}`,
        }).unwrap();
      }

      setProductToPromote(null);
    } catch (apiError) {
      setPromoteError(
        getApiErrorMessage(
          apiError,
          t("panel.supplierProducts.promote.failed", {
            defaultValue: "Could not promote this product.",
          }),
        ),
      );
    }
  };

  const emptyMessage = isError
    ? getApiErrorMessage(
        error,
        t("panel.supplierProducts.loadFailed", {
          defaultValue: "Could not load products.",
        }),
      )
    : t("panel.supplierProducts.emptyHint");

  return (
    <>
      <Seo title={t("panel.supplierProducts.title")} />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t("panel.supplierProducts.title")}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("panel.supplierProducts.subtitle")}
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/supplier/products/add")}
            className="inline-flex items-center justify-center rounded-md bg-[var(--active)] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:brightness-95 sm:text-sm"
          >
            {t("panel.supplierProducts.addProduct")}
          </button>
          <button
            type="button"
            onClick={() => setCsvOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-[var(--active)] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--active)] transition-colors hover:bg-[color-mix(in_srgb,var(--active)_8%,white)] sm:text-sm"
          >
            {t("panel.supplierProducts.uploadCsv")}
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <DataTable
          showCard={false}
          showTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showFilters
          filterLabel={t("panel.supplierProducts.filters")}
          filters={tableFilters}
          showTable={false}
        />

        {isLoading ? (
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-16 text-center">
            <p className="text-sm text-[var(--secondary-text)]">
              {t("panel.supplierProducts.loading", {
                defaultValue: "Loading products…",
              })}
            </p>
          </div>
        ) : products.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {products.map((item) => (
                <li key={item.id} className="flex min-w-0">
                  <ProductCard
                    type={
                      item.cardType === "featured" ? "featured" : "dashboard"
                    }
                    role="supplier"
                    tag={item.tag}
                    status={item.status}
                    badge={item.badge}
                    product={item.product}
                    onCardClick={() =>
                      navigate(`/supplier/products/${item.id}`)
                    }
                    onAction={(actionId) => handleCardAction(actionId, item)}
                    className="h-full w-full shadow-sm"
                  />
                </li>
              ))}
            </ul>

            <Pagination
              className="mt-8 sm:mt-10"
              page={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-16 text-center">
            <p className="text-base font-semibold text-[var(--primary-text)]">
              {t("panel.supplierProducts.emptyTitle")}
            </p>
            <p className="mt-2 text-sm text-[var(--secondary-text)]">
              {emptyMessage}
            </p>
          </div>
        )}
      </section>

      <UploadCsvModal
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        uploadCsv={uploadProductsCsv}
      />

      <DeleteProductModal
        open={Boolean(productToDelete)}
        product={productToDelete}
        deleting={deleting || cancelling}
        onClose={() => {
          if (!deleting && !cancelling) setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <PromoteProductModal
        open={Boolean(productToPromote)}
        product={productToPromote}
        plans={promotionPlans}
        loading={plansLoading}
        submitting={promoting || paying}
        error={promoteError}
        onClose={() => {
          if (!promoting && !paying) {
            setProductToPromote(null);
            setPromoteError("");
          }
        }}
        onConfirm={handleConfirmPromote}
      />
    </>
  );
}
