import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  useGetSupplierDeliveryEarningsQuery,
  useRequestDeliveryWithdrawalMutation,
} from "@/features/supplier/deliveries/deliveriesApi";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import { appLocale } from "@/i18n/locale";

const STATUS_TONES = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function formatEuro(value) {
  return new Intl.NumberFormat(appLocale(), { style: "currency", currency: "EUR" }).format(
    Number(value) || 0,
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString(appLocale()) : "";
}

function StatBox({ label, value, highlight = false }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--secondary-text)]">{label}</p>
      <p
        className={`mt-1 text-xl font-bold ${highlight ? "text-[var(--active)]" : "text-[var(--primary-text)]"}`}
      >
        {formatEuro(value)}
      </p>
    </div>
  );
}

export default function SupplierDeliveryEarnings() {
  const { t } = useTranslation();
  const { data } = useGetSupplierDeliveryEarningsQuery();
  const [requestWithdrawal, { isLoading: isSubmitting }] = useRequestDeliveryWithdrawalMutation();
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState(null);

  if (!data) return null;

  const accountNumber = account ?? data.defaultAccountNumber;
  const value = Number(amount);
  const canSubmit =
    value > 0 && value <= data.availableBalance && accountNumber.trim().length >= 5 && !isSubmitting;
  const hasActivity =
    data.availableBalance > 0 || data.pendingEarnings > 0 || data.totalEarned > 0 || data.withdrawals.length > 0;
  if (!hasActivity) return null;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    try {
      await requestWithdrawal({ amount: value, accountNumber: accountNumber.trim() }).unwrap();
      toast.success(t("supplierDeliveryLogistics.earnings.requested"));
      setAmount("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, t("common.requestFailed")));
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          {t("supplierDeliveryLogistics.earnings.title")}
        </h2>
        <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
          {t("supplierDeliveryLogistics.earnings.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatBox label={t("supplierDeliveryLogistics.earnings.available")} value={data.availableBalance} highlight />
        <StatBox label={t("supplierDeliveryLogistics.earnings.pending")} value={data.pendingEarnings} />
        <StatBox label={t("supplierDeliveryLogistics.earnings.total")} value={data.totalEarned} />
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-end"
      >
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--primary-text)]">
            {t("supplierDeliveryLogistics.earnings.amount")}
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            max={data.availableBalance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[var(--active)]"
          />
        </label>
        <label className="flex flex-[2] flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--primary-text)]">
            {t("supplierDeliveryLogistics.earnings.iban")}
          </span>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="PT50..."
            className="rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[var(--active)]"
          />
        </label>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-full bg-[var(--active)] px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("supplierDeliveryLogistics.earnings.withdraw")}
        </button>
      </form>

      {data.withdrawals.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-[var(--secondary-text)]">
              <tr>
                <th className="px-4 py-3">{t("supplierDeliveryLogistics.earnings.date")}</th>
                <th className="px-4 py-3">{t("supplierDeliveryLogistics.earnings.amount")}</th>
                <th className="px-4 py-3">{t("supplierDeliveryLogistics.earnings.iban")}</th>
                <th className="px-4 py-3">{t("supplierDeliveryLogistics.earnings.status")}</th>
              </tr>
            </thead>
            <tbody>
              {data.withdrawals.map((w) => (
                <tr key={w.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{formatDate(w.requestedAt)}</td>
                  <td className="px-4 py-3 font-semibold">{formatEuro(w.amount)}</td>
                  <td className="px-4 py-3">{w.accountNumber}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_TONES[w.status] || STATUS_TONES.pending}`}
                    >
                      {t(`supplierDeliveryLogistics.earnings.statuses.${w.status}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
