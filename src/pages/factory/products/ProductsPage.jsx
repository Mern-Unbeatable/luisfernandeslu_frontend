import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft } from 'react-icons/fi'
import DataTable from '@/components/data-display/DataTable/DataTable'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails'
import AddProduct from '@/components/forms/AddProduct/AddProduct'
import Pagination from '@/components/common/Pagination/Pagination'
import {
  useGetFactoryProductByIdQuery,
  useGetFactoryProductsQuery,
} from '@/features/factory-products/factoryProductApi'
import { useGetCategoriesQuery } from '@/features/products/productApi'
import { DEMO_FACTORY_PRODUCT } from '@/data/demoData'
import { PRODUCT_CATEGORIES } from '@/data/productCategories'
import dummyProductImage from '@/assets/images/dummy-post-square.png'
import UploadXlsxModal from './UploadXlsxModal'

const PAGE_SIZE = 12
const DUMMY_PRODUCT_IMAGE = dummyProductImage

const TAB_IDS = ['all', 'active', 'pending', 'rejected']

const CSV_HEADERS = [
  'id',
  'title',
  'description',
  'price',
  'status',
  'categoryId',
  'sku',
  'warehouseLocation',
  'image',
]

function extractPrice(priceText = '') {
  return priceText.match(/[€$][\d,.]+/)?.[0] || ''
}

