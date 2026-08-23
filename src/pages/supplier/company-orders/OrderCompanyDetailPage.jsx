import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import OrderDetails from '@/components/data-display/OrderDetails';
import { getSupplierCompanyOrderDetail } from '@/data/demoData';

export default function OrderCompanyDetailPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [statusOverride, setStatusOverride] = useState(
    location.state?.status ?? null,
  );

  const orderTab = location.state?.tab ?? 'direct';

  // TODO: replace getSupplierCompanyOrderDetail with supplier company order API fetch
  const order = useMemo(() => {
    const detail = getSupplierCompanyOrderDetail(orderId, statusOverride);
    if (!detail) return null;

    return detail;
  }, [orderId, statusOverride]);

  const isChatOrder = order?.hasInstallment ?? orderTab === 'chat';

  if (!order) {
    return (
      <>
        <Seo title={t('panel.supplierCompanyOrders.notFound')} />

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[var(--primary-text)]">
            {t('panel.supplierCompanyOrders.notFound')}
          </p>
          <Link
            to="/supplier/company-orders"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--active)] hover:underline"
          >
            {t('panel.supplierCompanyOrders.backToOrders')}
          </Link>
        </div>
      </>
    );
  }

  const handleAccept = () => {
    setStatusOverride(isChatOrder ? 'pending' : 'pending');
    // TODO: wire accept company order API
  };

  const handleDownloadInvoice = () => {
    // TODO: wire download invoice API
  };

  const handleChat = () => {
    navigate('/supplier/chat');
  };

  return (
    <>
      <Seo title={t('panel.supplierCompanyOrders.orderDetailsTitle')} />

      <OrderDetails
        order={order}
        hasInstallment={isChatOrder}
        onBack={() => navigate('/supplier/company-orders')}
        onAccept={handleAccept}
        onDownloadInvoice={handleDownloadInvoice}
        onChat={handleChat}
      />
    </>
  );
}
