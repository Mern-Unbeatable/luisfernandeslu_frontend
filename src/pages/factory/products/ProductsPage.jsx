import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft } from 'react-icons/fi'
import DataTable from '@/components/data-display/DataTable/DataTable'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails'
import AddProduct from '@/components/forms/AddProduct/AddProduct'
import Pagination from '@/components/common/Pagination/Pagination'
import {
  useCreateFactoryProductMutation,
  useGenerateFactoryProductAiMutation,
  useGetFactoryProductByIdQuery,
  useGetFactoryProductsQuery,
  useUpdateFactoryProductMutation,
  useDeleteFactoryProductMutation,
  useCancelFactoryProductMutation,
  useResubmitFactoryProductMutation,
  useDownloadFactoryProductsCsvTemplateMutation,
  useDownloadFactoryProductsCsvCategoryGuideMutation,
  useUploadFactoryProductsCsvMutation,
} from '@/features/factory-products/factoryProductApi'
import {
  buildFactoryProductFormData,
  extractAiGeneratedText,
  mapAiFormField,
} from '@/features/factory-products/factoryProductForm'
import {
  useGetCategoriesQuery,
  useGetProductTypesQuery,
  useGetSubCategoriesQuery,
} from '@/features/products/productApi'
import { DEMO_FACTORY_PRODUCT } from '@/data/demoData'
import dummyProductImage from '@/assets/images/dummy-post-square.png'
import UploadXlsxModal from './UploadXlsxModal'

const PAGE_SIZE = 12
const DUMMY_PRODUCT_IMAGE = dummyProductImage

const TAB_IDS = ['all', 'active', 'pending', 'rejected']

function extractPrice(priceText = '') {
  return priceText.match(/[€$][\d,.]+/)?.[0] || ''
}

function downloadBlobFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function toImageUrl(value) {
  if (!value) return null
  if (typeof value === 'string') return value
  if (value instanceof File || value instanceof Blob) return value
  return value.url || null
}

function toFormValue(product) {
  if (!product) return DEMO_FACTORY_PRODUCT

  const gallery = product.gallery || product.otherImages || []

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
    weight: product.weightKg ?? product.weight ?? '',
    feature: product.feature || '',
    additionalInformation:
      product.additionalInfo || product.additionalInformation || '',
    specifications: product.specifications || '',
    bannerImage:
      toImageUrl(product.bannerImage)
      || toImageUrl(product.image)
      || null,
    otherImages: gallery.map(toImageUrl).filter(Boolean),
  }
}

function mapSelectOptions(items = [], placeholder) {
  return [
    { value: '', label: placeholder },
    ...items.map((item) => ({
      value: item.id,
      label: item.name,
    })),
  ]
}