function escapeCsv(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function downloadProductsCsv(products) {
  const rows = products.map((product) => [
    product.id,
    product.title,
    product.description,
    extractPrice(product.priceText),
    product.status,
    product.categoryId || '',
    product.sku || '',
    product.warehouseLocation || '',
    product.image || '',
  ])

  const csv = [CSV_HEADERS, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'factory-products.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function toFormValue(product) {
  if (!product) return DEMO_FACTORY_PRODUCT

  return {
    ...DEMO_FACTORY_PRODUCT,
    categoryId: product.category?.id || product.categoryId || '',
    subCategoryId: product.subCategory?.id || product.subCategoryId || '',
    productTypeId: product.productType?.id || product.productTypeId || '',
    title: product.title || '',
    description: product.description || '',
    basePrice: product.basePrice ?? extractPrice(product.priceText) ?? '',
    sku: product.sku || '',
    warehouseLocation: product.warehouseLocation || '',
    feature: product.feature || '',
    additionalInformation:
      product.additionalInfo || product.additionalInformation || '',
    specifications: product.specifications || '',
    bannerImage: product.bannerImage?.url || product.image || null,
    otherImages: product.gallery || product.otherImages || [],
  }
}

/** ProductCard expects `image` and `priceText`; pass API values as-is. */
function toProductCardItem(product) {
  return {
    ...product,
    image: product.bannerImage?.url || DUMMY_PRODUCT_IMAGE,
    priceText: product.priceLabel,
    status: product.cardStatus || product.status,
  }
}

/** ProductDetails prop names only — no content changes. */
function toProductDetailItem(product) {
  const images = [
    product.bannerImage?.url,
    ...(product.gallery?.map((item) => item.url) || []),
  ].filter(Boolean)

  return {
    ...product,
    category: product.category?.name,
    priceText: product.priceLabel,
    warehouse: product.warehouseLocation,
    images: images.length ? images : [DUMMY_PRODUCT_IMAGE],
    image: product.bannerImage?.url || DUMMY_PRODUCT_IMAGE,
    additionalText: product.additionalInfo,
    specificationText: product.specifications,
    rating: product.averageRating,
    feedbackCount: product.reviewCount,
  }
}

function toCardProduct(payload, previous = {}, t) {
  const price = payload.basePrice
    ? t('factoryProducts.priceText', { price: payload.basePrice })
    : previous.priceText || t('factoryProducts.priceFallback')

  const image =
    typeof payload.bannerImage === 'string'
      ? payload.bannerImage
      : previous.image || DUMMY_PRODUCT_IMAGE

  const categoryId = payload.categoryId || previous.categoryId || ''
  const categoryName =
    PRODUCT_CATEGORIES.find((item) => item.id === categoryId)?.name ||
    previous.categoryName ||
    ''

  return {
    ...previous,
    title: payload.title || previous.title || t('factoryProducts.untitled'),
    description: payload.description || '',
    priceText: price,
    image,
    categoryId,
    categoryName,
    subCategoryId: payload.subCategoryId || previous.subCategoryId || '',
    productTypeId: payload.productTypeId || previous.productTypeId || '',
    sku: payload.sku || previous.sku || '',
    warehouseLocation:
      payload.warehouseLocation || previous.warehouseLocation || '',
    feature: payload.feature || '',
    additionalInformation: payload.additionalInformation || '',
    specifications: payload.specifications || '',
  }
}

export default function ProductsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [localProducts, setLocalProducts] = useState(null)
  const [formMode, setFormMode] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  const queryParams = useMemo(
    () => ({
      tab: activeTab,
      page,
      limit: PAGE_SIZE,
      ...(category !== 'all' ? { categoryId: category } : {}),
      ...(search.trim() ? { search: search.trim() } : {}),
    }),
    [activeTab, page, category, search],
  )

  const { data: factoryProductsResponse } = useGetFactoryProductsQuery(queryParams)
  const { data: categoriesResponse } = useGetCategoriesQuery()

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: t('factoryProducts.allCategories') },
      ...(categoriesResponse?.categories ?? []).map((item) => ({
        value: item.id,
        label: item.name,
      })),
    ],
    [categoriesResponse, t],
  )

  const apiProducts = useMemo(
    () => factoryProductsResponse?.products?.map(toProductCardItem) ?? [],
    [factoryProductsResponse],
  )

  const products = localProducts ?? apiProducts

  useEffect(() => {
    setLocalProducts(null)
  }, [factoryProductsResponse])

  const {
    data: factoryProductDetailResponse,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetFactoryProductByIdQuery(selectedProductId, {
    skip: !selectedProductId,
  })

  const counts = factoryProductsResponse?.counts || {
    all: 0,
    active: 0,
    pending: 0,
    rejected: 0,
  }

  const totalPages = Math.max(1, factoryProductsResponse?.pagination?.totalPages || 1)
  const safePage = Math.min(page, totalPages)
  const visibleProducts = products

  const tabs = TAB_IDS.map((tabId) => ({
    id: tabId,
    label: `${t(`factoryProducts.tabs.${tabId}`)} (${counts[tabId] ?? 0})`,
  }))

  const tableFilters = [
    {
      id: 'category',
      value: category,
      onChange: (value) => {
        setCategory(value)
        setPage(1)
      },
      options: categoryOptions,
      placeholder: t('factoryProducts.allCategories'),
    },
  ]

  const closeForm = () => {
    setFormMode(null)
    setEditingProduct(null)
  }

  const handleSubmit = (payload) => {
    const baseProducts = localProducts ?? apiProducts

    if (formMode === 'edit' && editingProduct) {
      setLocalProducts(
        baseProducts.map((item) =>
          item.id === editingProduct.id
            ? toCardProduct(payload, item, t)
            : item,
        ),
      )
    } else {
      setLocalProducts([
        ...baseProducts,
        {
          id: Date.now(),
          status: 'pending',
          ...toCardProduct(payload, {}, t),
        },
      ])
    }
    closeForm()
  }

  const handleCardAction = (actionId, product) => {
    if (actionId !== 'edit') return
    setEditingProduct(product)
    setFormMode('edit')
  }

  if (selectedProductId) {
    const detailProduct = factoryProductDetailResponse?.product
      ? toProductDetailItem(factoryProductDetailResponse.product)
      : null

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedProductId(null)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[var(--primary-text)] transition hover:bg-gray-50"
          >
            <FiArrowLeft className="size-4" />
            {t('factoryProducts.backToProducts')}
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm text-[var(--secondary-text)]">
              {t('factoryProducts.title')} / {detailProduct?.title || '…'}
            </p>
          </div>
        </div>

        {isDetailLoading ? (
          <p className="text-sm text-[var(--secondary-text)]">
            {t('common.loading', { defaultValue: 'Loading…' })}
          </p>
        ) : isDetailError || !detailProduct ? (
          <p className="text-sm text-red-600">
            {t('common.error', { defaultValue: 'Failed to load product details.' })}
          </p>
        ) : (
          <ProductDetails role="supplier" product={detailProduct} />
        )}
      </div>
    )
  }

  if (formMode) {
    const isEdit = formMode === 'edit'

    return (
      <AddProduct
        key={isEdit ? `edit-${editingProduct?.id}` : 'add'}
        role="factory"
        defaultValue={
          isEdit ? toFormValue(editingProduct) : DEMO_FACTORY_PRODUCT
        }
        title={
          isEdit
            ? t('factoryProducts.form.editTitle')
            : t('factoryProducts.form.addTitle')
        }
        breadcrumb={
          isEdit
            ? t('factoryProducts.form.editBreadcrumb')
            : t('factoryProducts.form.addBreadcrumb')
        }
        submitLabel={
          isEdit
            ? t('factoryProducts.form.update')
            : t('factoryProducts.form.submit')
        }
        onBack={closeForm}
        onSubmit={handleSubmit}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t('factoryProducts.title')}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t('factoryProducts.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null)
              setFormMode('add')
            }}
            className="rounded-full bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
          >
            {t('factoryProducts.addProduct')}
          </button>
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="rounded-full border border-[var(--active)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--active)] transition hover:bg-[#FFFBF5]"
          >
            {t('factoryProducts.uploadCsv')}
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <DataTable
          showCard={false}
          showTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId)
            setPage(1)
          }}
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          searchPlaceholder={t('factoryProducts.searchPlaceholder')}
          showFilters
          filterLabel={t('factoryProducts.filters')}
          filters={tableFilters}
          showTable={false}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                if (e.target.closest('button, a, [role="button"]') && e.target.closest('button, a, [role="button"]') !== e.currentTarget) return
                setSelectedProductId(product.id)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedProductId(product.id)
              }}
              className="cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-[var(--active)]"
            >
              <ProductCard
                type="dashboard"
                role="factory"
                status={product.status}
                product={product}
                onAction={handleCardAction}
              />
            </div>
          ))}
        </div>

        <Pagination
          className="mt-8 sm:mt-10"
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>

      <UploadXlsxModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onDownloadExample={() => downloadProductsCsv(products.slice(0, 5))}
        onQueueImport={() => setUploadOpen(false)}
      />
    </div>
  )
}
