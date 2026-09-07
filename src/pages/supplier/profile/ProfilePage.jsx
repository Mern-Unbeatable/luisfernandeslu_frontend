import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import {
  Field,
  PrimaryButton,
  SecretInput,
  TextInput,
} from "@/components/forms/PanelProfile/FormControls";
import {
  useChangeSupplierPasswordMutation,
  useGetSupplierProfileQuery,
  useSaveSupplierIbanMutation,
  useSaveSupplierWarehousesMutation,
  useUpdateSupplierProfileMutation,
} from "@/features/supplier/profile/profileApi";
import AddressAutocomplete from "@/pages/public_page/checkout/components/AddressAutocomplete";

const EMPTY_SUPPLIER_PROFILE = {
  displayName: "",
  displayEmail: "",
  name: "",
  email: "",
  phone: "",
  avatarUrl: null,
  warehouses: [],
  iban: "",
  ibanPhone: "",
};

const EMPTY_PASSWORD = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useGetSupplierProfileQuery();

  const [updateProfile] = useUpdateSupplierProfileMutation();
  const [saveWarehouses] = useSaveSupplierWarehousesMutation();
  const [changePassword] = useChangeSupplierPasswordMutation();
  const [saveIban] = useSaveSupplierIbanMutation();

  const [draft, setDraft] = useState(EMPTY_SUPPLIER_PROFILE);
  const [warehouseDraft, setWarehouseDraft] = useState([]);
  const [passwordDraft, setPasswordDraft] = useState(EMPTY_PASSWORD);
  const [ibanDraft, setIbanDraft] = useState({ iban: "", ibanPhone: "" });

  const [editingAccount, setEditingAccount] = useState(false);
  const [editingWarehouses, setEditingWarehouses] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingIban, setEditingIban] = useState(false);

  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    const nextProfile = profile ?? EMPTY_SUPPLIER_PROFILE;
    setDraft({
      displayName: nextProfile.displayName ?? nextProfile.name ?? "",
      displayEmail: nextProfile.displayEmail ?? nextProfile.email ?? "",
      name: nextProfile.name ?? "",
      email: nextProfile.email ?? "",
      phone: nextProfile.phone ?? "",
      avatarUrl: nextProfile.avatarUrl ?? null,
      warehouses: nextProfile.warehouses ?? [],
      iban: nextProfile.iban ?? "",
      ibanPhone: nextProfile.ibanPhone ?? "",
    });
    setWarehouseDraft(nextProfile.warehouses ?? []);
    setIbanDraft({
      iban: nextProfile.iban ?? "",
      ibanPhone: nextProfile.ibanPhone ?? "",
    });
  }, [profile]);

  const accountLabel = useMemo(
    () => profile?.name || profile?.displayName || draft.name || "Supplier",
    [draft.name, profile],
  );

  const setField = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleAccountUpdate = async () => {
    const payload = {
      name: draft.name,
      email: draft.email,
      phone: draft.phone,
    };

    setStatus({ type: "loading", message: "Updating account information..." });

    try {
      await updateProfile(payload).unwrap();
      setStatus({
        type: "success",
        message: "Account information updated successfully.",
      });
      toast.success("Account information updated successfully.");
      setEditingAccount(false);
    } catch (error) {
      console.error("Supplier profile update failed:", error);
      const message =
        error?.data?.message ||
        error?.message ||
        "Unable to update account information.";
      setStatus({ type: "error", message });
      toast.error(message);
    }
  };

  const handleAccountCancel = () => {
    setEditingAccount(false);
    setDraft({
      ...draft,
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
    });
  };

  const handleWarehouseUpdate = async () => {
    const payload = (warehouseDraft || []).map((item) => ({
      id: item?.id,
      label: item?.label ?? item?.name,
      address: item?.address ?? "",
    }));

    setStatus({ type: "loading", message: "Updating warehouse locations..." });

    try {
      await saveWarehouses(payload).unwrap();
      setStatus({
        type: "success",
        message: "Warehouse locations updated successfully.",
      });
      toast.success("Warehouse locations updated successfully.");
      setEditingWarehouses(false);
    } catch (error) {
      console.error("Supplier warehouses update failed:", error);
      const message =
        error?.data?.message ||
        error?.message ||
        "Unable to update warehouse locations.";
      setStatus({ type: "error", message });
      toast.error(message);
    }
  };

  const handleWarehouseCancel = () => {
    setEditingWarehouses(false);
    setWarehouseDraft(profile?.warehouses ?? []);
  };

  const addWarehouse = () => {
    setEditingWarehouses(true);
    setWarehouseDraft((current) => [
      ...current,
      {
        id: `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        label: `Warehouse ${current.length + 1}`,
        address: "",
      },
    ]);
  };

  const handlePasswordUpdate = async () => {
    setStatus({ type: "loading", message: "Changing password..." });

    try {
      await changePassword(passwordDraft).unwrap();
      setStatus({ type: "success", message: "Password changed successfully." });
      toast.success("Password changed successfully.");
      setEditingPassword(false);
      setPasswordDraft(EMPTY_PASSWORD);
    } catch (error) {
      console.error("Supplier password change failed:", error);
      const message =
        error?.data?.message || error?.message || "Unable to change password.";
      setStatus({ type: "error", message });
      toast.error(message);
    }
  };

  const handlePasswordCancel = () => {
    setEditingPassword(false);
    setPasswordDraft(EMPTY_PASSWORD);
  };

  const handleIbanUpdate = async () => {
    const payload = {
      iban: ibanDraft.iban,
      ibanPhone: ibanDraft.ibanPhone,
    };

    setStatus({ type: "loading", message: "Updating IBAN..." });

    try {
      await saveIban(payload).unwrap();
      setStatus({ type: "success", message: "IBAN updated successfully." });
      toast.success("IBAN updated successfully.");
      setEditingIban(false);
    } catch (error) {
      console.error("Supplier IBAN update failed:", error);
      const message =
        error?.data?.message || error?.message || "Unable to update IBAN.";
      setStatus({ type: "error", message });
      toast.error(message);
    }
  };

  const handleIbanCancel = () => {
    setEditingIban(false);
    setIbanDraft({
      iban: profile?.iban ?? "",
      ibanPhone: profile?.ibanPhone ?? "",
    });
  };

  const renderStatus = () => {
    if (status.type === "idle") return null;

    const palette = {
      success: "border-emerald-200 bg-emerald-50 text-emerald-700",
      error: "border-red-200 bg-red-50 text-red-700",
      loading: "border-blue-200 bg-blue-50 text-blue-700",
    };

    return (
      <div
        className={`mt-5 rounded-xl border px-4 py-3 text-sm ${palette[status.type]}`}
      >
        {status.message}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Seo title={t("panel.profile.title")} />

      <div className="space-y-6">
        <header>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--primary-text)] sm:text-4xl">
            {t("panel.profile.title")}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--secondary-text)]">
            {t("panel.profile.subtitle")}
          </p>
        </header>

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-[var(--secondary-text)]">
            {t("common.loading")}
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error?.data?.message ||
              error?.message ||
              "Unable to load supplier profile."}
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <>
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[var(--primary-text)]">
                    {t("panel.profile.accountInformation")}
                  </h2>
                </div>
                {!editingAccount ? (
                  <button
                    type="button"
                    onClick={() => setEditingAccount(true)}
                    className="rounded-md bg-[var(--active)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    {t("panel.profile.edit")}
                  </button>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t("panel.profile.name")}>
                  <TextInput
                    value={draft.name}
                    onChange={(value) => setField("name", value)}
                    placeholder={t("panel.profile.namePlaceholder")}
                    disabled={!editingAccount}
                  />
                </Field>

                <Field label={t("panel.profile.email")}>
                  <TextInput
                    type="email"
                    value={draft.email}
                    onChange={(value) => setField("email", value)}
                    placeholder={t("panel.profile.emailPlaceholder")}
                    disabled={!editingAccount}
                  />
                </Field>

                <Field
                  label={t("panel.profile.phoneNumber")}
                  className="sm:col-span-2"
                >
                  <TextInput
                    value={draft.phone}
                    onChange={(value) => setField("phone", value)}
                    placeholder={t("panel.profile.phonePlaceholder")}
                    disabled={!editingAccount}
                  />
                </Field>
              </div>

              {editingAccount ? (
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleAccountCancel}
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50"
                  >
                    {t("panel.profile.cancel")}
                  </button>
                  <PrimaryButton onClick={handleAccountUpdate}>
                    {t("panel.profile.updateProfile")}
                  </PrimaryButton>
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[var(--primary-text)]">
                    {t("panel.profile.warehouseLocationSupplier")}
                  </h2>
                </div>
                {!editingWarehouses ? (
                  <button
                    type="button"
                    onClick={() => setEditingWarehouses(true)}
                    className="rounded-md bg-[var(--active)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    {t("panel.profile.edit")}
                  </button>
                ) : null}
              </div>

              <div className="space-y-4">
                {(warehouseDraft || []).map((warehouse, index) => (
                  <Field
                    key={warehouse?.id || index}
                    label={`${t("panel.profile.warehouseN", { n: index + 1 })}`}
                  >
                    <AddressAutocomplete
                      value={warehouse?.address ?? ""}
                      onChange={(value) => {
                        setWarehouseDraft((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, address: value }
                              : item,
                          ),
                        );
                      }}
                      onLocationSelect={(loc) => {
                        setWarehouseDraft((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, address: loc.address }
                              : item,
                          ),
                        );
                      }}
                      placeholder={t("panel.profile.warehousePlaceholder")}
                      inputClassName="w-full rounded-md border border-gray-200 bg-white text-sm text-[var(--primary-text)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--active)] h-11 px-3 disabled:bg-gray-50 disabled:text-gray-500"
                      disabled={!editingWarehouses}
                    />
                  </Field>
                ))}

                {editingWarehouses ? (
                  <button
                    type="button"
                    onClick={addWarehouse}
                    className="text-sm font-medium text-[var(--active)] hover:underline"
                  >
                    {t("panel.profile.addWarehouse")}
                  </button>
                ) : null}

                {editingWarehouses &&
                (!warehouseDraft || warehouseDraft.length === 0) ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-[var(--secondary-text)]">
                    {t("panel.profile.noWarehouses")}
                  </div>
                ) : null}
              </div>

              {editingWarehouses ? (
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleWarehouseCancel}
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50"
                  >
                    {t("panel.profile.cancel")}
                  </button>
                  <PrimaryButton onClick={handleWarehouseUpdate}>
                    {t("panel.profile.save")}
                  </PrimaryButton>
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[var(--primary-text)]">
                    {t("panel.profile.changePassword")}
                  </h2>
                </div>
                {!editingPassword ? (
                  <button
                    type="button"
                    onClick={() => setEditingPassword(true)}
                    className="rounded-md bg-[var(--active)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    {t("panel.profile.edit")}
                  </button>
                ) : null}
              </div>

              {editingPassword ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <Field label={t("panel.profile.currentPassword")}>
                    <SecretInput
                      value={passwordDraft.currentPassword}
                      onChange={(value) =>
                        setPasswordDraft((current) => ({
                          ...current,
                          currentPassword: value,
                        }))
                      }
                      placeholder="••••••••"
                    />
                  </Field>

                  <Field label={t("panel.profile.newPassword")}>
                    <SecretInput
                      value={passwordDraft.newPassword}
                      onChange={(value) =>
                        setPasswordDraft((current) => ({
                          ...current,
                          newPassword: value,
                        }))
                      }
                      placeholder="••••••••"
                    />
                  </Field>

                  <Field label={t("panel.profile.confirmNewPassword")}>
                    <SecretInput
                      value={passwordDraft.confirmPassword}
                      onChange={(value) =>
                        setPasswordDraft((current) => ({
                          ...current,
                          confirmPassword: value,
                        }))
                      }
                      placeholder="••••••••"
                    />
                  </Field>
                </div>
              ) : (
                <p className="text-sm text-[var(--secondary-text)]">
                  {t("panel.profile.passwordHidden")}
                </p>
              )}

              {editingPassword ? (
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handlePasswordCancel}
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50"
                  >
                    {t("panel.profile.cancel")}
                  </button>
                  <PrimaryButton onClick={handlePasswordUpdate}>
                    {t("panel.profile.changePassword")}
                  </PrimaryButton>
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[var(--primary-text)]">
                    {t("panel.profile.ibanTitle")}
                  </h2>
                </div>
                {!editingIban ? (
                  <button
                    type="button"
                    onClick={() => setEditingIban(true)}
                    className="rounded-md bg-[var(--active)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    {t("panel.profile.edit")}
                  </button>
                ) : null}
              </div>

              {editingIban ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={t("panel.profile.ibanNumber")}>
                    <SecretInput
                      value={ibanDraft.iban}
                      onChange={(value) =>
                        setIbanDraft((current) => ({ ...current, iban: value }))
                      }
                      placeholder={t("panel.profile.ibanPlaceholder")}
                    />
                  </Field>

                  <Field label={t("panel.profile.ibanPhoneEurope")}>
                    <SecretInput
                      value={ibanDraft.ibanPhone}
                      onChange={(value) =>
                        setIbanDraft((current) => ({
                          ...current,
                          ibanPhone: value,
                        }))
                      }
                      placeholder={t("panel.profile.ibanPhonePlaceholder")}
                    />
                  </Field>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-[var(--secondary-text)]">
                      {t("panel.profile.ibanNumber")}
                    </p>
                    <p className="mt-2 font-medium text-[var(--primary-text)]">
                      {profile?.iban || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-[var(--secondary-text)]">
                      {t("panel.profile.ibanPhoneEurope")}
                    </p>
                    <p className="mt-2 font-medium text-[var(--primary-text)]">
                      {profile?.ibanPhone || "—"}
                    </p>
                  </div>
                </div>
              )}

              {editingIban ? (
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleIbanCancel}
                    className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50"
                  >
                    {t("panel.profile.cancel")}
                  </button>
                  <PrimaryButton onClick={handleIbanUpdate}>
                    {t("panel.profile.saveIban")}
                  </PrimaryButton>
                </div>
              ) : null}
            </section>
          </>
        ) : null}

        {renderStatus()}
      </div>
    </>
  );
}
