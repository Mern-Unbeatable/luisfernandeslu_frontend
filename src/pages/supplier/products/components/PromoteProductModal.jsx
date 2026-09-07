import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { FiStar, FiX } from "react-icons/fi";
import Loading from "@/components/common/Loader/Loading";

export default function PromoteProductModal({
  open,
  product,
  plans = [],
  loading = false,
  submitting = false,
  error = "",
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const [planId, setPlanId] = useState("");
  const selectedPlanId = useMemo(
    () => planId || plans[0]?.id || "",
    [planId, plans],
  );

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape" && !submitting) onClose?.();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, plans, submitting]);

  if (!open || !product) return null;

  const productTitle = product?.product?.title || product?.title || "";

  return createPortal(
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("panel.supplierProducts.promote.closeOverlay", {
          defaultValue: "Close overlay",
        })}
        className="absolute inset-0 bg-black/45"
        onClick={() => {
          if (!submitting) onClose?.();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <FiStar className="size-5" aria-hidden />
            </span>
            <div>
              <h2
                id={titleId}
                className="text-lg font-bold text-(--primary-text)"
              >
                {t("panel.supplierProducts.promote.title", {
                  defaultValue: "Promote product",
                })}
              </h2>
              <p className="mt-1 text-sm text-(--secondary-text)">
                {t("panel.supplierProducts.promote.message", {
                  defaultValue: 'Choose a plan for "{{name}}".',
                  name: productTitle,
                })}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label={t("panel.supplierProducts.promote.close", {
              defaultValue: "Close",
            })}
            onClick={onClose}
            disabled={submitting}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-(--secondary-text) hover:bg-gray-200 disabled:opacity-50"
          >
            <FiX className="size-4" />
          </button>
        </div>

        {loading ? (
          <Loading
            text={t("panel.supplierProducts.promote.loading", {
              defaultValue: "Loading plans…",
            })}
            className="py-1"
          />
        ) : plans.length ? (
          <div className="space-y-2">
            {plans.map((plan) => (
              <label
                key={plan.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 ${
                  selectedPlanId === plan.id
                    ? "border-(--active) bg-[#FFF8F0]"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="promotion-plan"
                    value={plan.id}
                    checked={selectedPlanId === plan.id}
                    onChange={() => setPlanId(plan.id)}
                    disabled={submitting}
                  />
                  <span className="text-sm font-semibold text-(--primary-text)">
                    {plan.name}
                  </span>
                </span>
                <span className="text-sm font-bold text-(--active)">
                  {plan.price}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-(--secondary-text)">
            {t("panel.supplierProducts.promote.empty", {
              defaultValue: "No promotion plans available.",
            })}
          </p>
        )}

        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-(--primary-text) transition hover:bg-gray-50 disabled:opacity-50"
          >
            {t("panel.supplierProducts.delete.cancel")}
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.(selectedPlanId)}
            disabled={!selectedPlanId || submitting || loading}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-(--active) px-5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? t("panel.supplierProducts.promote.paying", {
                  defaultValue: "Processing…",
                })
              : t("panel.supplierProducts.promote.confirm", {
                  defaultValue: "Promote",
                })}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
