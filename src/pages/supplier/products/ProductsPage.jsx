import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Pagination from '@/components/common/Pagination/Pagination'
import DataTable from '@/components/data-display/DataTable/DataTable'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import Seo from '@/components/common/Seo/Seo'
import {
  useDeleteProductMutation,
  useUploadProductsCsvMutation,
} from '@/features/products/productApi'
import {
  DEMO_SUPPLIER_PRODUCTS,
  SUPPLIER_PRODUCTS_PAGE_SIZE,
} from '@/data/demoData'
import { PRODUCT_CATEGORIES } from '@/data/productCategories'
import DeleteProductModal from './DeleteProductModal'
import UploadCsvModal from './UploadCsvModal'
const TAB_CONFIG = [
  { id: 'all', labelKey: 'panel.supplierProducts.tabAll' },
  { id: 'pending', labelKey: 'panel.supplierProducts.tabPending' },
  { id: 'rejected', labelKey: 'panel.supplierProducts.tabRejected' },
  { id: 'regular', labelKey: 'panel.supplierProducts.tabRegular' },
  { id: 'bulk_order', labelKey: 'panel.supplierProducts.tabBulkOrder' },
  { id: 'featured', labelKey: 'panel.supplierProducts.tabFeatured' },
]

export default function ProductsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [csvOpen, setCsvOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [products, setProducts] = useState(DEMO_SUPPLIER_PRODUCTS)
  const [uploadProductsCsv] = useUploadProductsCsvMutation()
  const [deleteProduct] = useDeleteProductMutation()

  // TODO: replace DEMO_* with supplier products API fetch

  const categoryProducts = useMemo(() => {
    if (category === 'all') return products
    return products.filter((item) => item.categoryId === category)
  }, [products, category])

  const tabCounts = useMemo(() => {
    const counts = { all: categoryProducts.length }

    TAB_CONFIG.slice(1).forEach((tab) => {
      counts[tab.id] = categoryProducts.filter(
        (item) => item.tab === tab.id,
      ).length
    })

    return counts
  }, [categoryProducts])

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return categoryProducts
    return categoryProducts.filter((item) => item.tab === activeTab)
  }, [categoryProducts, activeTab])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / SUPPLIER_PRODUCTS_PAGE_SIZE),
  )
  const safePage = Math.min(page, totalPages)

  const visibleProducts = useMemo(() => {
    const start = (safePage - 1) * SUPPLIER_PRODUCTS_PAGE_SIZE
    return filteredProducts.slice(start, start + SUPPLIER_PRODUCTS_PAGE_SIZE)
  }, [filteredProducts, safePage])

  const categoryOptions = useMemo(
    () => [
      {
        value: 'all',
        label: t('panel.supplierProducts.allCategories'),
      },
      ...PRODUCT_CATEGORIES.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ],
    [t],
  )

  const tabs = useMemo(
    () =>
      TAB_CONFIG.map((tab) => ({
        id: tab.id,
        label: `${t(tab.labelKey)} (${tabCounts[tab.id] ?? 0})`,
      })),
    [t, tabCounts],
  )

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
  }

  const handleCategoryChange = (value) => {
    setCategory(value)
    setPage(1)
  }

  const tableFilters = useMemo(
    () => [
      {
        id: 'category',
        value: category,
        onChange: handleCategoryChange,
        options: categoryOptions,
        placeholder: t('panel.supplierProducts.allCategories'),
      },
    ],
    [category, categoryOptions, t],
  )

  const handleCardAction = (actionId, item) => {
    if (actionId === 'edit') {
      navigate(`/supplier/products/${item.id}/edit`)
      return
    }
    if (actionId === 'delete') {
      setProductToDelete(item)
    }
  }

  const handleConfirmDelete = async (item) => {
    if (!item?.id || deleting) return

    setDeleting(true)

    try {
      await Promise.race([
        deleteProduct(item.id).unwrap(),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('timeout')), 4000)
        }),
      ])
    } catch {
      // Keep local delete when the API is unavailable.
    }

    setProducts((prev) => {
      const next = prev.filter((product) => product.id !== item.id)
      const nextFiltered =
        category === 'all'
          ? next
          : next.filter((product) => product.categoryId === category)
      const nextTabFiltered =
        activeTab === 'all'
          ? nextFiltered
          : nextFiltered.filter((product) => product.tab === activeTab)
      const nextTotalPages = Math.max(
        1,
        Math.ceil(nextTabFiltered.length / SUPPLIER_PRODUCTS_PAGE_SIZE),
      )
      setPage((current) => Math.min(current, nextTotalPages))
      return next
    })
    setProductToDelete(null)
    setDeleting(false)
  }

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

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <DataTable
          showCard={false}
          showTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showFilters
          filterLabel={t('panel.supplierProducts.filters')}
          filters={tableFilters}
          showTable={false}
        />

        {visibleProducts.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {visibleProducts.map((item) => (
                <li key={item.id} className="flex min-w-0">
                  <ProductCard
                    type={item.cardType === 'featured' ? 'featured' : 'dashboard'}
                    role="supplier"
                    tag={item.tag}
                    status={item.status}
                    badge={item.badge}
                    product={item.product}
                    onCardClick={() => navigate(`/supplier/products/${item.id}`)}
                    onAction={(actionId) => handleCardAction(actionId, item)}
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
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-16 text-center">
            <p className="text-base font-semibold text-[var(--primary-text)]">
              {t('panel.supplierProducts.emptyTitle')}
            </p>
            <p className="mt-2 text-sm text-[var(--secondary-text)]">
              {t('panel.supplierProducts.emptyHint')}
            </p>
          </div>
        )}
      </section>

      <UploadCsvModal
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        uploadCsv={uploadProductsCsv}
        onImported={(items) => {
          setProducts((prev) => [...items, ...prev])
          setActiveTab('all')
          setPage(1)
        }}
      />

      <DeleteProductModal
        open={Boolean(productToDelete)}
        product={productToDelete}
        deleting={deleting}
        onClose={() => {
          if (!deleting) setProductToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
