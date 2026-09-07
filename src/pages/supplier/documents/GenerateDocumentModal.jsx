import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { FiChevronDown, FiFileText, FiX } from "react-icons/fi";

export default function GenerateDocumentModal({
  open,
  onClose,
  orderOptions = [],
  onSubmit,
  submitting = false,
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const listId = useId();
  const inputRef = useRef(null);
  const comboRef = useRef(null);
  const [query, setQuery] = useState("");
  const [orderId, setOrderId] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orderOptions;
    return orderOptions.filter(
      (option) =>
        String(option.label).toLowerCase().includes(q) ||
        String(option.value).toLowerCase().includes(q),
    );
  }, [orderOptions, query]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!comboRef.current?.contains(event.target)) setListOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (!open) return null;

  const selectOption = (option) => {
    setOrderId(option.value);
    setQuery(option.label);
    setListOpen(false);
    inputRef.current?.focus();
  };

  const syncExactMatch = (value) => {
    const q = value.trim().toLowerCase();
    const match = orderOptions.find(
      (option) =>
        String(option.value).toLowerCase() === q ||
        String(option.label).toLowerCase() === q,
    );
    setOrderId(match?.value || "");
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    syncExactMatch(value);
    setListOpen(true);
    setActiveIndex(0);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      if (listOpen) {
        setListOpen(false);
        return;
      }
      onClose?.();
      return;
    }

    if (!listOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setListOpen(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        suggestions.length === 0 ? 0 : (index + 1) % suggestions.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        suggestions.length === 0
          ? 0
          : (index - 1 + suggestions.length) % suggestions.length,
      );
      return;
    }

    if (event.key === "Enter" && listOpen && suggestions[activeIndex]) {
      event.preventDefault();
      selectOption(suggestions[activeIndex]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!orderId) return;
    Promise.resolve(onSubmit?.({ orderId }))
      .then(() => {
        onClose?.();
      })
      .catch(() => {});
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <button
        type="button"
        aria-label={t("panel.supplierFiscalDocuments.modalClose")}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md overflow-visible rounded-xl bg-white shadow-2xl"
      >
        <div className="flex items-start gap-3 border-b border-gray-200 px-5 py-4">
          <span
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--active)_16%,white)] text-[var(--active)]"
            aria-hidden
          >
            <FiFileText className="size-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="text-base font-bold text-[var(--primary-text)]"
            >
              {t("panel.supplierFiscalDocuments.modalTitle")}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {t("panel.supplierFiscalDocuments.modalSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("panel.supplierFiscalDocuments.modalClose")}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--secondary-text)] transition-colors hover:bg-gray-100"
          >
            <FiX className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--primary-text)]">
                {t("panel.supplierFiscalDocuments.modalOrderIdLabel")}
              </span>
              <div ref={comboRef} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded={listOpen}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    listOpen && suggestions[activeIndex]
                      ? `${listId}-option-${activeIndex}`
                      : undefined
                  }
                  value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  onFocus={() => setListOpen(true)}
                  onKeyDown={handleInputKeyDown}
                  placeholder={t(
                    "panel.supplierFiscalDocuments.modalOrderIdPlaceholder",
                  )}
                  autoComplete="off"
                  className={`h-12 w-full bg-white py-2 pl-3 pr-10 text-sm text-[var(--primary-text)] outline-none transition-colors placeholder:text-[var(--secondary-text)] ${
                    listOpen
                      ? "rounded-t-lg rounded-b-none border border-[var(--active)]"
                      : "rounded-lg border border-gray-200 hover:border-gray-300 focus:border-[var(--active)]"
                  }`}
                />
                <FiChevronDown
                  className={`pointer-events-none absolute top-6 right-3 size-4 -translate-y-1/2 text-[var(--secondary-text)] transition-transform ${
                    listOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />

                {listOpen ? (
                  <ul
                    id={listId}
                    role="listbox"
                    className="absolute top-full right-0 left-0 z-20 max-h-52 overflow-y-auto rounded-b-lg border border-t-0 border-[var(--active)] bg-white py-1 shadow-md"
                  >
                    {suggestions.length === 0 ? (
                      <li className="px-3 py-2.5 text-sm text-[var(--secondary-text)]">
                        {t("panel.supplierFiscalDocuments.modalOrderIdEmpty")}
                      </li>
                    ) : (
                      suggestions.map((option, index) => {
                        const isActive = index === activeIndex;
                        const isSelected = option.value === orderId;
                        return (
                          <li
                            key={option.value}
                            id={`${listId}-option-${index}`}
                            role="option"
                            aria-selected={isSelected}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              selectOption(option);
                            }}
                            className={`cursor-pointer px-3 py-2.5 text-sm ${
                              isActive
                                ? "bg-[color-mix(in_srgb,var(--active)_12%,white)] text-[var(--active)]"
                                : "text-[var(--primary-text)]"
                            }`}
                          >
                            {option.label}
                          </li>
                        );
                      })
                    )}
                  </ul>
                ) : null}
              </div>
              <p className="mt-2 text-xs text-[var(--secondary-text)]">
                {t("panel.supplierFiscalDocuments.modalOrderIdHint")}
              </p>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-gray-50"
            >
              {t("panel.supplierFiscalDocuments.modalCancel")}
            </button>
            <button
              type="submit"
              disabled={!orderId || submitting}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--active)] px-4 text-sm font-semibold text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Generating..."
                : t("panel.supplierFiscalDocuments.modalSubmit")}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
