import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { FiX } from "react-icons/fi";
import PaymentMethodSelector from "@/pages/public_page/checkout/components/PaymentMethodSelector";
import { usePaySupplierTransportMutation } from "@/features/supplier/factory-orders/factoryOrdersApi";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import { appLocale } from "@/i18n/locale";

const ALLOWED_METHODS = ["MULTIBANCO", "MBWAY", "CREDITCARD"];

function formatEuro(value) {
  return new Intl.NumberFormat(appLocale(), {
    style: "currency",
    currency: "EUR",
  }).format(Number(value) || 0);
}

export default function TransportPaymentModal({ payment, onClose }) {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("MULTIBANCO");
  const [mbwayPhone, setMbwayPhone] = useState("");
  const [reference, setReference] = useState(null);
  const [payTransport, { isLoading }] = usePaySupplierTransportMutation();

  useEffect(() => {
    if (!payment) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [payment, onClose]);

  if (!payment) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await payTransport({
        orderId: payment.orderId,
        paymentMethod: paymentMethod.toLowerCase(),
        mbwayPhone: paymentMethod === "MBWAY" ? mbwayPhone : undefined,
      }).unwrap();
      if (result?.transportPayment?.status === "PAID") {
        toast.success(t("panel.supplierFactoryOrders.transportPaid"));
        onClose?.();
        return;
      }
      if (paymentMethod === "CREDITCARD" && result?.payment?.url?.startsWith("http")) {
        window.location.href = result.payment.url;
        return;
      }
      if (paymentMethod === "MULTIBANCO") {
        setReference(result?.payment || {});
        return;
      }
      toast.success(t("panel.supplierFactoryOrders.transportPaymentSent"));
      onClose?.();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("ui.close")}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transport-payment-title"
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 id="transport-payment-title" className="text-lg font-bold text-[var(--primary-text)]">
            {t("panel.supplierFactoryOrders.transportPayTitle", { order: payment.orderNumber })}
          </h2>
          <button
            type="button"
            aria-label={t("ui.close")}
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-full bg-gray-100 text-[var(--secondary-text)] hover:bg-gray-200"
          >
            <FiX className="size-4" />
          </button>
        </div>
        <p className="text-sm text-[var(--secondary-text)]">
          {t("panel.supplierFactoryOrders.transportPayIntro", {
            amount: formatEuro(payment.amount),
            distance: payment.distanceKm != null ? Number(payment.distanceKm).toFixed(1) : "—",
          })}
        </p>

        {reference ? (
          <div className="mt-5 space-y-3">
            <dl className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-4 text-sm">
              <dt className="text-[var(--secondary-text)]">{t("panel.supplierFactoryOrders.mbEntity")}</dt>
              <dd className="text-right font-semibold">{reference.entity || "—"}</dd>
              <dt className="text-[var(--secondary-text)]">{t("panel.supplierFactoryOrders.mbReference")}</dt>
              <dd className="text-right font-semibold">{reference.reference || "—"}</dd>
              <dt className="text-[var(--secondary-text)]">{t("panel.supplierFactoryOrders.mbAmount")}</dt>
              <dd className="text-right font-semibold">{formatEuro(payment.amount)}</dd>
            </dl>
            <p className="text-xs text-[var(--secondary-text)]">
              {t("panel.supplierFactoryOrders.mbHint")}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--active)] text-sm font-semibold text-white transition hover:brightness-95"
            >
              {t("ui.close")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
              mbwayPhone={mbwayPhone}
              onMbwayPhoneChange={setMbwayPhone}
              allowedMethods={ALLOWED_METHODS}
            />
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[var(--active)] bg-white text-sm font-semibold text-[var(--active)] transition hover:bg-[#FFFBF5]"
              >
                {t("ui.cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--active)] text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
              >
                {isLoading
                  ? t("ui.saving")
                  : t("panel.supplierFactoryOrders.transportPayButton", { amount: formatEuro(payment.amount) })}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
