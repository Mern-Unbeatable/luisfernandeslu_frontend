import { useMemo, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination/Pagination';
import ProductCard from '@/components/data-display/ProductCard/ProductCard';
import Seo from '@/components/common/Seo/Seo';
import { useUploadProductsCsvMutation } from '@/features/products/productApi';
import {
  DEMO_SUPPLIER_PRODUCTS,
  DEMO_SUPPLIER_PRODUCT_CATEGORIES,
  SUPPLIER_PRODUCTS_PAGE_SIZE,
} from '@/data/demoData';
import UploadCsvModal from './UploadCsvModal';

const TAB_CONFIG = [
  { id: 'all', labelKey: 'panel.supplierProducts.tabAll' },
  { id: 'pending', labelKey: 'panel.supplierProducts.tabPending' },
  { id: 'rejected', labelKey: 'panel.supplierProducts.tabRejected' },
  { id: 'regular', labelKey: 'panel.supplierProducts.tabRegular' },
  { id: 'bulk_order', labelKey: 'panel.supplierProducts.tabBulkOrder' },
  { id: 'featured', labelKey: 'panel.supplierProducts.tabFeatured' },
];

const CATEGORY_LABEL_KEYS = {
  'cement-mortar-concrete': 'panel.supplierProducts.categories.cementMortarConcrete',
  aggregates: 'panel.supplierProducts.categories.aggregates',
  'steel-rebar': 'panel.supplierProducts.categories.steelRebar',
};

export default function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [csvOpen, setCsvOpen] = useState(false);
  const [products, setProducts] = useState(DEMO_SUPPLIER_PRODUCTS);
  const [uploadProductsCsv] = useUploadProductsCsvMutation();

  // TODO: replace DEMO_* with supplier products API fetch

  const tabCounts = useMemo(() => {
    const counts = { all: products.length };

    TAB_CONFIG.slice(1).forEach((tab) => {
      counts[tab.id] = products.filter((item) => item.tab === tab.id).length;
    });

    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (activeTab !== 'all' && item.tab !== activeTab) return false;
      if (category !== 'all' && item.categoryId !== category) return false;
      return true;
    });
  }, [products, activeTab, category]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / SUPPLIER_PRODUCTS_PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);

  const visibleProducts = useMemo(() => {
    const start = (safePage - 1) * SUPPLIER_PRODUCTS_PAGE_SIZE;
    return filteredProducts.slice(start, start + SUPPLIER_PRODUCTS_PAGE_SIZE);
  }, [filteredProducts, safePage]);

  const categoryOptions = DEMO_SUPPLIER_PRODUCT_CATEGORIES.map((option) => ({
    value: option.value,
    label: option.labelKey
      ? t(option.labelKey)
      : t(CATEGORY_LABEL_KEYS[option.value], { defaultValue: option.label }),
  }));

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <>
      <Seo title={t('panel.supplierProducts.title')} />

      <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <header>
          <h1 className='text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl'>
            {t('panel.supplierProducts.title')}
          </h1>
          <p className='mt-1 text-sm text-neutral-500'>
            {t('panel.supplierProducts.subtitle')}
          </p>
        </header>

        <div className='flex flex-wrap items-center gap-3 shrink-0'>
          <button
            type='button'
            onClick={() => navigate('/supplier/products/add')}
            className='inline-flex items-center justify-center rounded-md bg-[var(--active)] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:brightness-95 sm:text-sm'
          >
            {t('panel.supplierProducts.addProduct')}
          </button>
          <button
            type='button'
            onClick={() => setCsvOpen(true)}
            className='inline-flex items-center justify-center rounded-md border border-[var(--active)] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[var(--active)] transition-colors hover:bg-[color-mix(in_srgb,var(--active)_8%,white)] sm:text-sm'
          >
            {t('panel.supplierProducts.uploadCsv')}
          </button>
        </div>
      </div>

      <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='inline-flex w-fit max-w-full shrink-0 items-center rounded-lg bg-white p-1'>
          {TAB_CONFIG.map((tab) => {
            const isActive = tab.id === activeTab;
            const count = tabCounts[tab.id] ?? 0;

            return (
              <button
                key={tab.id}
                type='button'
                onClick={() => handleTabChange(tab.id)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                  isActive
                    ? 'bg-[var(--active)] text-white shadow-sm'
                    : 'bg-transparent text-[var(--primary-text)] hover:bg-white/80'
                }`}
              >
                {t(tab.labelKey)} ({count})
              </button>
            );
          })}
        </div>

        <div className='flex flex-wrap items-center gap-2 sm:gap-3 shrink-0'>
          <span className='text-sm font-medium text-[var(--primary-text)]'>
            {t('panel.supplierProducts.filters')}
          </span>
          <label className='relative inline-flex min-w-[160px] items-center'>
            <select
              value={category}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className='h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none transition-colors hover:border-gray-300 focus:border-[var(--active)]'
              aria-label={t('panel.supplierProducts.allCategories')}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown
              className='pointer-events-none absolute right-2.5 size-4 text-[var(--secondary-text)]'
              aria-hidden
            />
          </label>
        </div>
      </div>

      {visibleProducts.length > 0 ? (
        <>
          <ul className='grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5'>
            {visibleProducts.map((item) => (
              <li key={item.id} className='flex min-w-0'>
                <ProductCard
                  type={item.cardType === 'featured' ? 'featured' : 'dashboard'}
                  role='supplier'
                  tag={item.tag}
                  status={item.status}
                  badge={item.badge}
                  product={item.product}
                  onCardClick={() =>
                    navigate(`/supplier/products/${item.id}`)
                  }
                  onAction={(actionId) => {
                    if (actionId === 'edit') {
                      navigate(`/supplier/products/${item.id}`);
                      return;
                    }
                    // TODO: wire remaining product actions to API handlers
                  }}
                  className='h-full w-full shadow-sm'
                />
              </li>
            ))}
          </ul>

          <Pagination
            className='mt-8 sm:mt-10'
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className='rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm'>
          <p className='text-base font-semibold text-[var(--primary-text)]'>
            {t('panel.supplierProducts.emptyTitle')}
          </p>
          <p className='mt-2 text-sm text-[var(--secondary-text)]'>
            {t('panel.supplierProducts.emptyHint')}
          </p>
        </div>
      )}

      <UploadCsvModal
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        uploadCsv={uploadProductsCsv}
        onImported={(items) => {
          setProducts((prev) => [...items, ...prev]);
          setActiveTab('all');
          setPage(1);
        }}
      />
    </>
  );
}
