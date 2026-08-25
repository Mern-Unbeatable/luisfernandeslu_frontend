import { useCallback, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import OrderDetails from "@/components/data-display/OrderDetails";
import {
  useGetSupplierCustomerOrderByIdQuery,
  useUpdateSupplierCustomerOrderStatusMutation,
} from "@/features/orders/orderApi";
import {
  CUSTOMER_ORDER_STATUSES,
  normalizeCustomerOrderStatus,
} from "@/features/orders/customerOrderStatus";
import { axiosInstance } from "@/services/api/axiosInstance";

export default function OrderCustomerDetailPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [statusOverride, setStatusOverride] = useState(
    location.state?.status
      ? normalizeCustomerOrderStatus(location.state.status)
      : null,
  );

  const {
    data: order,
    isLoading,
    isError,
  } = useGetSupplierCustomerOrderByIdQuery(orderId, {
    skip: !orderId,
  });
  const [updateSupplierCustomerOrderStatus] =
    useUpdateSupplierCustomerOrderStatusMutation();

  const resolvedOrder = useMemo(() => {
    if (!order) return null;
    return statusOverride ? { ...order, status: statusOverride } : order;
  }, [order, statusOverride]);

  const handleAccept = useCallback(() => {
    updateSupplierCustomerOrderStatus({
      id: orderId,
      status: CUSTOMER_ORDER_STATUSES.PENDING,
    });
    setStatusOverride(CUSTOMER_ORDER_STATUSES.PENDING);
  }, [orderId, updateSupplierCustomerOrderStatus]);

  const handleDownloadInvoice = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/api/supplier/customer-orders/${orderId}/invoice`,
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Invoice download failed", error);
    }
  }, [orderId]);

  const handleChat = useCallback(() => {
    navigate("/supplier/chat");
  }, [navigate]);

  if (!orderId) {
    return (
      <>
        <Seo title={t("panel.supplierCustomerOrders.notFound")} />
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[var(--primary-text)]">
            {t("panel.supplierCustomerOrders.notFound")}
          </p>
          <Link
            to="/supplier/orders-customer"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--active)] hover:underline"
          >
            {t("panel.supplierCustomerOrders.backToOrders")}
          </Link>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
        <p className="text-base font-semibold text-[var(--primary-text)]">
          Loading order details…
        </p>
      </div>
    );
  }

  if (isError || !resolvedOrder) {
    return (
      <>
        <Seo title={t("panel.supplierCustomerOrders.notFound")} />

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[var(--primary-text)]">
            {t("panel.supplierCustomerOrders.notFound")}
          </p>
          <Link
            to="/supplier/orders-customer"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--active)] hover:underline"
          >
            {t("panel.supplierCustomerOrders.backToOrders")}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title={t("panel.supplierCustomerOrders.orderDetailsTitle")} />

      <OrderDetails
        order={resolvedOrder}
        onBack={() => navigate("/supplier/orders-customer")}
        onAccept={handleAccept}
        onDownloadInvoice={handleDownloadInvoice}
        onChat={handleChat}
      />
    </>
  );
}
