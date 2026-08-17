import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails';
import Seo from '@/components/common/Seo/Seo';
import { getSupplierBuyFromFactoryDetail } from '@/data/demoData';

export default function BuyFromFactoryDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    if (actionId !== 'send_message') return;
    navigate('/supplier/chat', {
      state: { factoryId: product.factoryId, productId: product.id },
    });
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
    </>
  );
}
