import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PRODUCT_CATEGORIES } from "../../data/productCategories";
import { getProductTypeImage } from "../../utils/productTypeImages";

function ProductTypeCard({
  productType,
  categoryId,
  subcategoryId,
  onNavigate,
  label,
}) {
  const imgSrc =
    productType?.imageSrc ||
    getProductTypeImage(productType, subcategoryId, categoryId);

  return (
    <Link
      to={`/products?category=${categoryId}&sub=${subcategoryId}&type=${productType.id}`}
      onClick={() => onNavigate?.()}
      className="group flex w-full flex-col items-center gap-2 justify-self-center text-center"
    >
      <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:border-(--active) group-hover:shadow-md sm:size-12">
        <img
          src={imgSrc}
          alt={label || ""}
          className="size-full object-cover transition-transform duration-200 group-hover:scale-110"
          loading="lazy"
        />
      </span>
      <span
        title={label}
        className="line-clamp-2 w-full px-0.5 text-[11px] leading-snug text-[var(--primary-text)] transition-colors group-hover:text-[var(--active)] sm:text-xs"
      >
        {label}
      </span>
    </Link>
  );
}

/**
 * Dropdown mega menu (overlay panel under CategoryBar).
 */
const lightScroll =
  "[scrollbar-width:thin] [scrollbar-color:#e5e7eb_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300";

export default function CategoryMegaMenu({
  activeCategoryId,
  onSelectCategory,
  onNavigate,
}) {
  const { t } = useTranslation();
  const activeCategory =
    PRODUCT_CATEGORIES.find((item) => item.id === activeCategoryId) ||
    PRODUCT_CATEGORIES[0];

  const categoryLabel = (category) =>
    t(`catalog.categories.${category.id}`, { defaultValue: category.name });

  const subcategoryLabel = (subcategory) =>
    t(`catalog.subcategories.${subcategory.id}`, {
      defaultValue: subcategory.name,
    });

  const typeLabel = (productType) =>
    t(`catalog.types.${productType.id}`, { defaultValue: productType.name });

  return (
    <div className="w-full border-b border-gray-200 bg-white shadow-lg">
      <div className="container mx-auto flex h-[min(70vh,640px)] w-full flex-col overflow-hidden lg:flex-row">
        <aside
          className={`min-h-0 shrink-0 overflow-x-auto overflow-y-auto border-b border-gray-100 bg-[#FFFFFF] px-3 py-3 lg:w-[280px] lg:border-r lg:border-b-0 lg:px-0 lg:py-4 ${lightScroll}`}
        >
          <ul className="flex gap-1 lg:flex-col lg:gap-0">
            {PRODUCT_CATEGORIES.map((category) => {
              const isActive = category.id === activeCategory.id;
              return (
                <li key={category.id} className="shrink-0 lg:w-full">
                  <button
                    type="button"
                    onClick={() => onSelectCategory?.(category.id)}
                    className={`w-full whitespace-nowrap rounded-md px-3 py-2.5 text-left text-sm transition-colors lg:rounded-none lg:border-l-[3px] lg:px-5 ${
                      isActive
                        ? "border-[var(--active)] bg-[color-mix(in_srgb,var(--active)_10%,white)] font-semibold text-[var(--active)]"
                        : "border-transparent text-[var(--primary-text)] hover:bg-white/70 hover:text-[var(--active)]"
                    }`}
                  >
                    {categoryLabel(category)}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div
          className={`min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6 lg:px-10 ${lightScroll}`}
        >
          <div className="space-y-8 pb-4">
            {activeCategory.subcategories.map((subcategory) => (
              <section key={subcategory.id}>
                <h3 className="mb-5 text-base font-bold text-[var(--primary-text)] sm:text-lg">
                  {subcategoryLabel(subcategory)}
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {subcategory.productTypes.map((productType) => (
                    <ProductTypeCard
                      key={productType.id}
                      productType={productType}
                      categoryId={activeCategory.id}
                      subcategoryId={subcategory.id}
                      onNavigate={onNavigate}
                      label={typeLabel(productType)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
