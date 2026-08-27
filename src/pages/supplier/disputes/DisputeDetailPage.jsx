import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import DisputeResolution from "@/components/data-display/DisputeResolution";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import {
  useGetSupplierDisputeByIdQuery,
  useUpdateSupplierDisputeStatusMutation,
} from "@/features/supplier/disputes/disputesApi";

export default function DisputeDetailPage() {
  const { t } = useTranslation();
  const { disputeId } = useParams();
  const {
    data: dispute,
    isLoading,
    error,
  } = useGetSupplierDisputeByIdQuery(disputeId, { skip: !disputeId });
  const [updateDisputeStatus] = useUpdateSupplierDisputeStatusMutation();

  const handleStatusChange = useCallback(
    (status) => {
      if (!disputeId) return;
      void updateDisputeStatus({ id: disputeId, status });
    },
    [disputeId, updateDisputeStatus],
  );

  const errorMessage = error
    ? getApiErrorMessage(error, t("common.requestFailed"))
    : "";

  if (!disputeId) {
    return (
      <div className="space-y-4">
        <Seo title={t("supplierDisputesResolution.detail.notFound")} />
        <p className="text-sm text-[var(--secondary-text)]">
          {t("supplierDisputesResolution.detail.notFound")}
        </p>
        <Link
          to="/supplier/disputes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t("supplierDisputesResolution.detail.back")}
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-[var(--secondary-text)]">
        {t("common.loading")}
      </div>
    );
  }

  if (errorMessage || !dispute) {
    return (
      <div className="space-y-4">
        <Seo title={t("supplierDisputesResolution.detail.notFound")} />
        <p className="text-sm text-[var(--secondary-text)]">
          {errorMessage || t("supplierDisputesResolution.detail.notFound")}
        </p>
        <Link
          to="/supplier/disputes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t("supplierDisputesResolution.detail.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Seo
        title={t("supplierDisputesResolution.detail.title", {
          id: dispute.disputeId,
        })}
        description={t("supplierDisputesResolution.subtitle")}
      />

      <Link
        to="/supplier/disputes"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] hover:text-[var(--active)]"
      >
        <FiArrowLeft className="size-4" aria-hidden />
        {t("supplierDisputesResolution.detail.back")}
      </Link>

      <DisputeResolution
        variant="dashboard"
        dispute={dispute}
        currentUserRole="seller"
        onStatusChange={handleStatusChange}
        onSendMessage={(text) => {
          // TODO: wire supplier dispute message API
        }}
      />
    </div>
  );
}
