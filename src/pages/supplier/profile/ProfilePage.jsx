import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import PanelProfile from "@/components/forms/PanelProfile";
import {
  useChangeSupplierPasswordMutation,
  useGetSupplierProfileQuery,
  useSaveSupplierIbanMutation,
  useSaveSupplierWarehousesMutation,
  useUpdateSupplierProfileMutation,
} from "@/features/supplier/profile/profileApi";

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

  return (
    <>
      <Seo title={t("panel.profile.title")} />
      <PanelProfile
        role="supplier"
        value={profile || undefined}
        onUpdateProfile={async (payload) => {
          try {
            await updateProfile(payload).unwrap();
          } catch (updateError) {
            console.error("Supplier profile update failed:", updateError);
          }
        }}
        onSaveWarehouses={async (warehouses) => {
          try {
            await saveWarehouses(warehouses).unwrap();
          } catch (warehouseError) {
            console.error("Supplier warehouses update failed:", warehouseError);
          }
        }}
        onChangePassword={async (payload) => {
          try {
            await changePassword(payload).unwrap();
          } catch (passwordError) {
            console.error("Supplier password change failed:", passwordError);
          }
        }}
        onSaveIban={async (payload) => {
          try {
            await saveIban(payload).unwrap();
          } catch (ibanError) {
            console.error("Supplier IBAN update failed:", ibanError);
          }
        }}
      />
      {isLoading ? (
        <div className="mt-4 text-sm text-[var(--secondary-text)]">
          {t("common.loading")}
        </div>
      ) : null}
      {isError ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error?.data?.message ||
            error?.message ||
            "Unable to load supplier profile."}
        </div>
      ) : null}
    </>
  );
}
