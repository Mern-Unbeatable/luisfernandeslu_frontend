import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { FiClock, FiMapPin, FiPackage, FiTruck, FiUser } from "react-icons/fi";
import {
  useChooseSelfDeliveryMutation,
  useGetSupplierDeliveriesQuery,
  useMarkSelfDeliveryDeliveredMutation,
  useSendDeliveryToCarriersMutation,
} from "@/features/supplier/deliveries/deliveriesApi";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import { appLocale } from "@/i18n/locale";

const POLL_MS = 30000;

function formatEuro(value) {
  return new Intl.NumberFormat(appLocale(), {
    style: "currency",
    currency: "EUR",
  }).format(Number(value) || 0);
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString(appLocale(), {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

function useNow(active) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [active]);
  return now;
}

function remainingMs(deadline, now, clockOffset) {
  if (!deadline) return 0;
  return new Date(deadline).getTime() - (now + clockOffset);
}

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--primary-text)]">{title}</h2>
      {subtitle ? (
        <p className="mt-0.5 text-sm text-[var(--secondary-text)]">{subtitle}</p>
      ) : null}
    </div>
  );
}

function OrderSummary({ delivery }) {
  const { t } = useTranslation();
  const product = delivery.product;
  return (
    <div className="space-y-2 text-sm text-[var(--secondary-text)]">
      {product?.title ? (
        <p className="flex items-start gap-2">
          <FiPackage className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            {product.title}
            {product.quantity ? ` · ${product.quantity}${product.unit ? ` ${product.unit}` : ""}` : ""}
          </span>
        </p>
      ) : null}
      {delivery.customer?.name ? (
        <p className="flex items-start gap-2">
          <FiUser className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            {delivery.customer.name}
            {delivery.customer.phone ? ` · ${delivery.customer.phone}` : ""}
          </span>
        </p>
      ) : null}
      {delivery.deliveryAddress ? (
        <p className="flex items-start gap-2">
          <FiMapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{delivery.deliveryAddress}</span>
        </p>
      ) : null}
      <p className="flex items-start gap-2">
        <FiTruck className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          {t("supplierDeliveryLogistics.payout", {
            amount: formatEuro(delivery.selfDeliveryPayout),
          })}
        </span>
      </p>
    </div>
  );
}

function CardShell({ delivery, badge, children }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--secondary-text)]">
            {t("supplierDeliveryLogistics.order")}
          </p>
          <p className="text-base font-bold text-[var(--primary-text)]">
            {delivery.orderNumber}
          </p>
        </div>
        {badge}
      </div>
      <OrderSummary delivery={delivery} />
      {children}
    </div>
  );
}

function Badge({ tone = "gray", children }) {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

const primaryBtn =
  "inline-flex flex-1 items-center justify-center rounded-full bg-[var(--active)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryBtn =
  "inline-flex flex-1 items-center justify-center rounded-full border border-[var(--active)] px-4 py-2.5 text-sm font-semibold text-[var(--active)] transition hover:bg-[color-mix(in_srgb,var(--active)_8%,white)] disabled:cursor-not-allowed disabled:opacity-60";

function DecisionButtons({ disabled, onSelf, onCarrier, carrierLabel }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button type="button" className={primaryBtn} disabled={disabled} onClick={onSelf}>
        {t("supplierDeliveryLogistics.deliverMyself")}
      </button>
      <button type="button" className={secondaryBtn} disabled={disabled} onClick={onCarrier}>
        {carrierLabel}
      </button>
    </div>
  );
}

