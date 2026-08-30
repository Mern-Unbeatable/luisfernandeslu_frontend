import { useMemo } from "react";
import toast from "react-hot-toast";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import CreatePromoCode from "@/components/forms/CreatePromoCode/CreatePromoCode";
import Seo from "@/components/common/Seo/Seo";
import {
  DEMO_CREATE_PROMO_CODE,
  DEMO_SUPPLIER_PROMO_PRODUCT_OPTIONS,
  getPromoCodeFormValueForProduct,
} from "@/data/demoData";
import {
  useCreatePromoCodeMutation,
  useGetPromoCodeByIdQuery,
  useUpdatePromoCodeMutation,
} from "@/features/supplier/promo-codes/promoCodesApi";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import { mapPromoCodeToFormValue } from "./utils/promoCodeFormMapper";

export default function CreatePromoCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const { t } = useTranslation();
  const promoCodeId = location.state?.promoCodeId || "";
  const isPromoCodeEdit = Boolean(promoCodeId);
  const isProductPromoEdit = Boolean(productId);
  const isEdit = isProductPromoEdit || isPromoCodeEdit;

  const {
    data: promoCodeDetail,
    isFetching: isPromoCodeLoading,
    isError: isPromoCodeError,
  } = useGetPromoCodeByIdQuery(promoCodeId, {
    skip: !isPromoCodeEdit,
  });

  const [createPromoCode] = useCreatePromoCodeMutation();
  const [updatePromoCode] = useUpdatePromoCodeMutation();

  const productOptions = useMemo(
    () =>
      DEMO_SUPPLIER_PROMO_PRODUCT_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    [],
  );

  const defaultValue = useMemo(() => {
    if (isPromoCodeEdit) {
      return promoCodeDetail ? mapPromoCodeToFormValue(promoCodeDetail) : null;
    }

    if (!isEdit) return DEMO_CREATE_PROMO_CODE;
    return getPromoCodeFormValueForProduct(productId);
  }, [isEdit, isPromoCodeEdit, productId, promoCodeDetail]);

  if (
    (isProductPromoEdit || isPromoCodeError) &&
    !defaultValue &&
    !isPromoCodeLoading
  ) {
    return (
      <Navigate
        to="/supplier/promo-codes"
        replace
        state={{ tab: isProductPromoEdit ? "promo_product" : "promo_code" }}
      />
    );
  }

  if (isPromoCodeEdit && isPromoCodeLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-base font-semibold text-(--primary-text)">
          Loading promo code…
        </p>
      </div>
    );
  }

  const goBack = () =>
    navigate("/supplier/promo-codes", {
      state: { tab: isProductPromoEdit ? "promo_product" : undefined },
    });

  const title = isEdit
    ? t("panel.supplierPromoCodes.edit.title")
    : t("panel.supplierPromoCodes.create.title");

  return (
    <>
      <Seo title={title} />

      <CreatePromoCode
        defaultValue={defaultValue}
        productOptions={productOptions}
        breadcrumb={
          isEdit
            ? t("panel.supplierPromoCodes.edit.breadcrumb")
            : t("panel.supplierPromoCodes.create.breadcrumb")
        }
        title={title}
        submitLabel={
          isEdit
            ? t("panel.supplierPromoCodes.edit.submit")
            : t("panel.supplierPromoCodes.create.submit")
        }
        onBack={goBack}
        onSubmit={async (form) => {
          try {
            if (isPromoCodeEdit) {
              await updatePromoCode({ id: promoCodeId, ...form }).unwrap();
            } else {
              await createPromoCode(form).unwrap();
            }
            goBack();
          } catch (error) {
            toast.error(
              getApiErrorMessage(
                error,
                t("panel.supplierPromoCodes.actionFailed", {
                  defaultValue: "Could not save promo code.",
                }),
              ),
            );
          }
        }}
        key={`${isEdit ? "edit" : "create"}-${promoCodeId || productId || "new"}`}
      />
    </>
  );
}
