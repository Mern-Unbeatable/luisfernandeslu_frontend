import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails';
import Seo from '@/components/common/Seo/Seo';
import { getSupplierProductDetail } from '@/data/demoData';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { t } = useTranslation();

  // TODO: replace getSupplierProductDetail with supplier product API fetch
  const product = getSupplierProductDetail(productId);

  if (!product) {
    return (
      <>
        <Seo title={t('panel.supplierProducts.notFound')} />

        <div className='rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm'>
          <p className='text-base font-semibold text-[var(--primary-text)]'>
            {t('panel.supplierProducts.notFound')}
          </p>
          <Link
            to='/supplier/products'
            className='mt-4 inline-flex text-sm font-semibold text-[var(--active)] hover:underline'
          >
            {t('panel.supplierProducts.backToProducts')}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title={product.title} />

      <ProductDetails role='supplier' product={product} />
    </>
  );
}
