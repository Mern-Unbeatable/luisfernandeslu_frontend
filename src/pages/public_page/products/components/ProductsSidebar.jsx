import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiChevronDown, FiChevronRight, FiSliders, FiX } from "react-icons/fi";
import { PRODUCT_CATEGORIES } from "@/data/productCategories";
import {
  PRODUCTS_PRICE_BRACKETS,
  PRODUCTS_PRICE_MAX,
} from "../data/productsListing";

/** Same thin, light scrollbar as the category mega menu. */
const lightScroll =
  "[scrollbar-width:thin] [scrollbar-color:#e5e7eb_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300";

const priceInputClass =
  "h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]";

function FilterCheckbox({ checked, onChange, label, labelClassName = "" }) {
  return (
    <label className="relative flex cursor-pointer items-start gap-2.5">
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
    <label className="relative flex cursor-pointer items-center gap-3">
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

function revealInScrollArea(group) {
  const container = group?.closest("[data-sidebar-scroll]");
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  const groupRect = group.getBoundingClientRect();
  const overflowBottom = groupRect.bottom - containerRect.bottom + 8;
  if (overflowBottom <= 0) return;

  const roomAbove = groupRect.top - containerRect.top - 8;
  const delta = Math.min(overflowBottom, Math.max(roomAbove, 0));
  if (delta > 0) {
    container.scrollTo({ top: container.scrollTop + delta, behavior: "smooth" });
  }
}

function CategoryRow({ checked, onToggle, label, open, onToggleOpen, toggleLabel }) {
  return (
    <div className="flex items-start justify-between gap-2">
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
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={open}
        aria-label={toggleLabel}
        className="-mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded text-[var(--secondary-text)] hover:bg-gray-100"
      >
        {open ? (
          <FiChevronDown className="size-4" aria-hidden />
        ) : (
          <FiChevronRight className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}

function RangeTrack({
  max,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  minLabel,
  maxLabel,
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
        aria-label={minLabel}
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
        aria-label={maxLabel}
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
  onActivateCategory,
  resultCount = 0,
  onClearFilters,
  className = "",
}) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Checked categories open by default; the arrow overrides that per category.
  const [openOverrides, setOpenOverrides] = useState(() => new Map());

  const isCategoryOpen = (categoryId) =>
    openOverrides.has(categoryId)
      ? openOverrides.get(categoryId)
      : categoryIds.has(categoryId);

  const revealTargetRef = useRef(null);

  useLayoutEffect(() => {
    const target = revealTargetRef.current;
    if (!target) return;
    revealTargetRef.current = null;
    revealInScrollArea(target);
  });

  const revealAfterRender = (event, groupSelector) => {
    revealTargetRef.current = event.currentTarget.closest(groupSelector);
  };

  const toggleCategoryOpen = (categoryId, event) => {
    const nextOpen = !isCategoryOpen(categoryId);
    if (nextOpen) revealAfterRender(event, "[data-category-group]");
    setOpenOverrides((prev) => new Map(prev).set(categoryId, nextOpen));
  };

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
            minLabel={t('productsPage.minPrice')}
            maxLabel={t('productsPage.maxPrice')}
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
            const checked = categoryIds.has(category.id);
            const open = isCategoryOpen(category.id);

            return (
              <li key={category.id} data-category-group>
                <CategoryRow
                  checked={checked}
                  onToggle={(event) => {
                    const willCheck = !categoryIds.has(category.id);
                    if (willCheck) revealAfterRender(event, "[data-category-group]");
                    onToggleCategory(category.id);
                    if (willCheck) onActivateCategory(category.id);
                    setOpenOverrides((prev) => {
                      const next = new Map(prev);
                      next.delete(category.id);
                      return next;
                    });
                  }}
                  label={categoryLabel(category)}
                  open={open}
                  onToggleOpen={(event) => toggleCategoryOpen(category.id, event)}
                  toggleLabel={categoryLabel(category)}
                />

                {open ? (
                  <div className="mt-2 ml-1.5 border-l border-gray-200 pl-4">
                    {category.subcategories.map((subcategory) => {
                      const expanded = expandedSubcategoryIds.has(
                        subcategory.id,
                      );
                      return (
                        <div key={subcategory.id} data-subcategory-group>
                          <button
                            type="button"
                            onClick={(event) => {
                              if (!expanded) {
                                revealAfterRender(event, "[data-subcategory-group]");
                              }
                              onToggleSubcategory(subcategory.id);
                            }}
                            aria-expanded={expanded}
                            className="flex w-full items-center justify-between gap-3 py-1.5 text-left text-sm text-[var(--secondary-text)] hover:text-[var(--primary-text)]"
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
                            <ul className="space-y-2 pt-1 pb-2.5 pl-3">
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
        data-sidebar-scroll
        className={`hidden lg:block lg:max-h-[calc(100vh-13rem)] lg:w-[292px] lg:shrink-0 lg:overflow-y-auto lg:overscroll-contain lg:pb-4 ${lightScroll}`}
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

            <div data-sidebar-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
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
