import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import OrderDetails from '@/components/data-display/OrderDetails';
import { getSupplierCustomerOrderDetail } from '@/data/demoData';

export default function OrderCustomerDetailPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [statusOverride, setStatusOverride] = useState(
    location.state?.status ?? null,
  );

  // TODO: replace getSupplierCustomerOrderDetail with supplier customer order API fetch
  const order = useMemo(() => {
    const detail = getSupplierCustomerOrderDetail(orderId, statusOverride);
    if (!detail) return null;

    return detail;
  }, [orderId, statusOverride]);

  if (!order) {
    return (
      <>
        <Seo title={t('panel.supplierCustomerOrders.notFound')} />

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[var(--primary-text)]">
            {t('panel.supplierCustomerOrders.notFound')}
          </p>
          <Link
            to="/supplier/orders-customer"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--active)] hover:underline"
          >
            {t('panel.supplierCustomerOrders.backToOrders')}
          </Link>
        </div>
      </>
    );
  }

  const handleAccept = () => {
    setStatusOverride('pending');
    // TODO: wire accept customer order API
  };

  const handleDownloadInvoice = () => {
    // TODO: wire download invoice API
  };

  const handleChat = () => {
    navigate('/supplier/chat');
  };

  return (
    <>
      <Seo title={t('panel.supplierCustomerOrders.orderDetailsTitle')} />

      <OrderDetails
        order={order}
        onBack={() => navigate('/supplier/orders-customer')}
        onAccept={handleAccept}
        onDownloadInvoice={handleDownloadInvoice}
        onChat={handleChat}
      />
    </>
  );
}
