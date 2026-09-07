import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductDetails from "@/components/data-display/ProductDetails/ProductDetails";
import ProductDetailsSkeleton from "@/components/data-display/ProductDetails/ProductDetailsSkeleton";
import Seo from "@/components/common/Seo/Seo";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import { useGetSupplierProductByIdQuery } from "@/features/supplier/products/productApi";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { t } = useTranslation();
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetSupplierProductByIdQuery(productId, { skip: !productId });

  if (isLoading) {
    return (
      <>
        <Seo title={t("panel.supplierProducts.title")} />
        <ProductDetailsSkeleton />
      </>
    );
  }

  if (isError || !product) {
    return (
      <>
        <Seo title={t("panel.supplierProducts.notFound")} />

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-(--primary-text)">
            {isError
              ? getApiErrorMessage(error, t("panel.supplierProducts.notFound"))
              : t("panel.supplierProducts.notFound")}
          </p>
          <Link
            to="/supplier/products"
            className="mt-4 inline-flex text-sm font-semibold text-(--active) hover:underline"
          >
            {t("panel.supplierProducts.backToProducts")}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title={product.title} />

      <ProductDetails role="supplier" product={product} />
    </>
  );
}