function pickNestedItems(response, keys) {
  if (!response) return []
  for (const key of keys) {
    if (Array.isArray(response[key])) return response[key]
  }
  return []
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

export default function ProductsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [formMode, setFormMode] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formValue, setFormValue] = useState(DEMO_FACTORY_PRODUCT)
  const [formError, setFormError] = useState('')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [productToCancel, setProductToCancel] = useState(null)

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
  const [createFactoryProduct, { isLoading: isCreating }] =
    useCreateFactoryProductMutation()
  const [updateFactoryProduct, { isLoading: isUpdating }] =
    useUpdateFactoryProductMutation()
  const [deleteFactoryProduct, { isLoading: isDeleting }] =
    useDeleteFactoryProductMutation()
  const [cancelFactoryProduct, { isLoading: isCancelling }] =
    useCancelFactoryProductMutation()
  const [resubmitFactoryProduct, { isLoading: isResubmitting }] =
    useResubmitFactoryProductMutation()
  const [generateFactoryProductAi] = useGenerateFactoryProductAiMutation()
  const [downloadCsvTemplate, { isLoading: isDownloadingTemplate }] =
    useDownloadFactoryProductsCsvTemplateMutation()
  const [downloadCsvCategoryGuide, { isLoading: isDownloadingGuide }] =
    useDownloadFactoryProductsCsvCategoryGuideMutation()
  const [uploadFactoryProductsCsv, { isLoading: isUploadingCsv }] =
    useUploadFactoryProductsCsvMutation()

  const editingProductId =
    (formMode === 'edit' || formMode === 'resubmit') && editingProduct?.id ? editingProduct.id : null

  const { data: editingProductResponse } = useGetFactoryProductByIdQuery(
    editingProductId,
    { skip: !editingProductId },
  )

  const { data: subCategoriesResponse } = useGetSubCategoriesQuery(
    formValue.categoryId,
    { skip: !formMode || !formValue.categoryId },
  )

  const { data: productTypesResponse } = useGetProductTypesQuery(
    formValue.subCategoryId,
    { skip: !formMode || !formValue.subCategoryId },
  )

  useEffect(() => {
    if ((formMode === 'edit' || formMode === 'resubmit') && editingProductResponse?.product) {
      setFormValue(toFormValue(editingProductResponse.product))
    }
  }, [formMode, editingProductResponse])

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

  const formCategoryOptions = useMemo(
    () =>
      mapSelectOptions(
        categoriesResponse?.categories,
        t('factoryProducts.form.selectCategory', { defaultValue: 'Select category' }),
      ),
    [categoriesResponse, t],
  )

  const formSubCategoryOptions = useMemo(
    () =>
      mapSelectOptions(
        pickNestedItems(subCategoriesResponse, [
          'subcategories',
          'subCategories',
          'data',
        ]),
        t('factoryProducts.form.selectSubCategory', {
          defaultValue: 'Select sub category',
        }),
      ),
    [subCategoriesResponse, t],
  )

  const formProductTypeOptions = useMemo(
    () =>
      mapSelectOptions(
        pickNestedItems(productTypesResponse, [
          'productTypes',
          'product-types',
          'data',
        ]),
        t('factoryProducts.form.selectProductType', {
          defaultValue: 'Select product type',
        }),
      ),
    [productTypesResponse, t],
  )

  const apiProducts = useMemo(
    () => factoryProductsResponse?.products?.map(toProductCardItem) ?? [],
    [factoryProductsResponse],
  )

  const products = apiProducts

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
    setFormValue(DEMO_FACTORY_PRODUCT)
    setFormError('')
  }

  const openAddForm = () => {
    setEditingProduct(null)
    setFormValue(DEMO_FACTORY_PRODUCT)
    setFormError('')
    setFormMode('add')
  }

  const handleConfirmDelete = async (product) => {
    const factoryProductId = product?.id
    if (!factoryProductId || isDeleting) return

    setFormError('')
    try {
      await deleteFactoryProduct(factoryProductId).unwrap()
      setProductToDelete(null)
    } catch (err) {
      setFormError(
        err?.data?.message
        || err?.data?.error
        || t('factoryProducts.deleteError', {
          defaultValue: 'Failed to delete product.',
        }),
      )
    }
  }

  const handleConfirmCancel = async (product) => {
    if (!product?.id || isCancelling) return
    try {
      await cancelFactoryProduct(product.id).unwrap()
      setProductToCancel(null)
      setFormError('')
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to cancel submission.')
    }
  }

  const handleSubmit = async (payload) => {
    setFormError('')

    try {
      const formData = buildFactoryProductFormData(payload, {
        isEdit: formMode === 'edit' || formMode === 'resubmit',
      })

      if (formMode === 'resubmit' && editingProduct?.id) {
        await resubmitFactoryProduct({
          id: editingProduct.id,
          formData,
        }).unwrap()
      } else if (formMode === 'edit' && editingProduct?.id) {
        await updateFactoryProduct({
          id: editingProduct.id,
          formData,
        }).unwrap()
      } else {
        await createFactoryProduct(formData).unwrap()
      }

      closeForm()
    } catch (error) {
      setFormError(
        error?.data?.message
        || t('factoryProducts.form.submitError', {
          defaultValue: 'Failed to save product. Please try again.',
        }),
      )
    }
  }

  const handleAiAssist = async (section, form) => {
    if (!form.title?.trim()) {
      setFormError(
        t('factoryProducts.form.titleRequired', {
          defaultValue: 'Enter a product title before using AI.',
        }),
      )
      return ''
    }

    setFormError('')

    try {
      const response = await generateFactoryProductAi({
        title: form.title.trim(),
        field: mapAiFormField(section),
      }).unwrap()

      return extractAiGeneratedText(response, section)
    } catch (error) {
      setFormError(
        error?.data?.message
        || t('factoryProducts.form.aiError', {
          defaultValue: 'Failed to generate content. Please try again.',
        }),
      )
      return ''
    }
  }

  const handleCardAction = (actionId, product) => {
    if (actionId === 'edit') {
      setFormValue(toFormValue(product))
      setFormError('')
      setEditingProduct(product)
      setFormMode('edit')
      return
    }
    if (actionId === 'resubmit') {
      setFormValue(toFormValue(product))
      setFormError('')
      setEditingProduct(product)
      setFormMode('resubmit')
      return
    }
    if (actionId === 'delete') {
      setFormError('')
      setProductToDelete({
        id: product.id,
        title: product.title,
      })
      return
    }
    if (actionId === 'cancel') {
      setFormError('')
      setProductToCancel(product)
      return
    }
  }

  const handleDownloadCsvTemplate = async () => {
    try {
      const blob = await downloadCsvTemplate().unwrap()
      downloadBlobFile(blob, 'factory-products-template.csv')
    } catch (err) {
      setFormError(
        err?.data?.message
        || t('factoryProducts.uploadModal.downloadFailed', {
          defaultValue: 'Failed to download CSV template.',
        }),
      )
    }
  }

  const handleDownloadCsvCategoryGuide = async () => {
    try {
      const blob = await downloadCsvCategoryGuide().unwrap()
      downloadBlobFile(blob, 'factory-products-category-guide.csv')
    } catch (err) {
      setFormError(
        err?.data?.message
        || t('factoryProducts.uploadModal.downloadGuideFailed', {
          defaultValue: 'Failed to download category guide.',
        }),
      )
    }
  }

  const handleCsvUpload = async (file) => {
    await uploadFactoryProductsCsv(file).unwrap()
    setUploadOpen(false)
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
    const isEdit = formMode === 'edit' || formMode === 'resubmit'
    const isResubmitMode = formMode === 'resubmit'

    return (
      <div className="space-y-4">
        {formError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </p>
        ) : null}

        <AddProduct
          key={isEdit ? `edit-${editingProduct?.id}` : 'add'}
          role="factory"
          value={formValue}
          onChange={setFormValue}
          categoryOptions={formCategoryOptions}
          subCategoryOptions={formSubCategoryOptions}
          productTypeOptions={formProductTypeOptions}
          title={
            isResubmitMode
              ? t('factoryProducts.form.resubmitTitle', { defaultValue: 'Resubmit Product' })
              : isEdit
              ? t('factoryProducts.form.editTitle')
              : t('factoryProducts.form.addTitle')
          }
          breadcrumb={
            isResubmitMode
              ? t('factoryProducts.form.resubmitBreadcrumb', { defaultValue: 'Product > Resubmit Product' })
              : isEdit
              ? t('factoryProducts.form.editBreadcrumb')
              : t('factoryProducts.form.addBreadcrumb')
          }
          submitLabel={
            isResubmitMode
              ? t('factoryProducts.form.resubmitSubmit', { defaultValue: 'Resubmit' })
              : isEdit
              ? t('factoryProducts.form.update')
              : t('factoryProducts.form.submit')
          }
          submitting={isCreating || isUpdating || isResubmitting}
          onBack={closeForm}
          onSubmit={handleSubmit}
          onAiAssist={handleAiAssist}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {formError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      ) : null}
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
            onClick={openAddForm}
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
        onDownloadExample={handleDownloadCsvTemplate}
        onDownloadCategoryGuide={handleDownloadCsvCategoryGuide}
        onQueueImport={handleCsvUpload}
        uploading={isUploadingCsv}
        downloadingTemplate={isDownloadingTemplate}
        downloadingGuide={isDownloadingGuide}
      />

      <ConfirmModal
        open={Boolean(productToDelete)}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title || ''}"? This action cannot be undone.`}
        error={formError}
        confirmText="Delete"
        confirmVariant="danger"
        loading={isDeleting}
        onClose={() => {
          setProductToDelete(null)
          setFormError('')
        }}
        onConfirm={() => handleConfirmDelete(productToDelete)}
      />

      <ConfirmModal
        open={Boolean(productToCancel)}
        title="Cancel Submission"
        message={`Are you sure you want to cancel the submission for "${productToCancel?.title || ''}"?`}
        error={formError}
        confirmText="Cancel Submission"
        confirmVariant="primary"
        loading={isCancelling}
        onClose={() => {
          setProductToCancel(null)
          setFormError('')
        }}
        onConfirm={() => handleConfirmCancel(productToCancel)}
      />
    </div>
  )
}

function ConfirmModal({
  open,
  title,
  message,
  error = '',
  confirmText,
  confirmVariant = 'danger',
  loading = false,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape' && !loading) onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, loading])

  if (!open) return null

  const btnClass =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-[var(--active)] hover:brightness-95 text-white'

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/45"
        onClick={() => {
          if (!loading) onClose?.()
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {title}
          </h2>
          <p className="mt-2 text-sm text-[var(--secondary-text)]">
            {message}
          </p>
          {error ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[var(--primary-text)] transition hover:bg-gray-50 disabled:opacity-50"
          >
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${btnClass}`}
          >
            {loading ? '...' : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
