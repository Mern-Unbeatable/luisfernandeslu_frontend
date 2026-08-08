import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiChevronDown, FiChevronRight, FiSliders, FiX } from "react-icons/fi";
import { PRODUCT_CATEGORIES } from "@/data/productCategories";
import {
  PRODUCTS_PRICE_BRACKETS,
  PRODUCTS_PRICE_MAX,
} from "../data/productsListing";

const priceInputClass =
  "h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]";

function FilterCheckbox({ checked, onChange, label, labelClassName = "" }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-sm border ${
          checked
            ? "border-[var(--active)] bg-[var(--active)] text-white"
            : "border-gray-300 bg-white text-transparent"
        }`}
        aria-hidden
      >
        <FiCheck className="size-3" strokeWidth={3} />
      </span>
      <span className={labelClassName}>{label}</span>
    </label>
  );
}

function FilterRadio({ checked, onChange, name, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`inline-flex size-4 shrink-0 items-center justify-center rounded-full border bg-white ${
          checked
            ? "border-[5px] border-[var(--active)]"
            : "border-gray-300"
        }`}
        aria-hidden
      />
      <span
        className={`text-sm ${
          checked
            ? "font-medium text-[var(--active)]"
            : "text-[var(--primary-text)]"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function CategoryRow({ checked, onToggle, label }) {
  return (
    <FilterCheckbox
      checked={checked}
      onChange={onToggle}
      label={label}
      labelClassName={`text-left text-sm leading-snug ${
        checked
          ? "font-semibold text-[var(--active)]"
          : "font-normal text-[var(--primary-text)]"
      }`}
    />
  );
}

function RangeTrack({
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
}) {
  const left = `${(valueMin / max) * 100}%`;
  const right = `${100 - (valueMax / max) * 100}%`;

  return (
    <div className="relative mx-0.5 h-7">
      <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-gray-200" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--active)]"
        style={{ left, right }}
      />
      <input
        type="range"
        min={0}
        max={max}
        value={valueMin}
        onChange={(event) => {
          onChangeMin(Math.min(Number(event.target.value), valueMax));
        }}
        className="absolute inset-0 z-10 h-7 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--active)] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--active)]"
        aria-label="Minimum price"
      />
      <input
        type="range"
        min={0}
        max={max}
        value={valueMax}
        onChange={(event) => {
          onChangeMax(Math.max(Number(event.target.value), valueMin));
        }}
        className="absolute inset-0 z-20 h-7 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--active)] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--active)]"
        aria-label="Maximum price"
      />
    </div>
  );
}

export default function ProductsSidebar({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  priceBracketId,
  onPriceBracketChange,
  categoryIds,
  typeIds,
  onToggleCategory,
  onToggleType,
  expandedSubcategoryIds,
  onToggleSubcategory,
  activeCategoryId,
  onActivateCategory,
  resultCount = 0,
  onClearFilters,
  className = "",
}) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (media.matches) setMobileOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const categoryLabel = (category) =>
    t(`catalog.categories.${category.id}`, { defaultValue: category.name });

  const subcategoryLabel = (subcategory) =>
    t(`catalog.subcategories.${subcategory.id}`, {
      defaultValue: subcategory.name,
    });

  const typeLabel = (productType) =>
    t(`catalog.types.${productType.id}`, { defaultValue: productType.name });

  const clearBracketOnManualPrice = () => onPriceBracketChange(null);

  const sidebarBody = (
    <div className="lg:pr-2">
      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-base font-bold text-[var(--primary-text)]">
          {t("productsPage.priceRange")}
        </h2>

        <div className="mt-5 space-y-5">
          <RangeTrack
            max={PRODUCTS_PRICE_MAX}
            valueMin={minPrice}
            valueMax={maxPrice}
            onChangeMin={(value) => {
              clearBracketOnManualPrice();
              onMinPriceChange(value);
            }}
            onChangeMax={(value) => {
              clearBracketOnManualPrice();
              onMaxPriceChange(value);
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min={0}
              max={PRODUCTS_PRICE_MAX}
              value={minPrice}
              placeholder={t("productsPage.minPrice")}
              onChange={(event) => {
                clearBracketOnManualPrice();
                onMinPriceChange(
                  Math.min(
                    Number(event.target.value) || 0,
                    maxPrice,
                    PRODUCTS_PRICE_MAX,
                  ),
                );
              }}
              className={priceInputClass}
            />
            <input
              type="number"
              min={0}
              max={PRODUCTS_PRICE_MAX}
              value={maxPrice}
              placeholder={t("productsPage.maxPrice")}
              onChange={(event) => {
                clearBracketOnManualPrice();
                onMaxPriceChange(
                  Math.max(Number(event.target.value) || 0, minPrice),
                );
              }}
              className={priceInputClass}
            />
          </div>

          <ul className="space-y-3">
            {PRODUCTS_PRICE_BRACKETS.map((bracket) => {
              const selected = priceBracketId === bracket.id;
              return (
                <li key={bracket.id}>
                  <FilterRadio
                    name="products-price-bracket"
                    checked={selected}
                    onChange={() => {
                      onPriceBracketChange(bracket.id);
                      onMinPriceChange(bracket.min);
                      onMaxPriceChange(bracket.max);
                    }}
                    label={t(bracket.labelKey)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="pt-6">
        <h2 className="text-base font-bold text-[var(--primary-text)]">
          {t("productsPage.category")}
        </h2>

        <ul className="mt-5 space-y-4">
          {PRODUCT_CATEGORIES.map((category) => {
            const isActiveCategory = category.id === activeCategoryId;
            const checked = categoryIds.has(category.id);

            return (
              <li key={category.id}>
                <CategoryRow
                  checked={checked}
                  onToggle={() => {
                    const willCheck = !categoryIds.has(category.id);
                    onToggleCategory(category.id);
                    if (willCheck) onActivateCategory(category.id);
                  }}
                  label={categoryLabel(category)}
                />

                {isActiveCategory ? (
                  <div className="mt-2 border-y border-gray-200">
                    {category.subcategories.map((subcategory) => {
                      const expanded = expandedSubcategoryIds.has(
                        subcategory.id,
                      );
                      return (
                        <div
                          key={subcategory.id}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <button
                            type="button"
                            onClick={() => onToggleSubcategory(subcategory.id)}
                            className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm font-medium text-[var(--primary-text)]"
                          >
                            <span>{subcategoryLabel(subcategory)}</span>
                            {expanded ? (
                              <FiChevronDown
                                className="size-4 shrink-0 text-[var(--secondary-text)]"
                                aria-hidden
                              />
                            ) : (
                              <FiChevronRight
                                className="size-4 shrink-0 text-[var(--secondary-text)]"
                                aria-hidden
                              />
                            )}
                          </button>

                          {expanded ? (
                            <ul className="space-y-2.5 pb-3 pl-6">
                              {subcategory.productTypes.map((productType) => (
                                <li key={productType.id}>
                                  <FilterCheckbox
                                    checked={typeIds.has(productType.id)}
                                    onChange={() =>
                                      onToggleType(productType.id)
                                    }
                                    label={typeLabel(productType)}
                                    labelClassName="text-xs leading-snug text-[var(--secondary-text)]"
                                  />
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[var(--primary-text)] shadow-sm lg:hidden"
      >
        <FiSliders className="size-4 shrink-0" aria-hidden />
        {t("productsPage.filters")}
      </button>

      <aside
        className="hidden lg:block lg:w-[292px] lg:shrink-0"
        aria-label={t("productsPage.filters")}
      >
        {sidebarBody}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label={t("productsPage.closeFilters")}
            className="absolute inset-0 bg-black/40"
            onClick={closeMobile}
          />

          <div className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-white shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="text-base font-bold text-[var(--primary-text)]">
                {t("productsPage.filters")}
              </h2>
              <button
                type="button"
                onClick={closeMobile}
                aria-label={t("productsPage.closeFilters")}
                className="inline-flex size-10 items-center justify-center rounded-md text-[var(--primary-text)] hover:bg-gray-100"
              >
                <FiX className="size-5" aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              {sidebarBody}
            </div>

            <div className="flex shrink-0 gap-3 border-t border-gray-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => {
                  onClearFilters?.();
                }}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold text-[var(--primary-text)]"
              >
                {t("productsPage.clearFilters")}
              </button>
              <button
                type="button"
                onClick={closeMobile}
                className="inline-flex h-11 flex-[1.2] items-center justify-center rounded-lg bg-[var(--active)] px-3 text-sm font-semibold text-white"
              >
                {t("productsPage.showResults", { count: resultCount })}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
