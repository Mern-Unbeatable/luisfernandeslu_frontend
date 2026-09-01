import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/common/Pagination/Pagination";
import ProductCard from "@/components/data-display/ProductCard/ProductCard";
import Seo from "@/components/common/Seo/Seo";
import { useGetSupplierFactoryProductsQuery } from "@/features/supplier/factory-products/factoryProductsApi";

const PAGE_SIZE = 12;

export default function BuyFromFactoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetSupplierFactoryProductsQuery({
    page,
    limit: PAGE_SIZE,
  });

  const products = data?.products ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const safePage = Math.min(page, totalPages);

  const cardActions = useMemo(
    () => [
      {
        id: "send_message",
        kind: "full",
        label: t("panel.supplierBuyFromFactory.sendMessage"),
        variant: "primary",
        icon: "message",
      },
    ],
    [t],
  );

  const handleAction = useCallback(
    (actionId, item) => {
      if (actionId !== "send_message") return;
      navigate(`/supplier/chat?type=FACTORY_SUPPLIER&productId=${item?.id}`);
    },
    [navigate],
  );

  return (
    <>
      <Seo title={t("panel.supplierBuyFromFactory.title")} />

      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
          {t("panel.supplierBuyFromFactory.title")}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {t("panel.supplierBuyFromFactory.subtitle")}
        </p>
      </header>

      {isLoading || isFetching ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-sm text-[var(--secondary-text)]">
            Loading factory products…
          </p>
        </div>
      ) : products.length > 0 ? (
        <>
          <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {products.map((item) => (
              <li key={item.id} className="flex min-w-0">
                <ProductCard
                  type="normal"
                  role="supplier"
                  product={item.product}
                  actions={cardActions}
                  onAction={(actionId) => handleAction(actionId, item)}
                  onCardClick={() =>
                    navigate(`/supplier/buy-from-factory/${item.id}`)
                  }
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
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[var(--primary-text)]">
            {t("panel.supplierBuyFromFactory.emptyTitle")}
          </p>
          <p className="mt-2 text-sm text-[var(--secondary-text)]">
            {t("panel.supplierBuyFromFactory.emptyHint")}
          </p>
        </div>
      )}
    </>
  );
}
