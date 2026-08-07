import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails';
import Seo from '@/components/common/Seo/Seo';
import SendQuoteModal from '@/pages/public_page/products/components/SendQuoteModal';
import { getSupplierBuyFromFactoryDetail } from '@/data/demoData';

export default function BuyFromFactoryDetailPage() {
  const { productId } = useParams();
  const { t } = useTranslation();
  const [quoteOpen, setQuoteOpen] = useState(false);

  // TODO: replace getSupplierBuyFromFactoryDetail with buy-from-factory API fetch
  const product = getSupplierBuyFromFactoryDetail(productId);

  if (!product) {
    return (
      <>
        <Seo title={t('panel.supplierBuyFromFactory.notFound')} />

        <div className='rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm'>
          <p className='text-base font-semibold text-[var(--primary-text)]'>
            {t('panel.supplierBuyFromFactory.notFound')}
          </p>
          <Link
            to='/supplier/buy-from-factory'
            className='mt-4 inline-flex text-sm font-semibold text-[var(--active)] hover:underline'
          >
            {t('panel.supplierBuyFromFactory.backToProducts')}
          </Link>
        </div>
      </>
    );
  }

  const handleAction = (actionId) => {
    if (actionId === 'send_quote') {
      setQuoteOpen(true);
    }
    // TODO: wire other factory product actions when available
  };

  return (
    <>
      <Seo title={product.title} />

      <section className=''>
        <ProductDetails
          role='supplier'
          context='buy_from_factory'
          product={product}
          onAction={handleAction}
        />
      </section>

      <SendQuoteModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        product={product}
      />
    </>
  );
}