export default function SupplierDeliveryPanels() {
  const { t } = useTranslation();
  const { data, error, isLoading } = useGetSupplierDeliveriesQuery(undefined, {
    pollingInterval: POLL_MS,
    refetchOnFocus: true,
  });
  const [chooseSelf] = useChooseSelfDeliveryMutation();
  const [sendToCarriers] = useSendDeliveryToCarriersMutation();
  const [markDelivered] = useMarkSelfDeliveryDeliveredMutation();
  const [busyOrderId, setBusyOrderId] = useState(null);

  const pending = data?.pending || [];
  const selfDeliveries = data?.self || [];
  const awaitingCarrier = data?.awaitingCarrier || [];
  const hasTimers =
    pending.length > 0 ||
    selfDeliveries.some((d) => !d.deliveredAt && d.orderStatus !== "DELIVERED");
  const now = useNow(hasTimers);
  const clockOffset = data?.clockOffset || 0;

  const run = async (orderId, action, successKey) => {
    setBusyOrderId(orderId);
    try {
      await action(orderId).unwrap();
      toast.success(t(successKey));
    } catch (err) {
      toast.error(getApiErrorMessage(err, t("common.requestFailed")));
    } finally {
      setBusyOrderId(null);
    }
  };

  if (isLoading) return null;

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {getApiErrorMessage(error, t("common.requestFailed"))}
      </div>
    );
  }

  return (
    <>
      {pending.length > 0 ? (
        <section className="space-y-4">
          <SectionHeader
            title={t("supplierDeliveryLogistics.pending.title")}
            subtitle={t("supplierDeliveryLogistics.pending.subtitle")}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pending.map((delivery) => {
              const left = remainingMs(delivery.decisionDeadline, now, clockOffset);
              const disabled = busyOrderId === delivery.orderId || left <= 0;
              return (
                <CardShell
                  key={delivery.orderId}
                  delivery={delivery}
                  badge={
                    <Badge tone={left > 60000 ? "amber" : "red"}>
                      <FiClock className="size-3.5" aria-hidden />
                      {left > 0
                        ? formatCountdown(left)
                        : t("supplierDeliveryLogistics.pending.timeUp")}
                    </Badge>
                  }
                >
                  <DecisionButtons
                    disabled={disabled}
                    onSelf={() =>
                      run(delivery.orderId, chooseSelf, "supplierDeliveryLogistics.selfChosen")
                    }
                    onCarrier={() =>
                      run(delivery.orderId, sendToCarriers, "supplierDeliveryLogistics.carrierChosen")
                    }
                    carrierLabel={t("supplierDeliveryLogistics.sendToCarriers")}
                  />
                </CardShell>
              );
            })}
          </div>
        </section>
      ) : null}

      {selfDeliveries.length > 0 ? (
        <section className="space-y-4">
          <SectionHeader
            title={t("supplierDeliveryLogistics.self.title")}
            subtitle={t("supplierDeliveryLogistics.self.subtitle")}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {selfDeliveries.map((delivery) => {
              const delivered =
                Boolean(delivery.deliveredAt) ||
                delivery.orderStatus === "DELIVERED";
              const left = remainingMs(
                delivery.selfDeliveryDeadline,
                now,
                clockOffset,
              );
              const late = delivery.isLate || (!delivered && left <= 0);
              const busy = busyOrderId === delivery.orderId;
              let badge;
              if (delivered) {
                badge = (
                  <Badge tone={late ? "red" : "green"}>
                    {late
                      ? t("supplierDeliveryLogistics.self.deliveredLate")
                      : t("supplierDeliveryLogistics.self.delivered")}
                  </Badge>
                );
              } else if (late) {
                badge = (
                  <Badge tone="red">{t("supplierDeliveryLogistics.self.late")}</Badge>
                );
              } else {
                badge = (
                  <Badge tone="blue">
                    <FiClock className="size-3.5" aria-hidden />
                    {formatCountdown(left)}
                  </Badge>
                );
              }
              return (
                <CardShell key={delivery.orderId} delivery={delivery} badge={badge}>
                  <p className="text-xs text-[var(--secondary-text)]">
                    {delivered
                      ? t("supplierDeliveryLogistics.self.deliveredAt", {
                          date: formatDateTime(delivery.deliveredAt),
                        })
                      : t("supplierDeliveryLogistics.self.deadline", {
                          date: formatDateTime(delivery.selfDeliveryDeadline),
                        })}
                  </p>
                  {!delivered ? (
                    <button
                      type="button"
                      className={primaryBtn}
                      disabled={busy}
                      onClick={() =>
                        run(
                          delivery.orderId,
                          markDelivered,
                          "supplierDeliveryLogistics.self.markedDelivered",
                        )
                      }
                    >
                      {t("supplierDeliveryLogistics.self.markDelivered")}
                    </button>
                  ) : null}
                </CardShell>
              );
            })}
          </div>
        </section>
      ) : null}

      {awaitingCarrier.length > 0 ? (
        <section className="space-y-4">
          <SectionHeader
            title={t("supplierDeliveryLogistics.awaiting.title")}
            subtitle={t("supplierDeliveryLogistics.awaiting.subtitle")}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {awaitingCarrier.map((delivery) => {
              const noCarrier = delivery.auction?.status === "EXPIRED";
              return (
                <CardShell
                  key={delivery.orderId}
                  delivery={delivery}
                  badge={
                    noCarrier ? (
                      <Badge tone="red">
                        {t("supplierDeliveryLogistics.awaiting.noCarrier")}
                      </Badge>
                    ) : (
                      <Badge tone="amber">
                        {t("supplierDeliveryLogistics.awaiting.searching")}
                      </Badge>
                    )
                  }
                >
                  {noCarrier ? (
                    <DecisionButtons
                      disabled={busyOrderId === delivery.orderId}
                      onSelf={() =>
                        run(delivery.orderId, chooseSelf, "supplierDeliveryLogistics.selfChosen")
                      }
                      onCarrier={() =>
                        run(delivery.orderId, sendToCarriers, "supplierDeliveryLogistics.carrierChosen")
                      }
                      carrierLabel={t("supplierDeliveryLogistics.tryCarriersAgain")}
                    />
                  ) : delivery.auction?.expiresAt ? (
                    <p className="text-xs text-[var(--secondary-text)]">
                      {t("supplierDeliveryLogistics.awaiting.endsAt", {
                        date: formatDateTime(delivery.auction.expiresAt),
                      })}
                    </p>
                  ) : null}
                </CardShell>
              );
            })}
          </div>
        </section>
      ) : null}
    </>
  );
}
