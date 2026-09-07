import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function PromoCodeDeleteModal({
  open,
  promoCode,
  deleting = false,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const code = promoCode?.code || "";

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape" && !deleting) onClose?.();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, deleting]);

  if (!open || !promoCode) return null;

  return createPortal(
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("panel.supplierPromoCodes.delete.closeOverlay", {
          defaultValue: "Close modal overlay",
        })}
        className="absolute inset-0 bg-black/45"
        onClick={() => {
          if (!deleting) onClose?.();
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
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <FiAlertTriangle className="size-5" aria-hidden />
            </span>
            <div>
              <h2
                id={titleId}
                className="text-lg font-bold text-(--primary-text)"
              >
                {t("panel.supplierPromoCodes.delete.title", {
                  defaultValue: "Delete Promo Code",
                })}
              </h2>
              <p className="mt-1 text-sm text-(--secondary-text)">
                {t("panel.supplierPromoCodes.delete.message", {
                  defaultValue:
                    'Are you sure you want to delete promo code "{{code}}"? This action cannot be undone.',
                  code,
                })}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label={t("panel.supplierPromoCodes.delete.close", {
              defaultValue: "Close",
            })}
            onClick={onClose}
            disabled={deleting}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-(--secondary-text) hover:bg-gray-200 disabled:opacity-50"
          >
            <FiX className="size-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-(--primary-text) transition hover:bg-gray-50 disabled:opacity-50"
          >
            {t("panel.supplierPromoCodes.delete.cancel", {
              defaultValue: "Cancel",
            })}
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.(promoCode)}
            disabled={deleting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting
              ? t("panel.supplierPromoCodes.delete.deleting", {
                  defaultValue: "Deleting...",
                })
              : t("panel.supplierPromoCodes.delete.confirm", {
                  defaultValue: "Delete",
                })}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
