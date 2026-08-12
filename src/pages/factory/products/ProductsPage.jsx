import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiChevronDown, FiFilter } from 'react-icons/fi'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import AddProduct from '@/components/forms/AddProduct/AddProduct'
import Pagination from '@/components/common/Pagination/Pagination'
import { DEMO_FACTORY_PRODUCT } from '@/data/demoData'
import { PRODUCT_CATEGORIES } from '@/data/productCategories'
import UploadXlsxModal from './UploadXlsxModal'

const PAGE_SIZE = 8

const PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80'

const STATUS_CYCLE = ['active', 'pending', 'rejected']
const PRICE_CYCLE = [85, 115, 150, 220, 340, 480, 65, 190]

let productSeq = 0

const DUMMY_PRODUCTS = PRODUCT_CATEGORIES.flatMap((category) =>
  (category.subcategories ?? []).flatMap((subCategory) =>
    (subCategory.productTypes ?? []).map((type) => {
      const index = productSeq
      productSeq += 1

      return {
        id: index + 1,
        title: type.name,
        description: `${type.name} from ${category.name} › ${subCategory.name}.`,
        priceText: `Price: $${PRICE_CYCLE[index % PRICE_CYCLE.length]} per unit`,
        image: type.imageSrc || PRODUCT_IMAGE,
        status: STATUS_CYCLE[index % STATUS_CYCLE.length],
        categoryId: category.id,
        categoryName: category.name,
        subCategoryId: subCategory.id,
        subCategoryName: subCategory.name,
        productTypeId: type.id,
        sku: `FAC-${String(index + 1).padStart(4, '0')}`,
      }
    }),
  ),
)

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
  return priceText.match(/\$[\d,.]+/)?.[0] || ''
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
    categoryId: product.categoryId || '',
    subCategoryId: product.subCategoryId || '',
    productTypeId: product.productTypeId || '',
    title: product.title || '',
    description: product.description || '',
    basePrice: extractPrice(product.priceText) || product.basePrice || '',
    sku: product.sku || '',
    warehouseLocation: product.warehouseLocation || '',
    feature: product.feature || '',
    additionalInformation: product.additionalInformation || '',
    specifications: product.specifications || '',
    bannerImage: product.image || null,
    otherImages: product.otherImages || [],
  }
}

function toCardProduct(payload, previous = {}, t) {
  const price = payload.basePrice
    ? t('factoryProducts.priceText', { price: payload.basePrice })
    : previous.priceText || t('factoryProducts.priceFallback')

  const image =
    typeof payload.bannerImage === 'string'
      ? payload.bannerImage
      : previous.image || PRODUCT_IMAGE

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
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState(DUMMY_PRODUCTS)
  const [formMode, setFormMode] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  const categoryProducts =
    category === 'all'
      ? products
      : products.filter((product) => product.categoryId === category)

  const counts = {
    all: categoryProducts.length,
    active: categoryProducts.filter((p) => p.status === 'active').length,
    pending: categoryProducts.filter((p) => p.status === 'pending').length,
    rejected: categoryProducts.filter((p) => p.status === 'rejected').length,
  }

  const filteredProducts =
    activeTab === 'all'
      ? categoryProducts
      : categoryProducts.filter((p) => p.status === activeTab)

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visibleProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const closeForm = () => {
    setFormMode(null)
    setEditingProduct(null)
  }

  const handleSubmit = (payload) => {
    if (formMode === 'edit' && editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? toCardProduct(payload, item, t)
            : item,
        ),
      )
    } else {
      setProducts((prev) => [
        ...prev,
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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-full min-w-0 overflow-x-auto">
          <div className="inline-flex w-max max-w-none flex-nowrap items-center gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
            {TAB_IDS.map((tabId) => {
              const isActive = activeTab === tabId
              return (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => {
                    setActiveTab(tabId)
                    setPage(1)
                  }}
                  className={`shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[var(--active)] text-white'
                      : 'text-[var(--secondary-text)] hover:bg-gray-50'
                  }`}
                >
                  {t(`factoryProducts.tabs.${tabId}`)} ({counts[tabId]})
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-sm text-[var(--secondary-text)]">
          <FiFilter className="size-4 shrink-0" aria-hidden />
          <span className="font-medium">{t('factoryProducts.filters')}</span>
          <label className="relative inline-flex min-w-0 max-w-full">
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
                setPage(1)
              }}
              aria-label={t('factoryProducts.allCategories')}
              className="h-10 max-w-[min(100%,16rem)] cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-2 pr-9 pl-3 text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
            >
              <option value="all">{t('factoryProducts.allCategories')}</option>
              {PRODUCT_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <FiChevronDown
              className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            type="dashboard"
            role="factory"
            status={product.status}
            product={product}
            onAction={handleCardAction}
          />
        ))}
      </div>

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <UploadXlsxModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onDownloadExample={() => downloadProductsCsv(products.slice(0, 5))}
        onQueueImport={() => setUploadOpen(false)}
      />
    </div>
  )
}
