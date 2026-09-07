import { useCallback, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import OrderDetails from "@/components/data-display/OrderDetails";
import {
  useGetSupplierCompanyOrderByIdQuery,
  useUpdateSupplierCompanyOrderStatusMutation,
} from "@/features/supplier/company-orders/companyOrdersApi";
import { axiosInstance } from "@/services/api/axiosInstance";

export default function OrderCompanyDetailPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [statusOverride, setStatusOverride] = useState(
    location.state?.status ? String(location.state.status).toLowerCase() : null,
  );

  const orderTab = location.state?.tab ?? "direct";

  const {
    data: order,
    isLoading,
    isError,
  } = useGetSupplierCompanyOrderByIdQuery(orderId, {
    skip: !orderId,
  });
  const [updateSupplierCompanyOrderStatus] =
    useUpdateSupplierCompanyOrderStatusMutation();

  const resolvedOrder = useMemo(() => {
    if (!order) return null;
    return statusOverride ? { ...order, status: statusOverride } : order;
  }, [order, statusOverride]);

  const isChatOrder = resolvedOrder?.hasInstallment ?? orderTab === "chat";

  const handleAccept = useCallback(() => {
    if (!orderId) return;
    updateSupplierCompanyOrderStatus({
      id: orderId,
      status: "PENDING",
    });
    setStatusOverride("pending");
  }, [orderId, updateSupplierCompanyOrderStatus]);

  const handleDownloadInvoice = useCallback(async () => {
    if (!orderId) return;

    try {
      const response = await axiosInstance.get(
        `/api/supplier/company-orders/${orderId}/invoice`,
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `company-order-invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Company order invoice download failed", error);
    }
  }, [orderId]);

  const handleChat = useCallback(() => {
    navigate("/supplier/chat");
  }, [navigate]);

  if (!orderId) {
    return (
      <>
        <Seo title={t("panel.supplierCompanyOrders.notFound")} />

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-(--primary-text)">
            {t("panel.supplierCompanyOrders.notFound")}
          </p>
          <Link
            to="/supplier/company-orders"
            className="mt-4 inline-flex text-sm font-semibold text-(--active) hover:underline"
          >
            {t("panel.supplierCompanyOrders.backToOrders")}
          </Link>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-base font-semibold text-(--primary-text)">
          Loading order details…
        </p>
      </div>
    );
  }

  if (isError || !resolvedOrder) {
    return (
      <>
        <Seo title={t("panel.supplierCompanyOrders.notFound")} />

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-(--primary-text)">
            {t("panel.supplierCompanyOrders.notFound")}
          </p>
          <Link
            to="/supplier/company-orders"
            className="mt-4 inline-flex text-sm font-semibold text-(--active) hover:underline"
          >
            {t("panel.supplierCompanyOrders.backToOrders")}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title={t("panel.supplierCompanyOrders.orderDetailsTitle")} />

      <OrderDetails
        order={resolvedOrder}
        hasInstallment={isChatOrder}
        onBack={() => navigate("/supplier/company-orders")}
        onAccept={handleAccept}
        onDownloadInvoice={handleDownloadInvoice}
        onChat={handleChat}
      />
    </>
  );
}
