import { useState } from 'react'
import { FiChevronDown, FiFilter } from 'react-icons/fi'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import AddProduct from '@/components/forms/AddProduct/AddProduct'
import { DEMO_FACTORY_PRODUCT } from '@/data/demoData'

const PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80'

const DUMMY_PRODUCTS = [
  {
    id: 1,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'active',
  },
  {
    id: 2,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'pending',
  },
  {
    id: 3,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'rejected',
  },
  {
    id: 4,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'active',
  },
  {
    id: 5,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'pending',
  },
  {
    id: 6,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'rejected',
  },
  {
    id: 7,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'active',
  },
  {
    id: 8,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'pending',
  },
  {
    id: 9,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'rejected',
  },
  {
    id: 10,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'active',
  },
  {
    id: 11,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'pending',
  },
  {
    id: 12,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'rejected',
  },
  {
    id: 13,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'active',
  },
  {
    id: 14,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'pending',
  },
  {
    id: 15,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'rejected',
  },
  {
    id: 16,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'active',
  },
  {
    id: 17,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'pending',
  },
  {
    id: 18,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'rejected',
  },
  {
    id: 19,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'active',
  },
  {
    id: 20,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'pending',
  },
  {
    id: 21,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'rejected',
  },
  {
    id: 22,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'active',
  },
  {
    id: 23,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'pending',
  },
  {
    id: 24,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'rejected',
  },
  {
    id: 25,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'active',
  },
  {
    id: 26,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'pending',
  },
  {
    id: 27,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'rejected',
  },
  {
    id: 28,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'active',
  },
  {
    id: 29,
    title: 'Portland Cement Standard',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'pending',
  },
  {
    id: 30,
    title: 'Portland Cement',
    description:
      'High-strength building cement suitable for construction and masonry work.',
    priceText: 'Price: $115 per bag (50 kg)',
    image: PRODUCT_IMAGE,
    status: 'rejected',
  },
]

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'rejected', label: 'Rejected' },
]

const CSV_HEADERS = [
  'id',
  'title',
  'description',
  'price',
  'status',
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

function toCardProduct(payload, previous = {}) {
  const price = payload.basePrice
    ? `Price: ${payload.basePrice} per bag (50 kg)`
    : previous.priceText || 'Price: —'

  const image =
    typeof payload.bannerImage === 'string'
      ? payload.bannerImage
      : previous.image || PRODUCT_IMAGE

  return {
    ...previous,
    title: payload.title || previous.title || 'Untitled',
    description: payload.description || '',
    priceText: price,
    image,
    sku: payload.sku || previous.sku || '',
    warehouseLocation:
      payload.warehouseLocation || previous.warehouseLocation || '',
    feature: payload.feature || '',
    additionalInformation: payload.additionalInformation || '',
    specifications: payload.specifications || '',
  }
}

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [products, setProducts] = useState(DUMMY_PRODUCTS)
  const [formMode, setFormMode] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)

  const counts = {
    all: products.length,
    active: products.filter((p) => p.status === 'active').length,
    pending: products.filter((p) => p.status === 'pending').length,
    rejected: products.filter((p) => p.status === 'rejected').length,
  }

  const visibleProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.status === activeTab)

  const closeForm = () => {
    setFormMode(null)
    setEditingProduct(null)
  }

  const handleSubmit = (payload) => {
    if (formMode === 'edit' && editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? toCardProduct(payload, item)
            : item,
        ),
      )
    } else {
      setProducts((prev) => [
        ...prev,
        {
          id: Date.now(),
          status: 'pending',
          ...toCardProduct(payload),
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
        title={isEdit ? 'Edit Product' : 'Add Product'}
        breadcrumb={isEdit ? 'Product > Edit Product' : 'Product > Add Product'}
        submitLabel={isEdit ? 'Update' : 'Submit'}
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
            Product Management
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            Manage your product catalog for selling to customers.
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
            Add Product
          </button>
          <button
            type="button"
            onClick={() => downloadProductsCsv(products)}
            className="rounded-full border border-[var(--active)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--active)] transition hover:bg-[#FFFBF5]"
          >
            Upload CSV File
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[var(--active)] text-white'
                    : 'text-[var(--secondary-text)] hover:bg-gray-50'
                }`}
              >
                {tab.label} ({counts[tab.id]})
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--secondary-text)]">
          <FiFilter className="size-4 shrink-0" aria-hidden />
          <span className="font-medium">Filters:</span>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[var(--primary-text)]"
          >
            All Categories
            <FiChevronDown className="size-4 text-gray-400" aria-hidden />
          </button>
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
    </div>
  )
}
