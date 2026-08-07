import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination/Pagination';
import ProductCard from '@/components/data-display/ProductCard/ProductCard';
import Seo from '@/components/common/Seo/Seo';
import {
  DEMO_SUPPLIER_BUY_FROM_FACTORY_PRODUCTS,
  SUPPLIER_BUY_FROM_FACTORY_PAGE_SIZE,
} from '@/data/demoData';

export default function BuyFromFactoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  // TODO: replace DEMO_* with supplier buy-from-factory API fetch
  const products = DEMO_SUPPLIER_BUY_FROM_FACTORY_PRODUCTS;

  const totalPages = Math.max(
    1,
    Math.ceil(products.length / SUPPLIER_BUY_FROM_FACTORY_PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);

  const visibleProducts = useMemo(() => {
    const start = (safePage - 1) * SUPPLIER_BUY_FROM_FACTORY_PAGE_SIZE;
    return products.slice(start, start + SUPPLIER_BUY_FROM_FACTORY_PAGE_SIZE);
  }, [products, safePage]);

  const cardActions = useMemo(
    () => [
      {
        id: 'send_message',
        kind: 'full',
        label: t('panel.supplierBuyFromFactory.sendMessage'),
        variant: 'primary',
        icon: 'message',
      },
    ],
    [t],
  );

  const handleAction = useCallback(
    (actionId, item) => {
      if (actionId !== 'send_message') return;
      // TODO: open factory chat thread when API provides factory chat id
      navigate('/supplier/chat', {
        state: { factoryId: item?.factoryId, productId: item?.id },
      });
    },
    [navigate],
  );

  return (
    <>
      <Seo title={t('panel.supplierBuyFromFactory.title')} />

      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
          {t('panel.supplierBuyFromFactory.title')}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {t('panel.supplierBuyFromFactory.subtitle')}
        </p>
      </header>

      {visibleProducts.length > 0 ? (
        <>
          <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {visibleProducts.map((item) => (
              <li key={item.id} className="flex min-w-0">
                <ProductCard
                  type="normal"
                  role="supplier"
                  product={item.product}
                  actions={cardActions}
                  onAction={(actionId) => handleAction(actionId, item)}
                  className="h-full w-full shadow-sm"
                />
              </li>
            ))}
          </ul>

          <Pagination
            className="mt-8 sm:mt-10"
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-semibold text-[var(--primary-text)]">
            {t('panel.supplierBuyFromFactory.emptyTitle')}
          </p>
          <p className="mt-2 text-sm text-[var(--secondary-text)]">
            {t('panel.supplierBuyFromFactory.emptyHint')}
          </p>
        </div>
      )}
    </>
  );
}
