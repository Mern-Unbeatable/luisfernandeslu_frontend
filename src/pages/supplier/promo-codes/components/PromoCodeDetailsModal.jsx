import { useTranslation } from "react-i18next";
import { STATUS_LABEL_KEYS } from "../utils/promoCode.constants";

export default function PromoCodeDetailsModal({
  promoCodeId,
  promoCode,
  isLoading,
  isError,
  onClose,
}) {
  const { t } = useTranslation();

  if (!promoCodeId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-zinc-950">
            {t("panel.supplierPromoCodes.actionSeeDetails")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-(--secondary-text) hover:bg-gray-100"
          >
            {t("common.close", { defaultValue: "Close" })}
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {isLoading ? (
            <p className="text-sm text-(--secondary-text)">Loading...</p>
          ) : null}

          {!isLoading && isError ? (
            <p className="text-sm text-red-600">
              {t("panel.supplierPromoCodes.detailsLoadFailed", {
                defaultValue: "Could not load promo code details.",
              })}
            </p>
          ) : null}

          {!isLoading && !isError && promoCode ? (
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-(--secondary-text)">
                  {t("panel.supplierPromoCodes.colPromoCode")}
                </dt>
                <dd className="text-sm font-semibold text-(--primary-text)">
                  {promoCode.code || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-(--secondary-text)">
                  {t("panel.supplierPromoCodes.colStatus")}
                </dt>
                <dd className="text-sm font-semibold text-(--primary-text)">
                  {t(STATUS_LABEL_KEYS[promoCode.status])}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-(--secondary-text)">
                  {t("panel.supplierPromoCodes.colDiscountType")}
                </dt>
                <dd className="text-sm font-semibold text-(--primary-text)">
                  {promoCode.discountType === "fixed"
                    ? t("panel.supplierPromoCodes.discountTypeFixed")
                    : t("panel.supplierPromoCodes.discountTypePercentage")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-(--secondary-text)">
                  {t("panel.supplierPromoCodes.colDiscountValue")}
                </dt>
                <dd className="text-sm font-semibold text-(--primary-text)">
                  {promoCode.discountValue || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-(--secondary-text)">
                  {t("panel.supplierPromoCodes.colMinOrder")}
                </dt>
                <dd className="text-sm font-semibold text-(--primary-text)">
                  {promoCode.minOrder || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-(--secondary-text)">
                  {t("panel.supplierPromoCodes.colExpiryDate")}
                </dt>
                <dd className="text-sm font-semibold text-(--primary-text)">
                  {promoCode.expiryDate || "-"}
                </dd>
              </div>
            </dl>
          ) : null}
        </div>
      </div>
    </div>
  );
}
