import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import OrderDetails from '@/components/data-display/OrderDetails';
import { getSupplierFactoryOrderDetail } from '@/data/demoData';

export default function FactoryOrderDetailPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const [statusOverride, setStatusOverride] = useState(
    location.state?.status ?? null,
  );
  const [installments, setInstallments] = useState(null);

  // TODO: replace getSupplierFactoryOrderDetail with supplier factory order API fetch
  const order = useMemo(() => {
    const detail = getSupplierFactoryOrderDetail(orderId, statusOverride);
    if (!detail) return null;

    return {
      ...detail,
      installments: installments ?? detail.installments,
    };
  }, [orderId, statusOverride, installments]);

  if (!order) {
    return (
      <>
        <Seo title={t('panel.supplierFactoryOrders.notFound')} />

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[var(--primary-text)]">
            {t('panel.supplierFactoryOrders.notFound')}
          </p>
          <Link
            to="/supplier/factory-orders"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--active)] hover:underline"
          >
            {t('panel.supplierFactoryOrders.backToOrders')}
          </Link>
        </div>
      </>
    );
  }

  const handlePayNow = (item) => {
    setInstallments((prev) => {
      const source = prev ?? order.installments;
      return source.map((installment) =>
        installment.id === item.id
          ? { ...installment, status: 'completed' }
          : installment,
      );
    });
    // TODO: wire factory order installment payment API
  };

  const handleCancelInstallment = (item) => {
    setInstallments((prev) => {
      const source = prev ?? order.installments;
      return source.filter((installment) => installment.id !== item.id);
    });
    // TODO: wire factory order installment cancel API
  };

  const handleChat = () => {
    // TODO: open chat with transporter when route is available
  };

  return (
    <>
      <Seo title={t('panel.supplierFactoryOrders.orderDetailsTitle')} />

      <nav
        className="mb-4 text-sm text-neutral-600"
        aria-label={t('panel.supplierFactoryOrders.breadcrumbLabel')}
      >
        <Link
          to="/supplier/factory-orders"
          className="transition-colors hover:text-[var(--active)]"
        >
          {t('panel.supplierFactoryOrders.breadcrumbFactoryOrder')}
        </Link>
        <span className="mx-1.5 text-neutral-400" aria-hidden>&gt;</span>
        <span>{t('panel.supplierFactoryOrders.breadcrumbChatOrder')}</span>
        <span className="mx-1.5 text-neutral-400" aria-hidden>&gt;</span>
        <span className="font-medium text-[var(--active)]">
          {t('panel.supplierFactoryOrders.breadcrumbOrderDetails')}
        </span>
      </nav>

      <OrderDetails
        order={order}
        hasInstallment
        context="factory"
        showPay
        onChat={handleChat}
        onPayNow={handlePayNow}
        onCancelInstallment={handleCancelInstallment}
      />
    </>
  );
}
