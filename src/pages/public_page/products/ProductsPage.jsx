import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StorefrontProductListingCell from '../components/StorefrontProductListingCell'
import ProductsPageSkeleton from './components/ProductsPageSkeleton'
import Pagination from '@/components/common/Pagination/Pagination'
import { resolveStorefrontBuyerRole } from '@/features/auth/resolveStorefrontBuyerRole'
import {
  MARKETPLACE_PRODUCTS_PAGE_SIZE,
  useGetMarketplaceProductsQuery,
} from '@/features/marketplace/marketplaceApi'
import {
  findCatalogTaxonomy,
  findCategorySlugForSubcategory,
  mapSlugToId,
  pickProductTypes,
  pickSubcategories,
} from '@/features/marketplace/catalogFilter'
import {
  useGetCategoriesQuery,
  useGetProductTypesQuery,
  useGetSubCategoriesQuery,
} from '@/features/products/productApi'
import ProductsSidebar from './components/ProductsSidebar'
import { PRODUCT_CATEGORIES } from '@/data/productCategories'
import useCartAction from '@/hooks/useCartAction'

function resolveListingRole(viewer, user) {
  if (
    viewer?.isCompany
    || viewer?.role === 'company'
    || viewer?.pricingView === 'company'
  ) {
    return 'company'
  }
  if (viewer?.role === 'customer' || viewer?.role === 'guest') {
    return 'customer'
  }
  return resolveStorefrontBuyerRole(user)
}

export default function ProductsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const user = useSelector((state) => state.auth.user)
  const authRole = resolveStorefrontBuyerRole(user)
  const { handleAddToCart } = useCartAction()

  const handleListingAction = useCallback(
    async (actionId, product) => {
      if (actionId === 'add_to_cart') {
        return handleAddToCart(product?.id, product?.defaultQuantity ?? 1)
      }
      if (actionId === 'view_details' && product?.slug) {
        navigate(`/products/${product.slug}`)
      }
    },
    [navigate, handleAddToCart],
  )

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500)
  const [priceBracketId, setPriceBracketId] = useState(null)
  const [categoryIds, setCategoryIds] = useState(() => new Set())
  const [typeIds, setTypeIds] = useState(() => new Set())
  const [expandedSubcategoryIds, setExpandedSubcategoryIds] = useState(
    () => new Set(),
  )
  const [activeCategoryId, setActiveCategoryId] = useState(
    PRODUCT_CATEGORIES[0]?.id ?? '',
  )

  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const search = searchParams.get('search')?.trim() || ''
  const urlCategorySlug = searchParams.get('category')?.trim() || ''
  const urlSubSlug = searchParams.get('sub')?.trim() || ''
  const urlTypeSlug = searchParams.get('type')?.trim() || ''

  const { data: categoriesPayload, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery()
  const categorySlugToId = useMemo(
    () => mapSlugToId(categoriesPayload?.categories ?? []),
    [categoriesPayload],
  )

  const selectedTypeSlug = useMemo(() => {
    if (typeIds.size === 1) return [...typeIds][0]
    if (typeIds.size > 1) return [...typeIds][0]
    return urlTypeSlug || null
  }, [typeIds, urlTypeSlug])

  const selectedSubSlug = useMemo(() => {
    if (urlSubSlug) return urlSubSlug
    if (selectedTypeSlug) {
      return findCatalogTaxonomy({ typeSlug: selectedTypeSlug })?.subSlug ?? null
    }
    return null
  }, [urlSubSlug, selectedTypeSlug])

  const rootCategorySlug = useMemo(() => {
    if (categoryIds.size > 0) {
      return categoryIds.has(activeCategoryId)
        ? activeCategoryId
        : [...categoryIds][0]
    }
    if (urlCategorySlug) return urlCategorySlug
    if (selectedSubSlug) return findCategorySlugForSubcategory(selectedSubSlug)
    if (selectedTypeSlug) {
      return findCatalogTaxonomy({ typeSlug: selectedTypeSlug })?.categorySlug
        ?? null
    }
    return null
  }, [
    categoryIds,
    activeCategoryId,
    urlCategorySlug,
    selectedSubSlug,
    selectedTypeSlug,
  ])

  const rootCategoryUuid = rootCategorySlug
    ? categorySlugToId[rootCategorySlug]
    : null

  const { data: subcategoriesPayload, isFetching: isSubcategoriesFetching } =
    useGetSubCategoriesQuery(rootCategoryUuid, {
      skip: !rootCategoryUuid,
    })
  const subSlugToId = useMemo(
    () => mapSlugToId(pickSubcategories(subcategoriesPayload)),
    [subcategoriesPayload],
  )

  const subCategoryUuid = selectedSubSlug
    ? subSlugToId[selectedSubSlug]
    : null

  const { data: productTypesPayload, isFetching: isProductTypesFetching } =
    useGetProductTypesQuery(subCategoryUuid, {
      skip: !subCategoryUuid || !selectedTypeSlug,
    })
  const typeSlugToId = useMemo(
    () => mapSlugToId(pickProductTypes(productTypesPayload)),
    [productTypesPayload],
  )

  const apiCategoryId = useMemo(() => {
    if (selectedTypeSlug && typeSlugToId[selectedTypeSlug]) {
      return typeSlugToId[selectedTypeSlug]
    }
    if (selectedSubSlug && subSlugToId[selectedSubSlug]) {
      return subSlugToId[selectedSubSlug]
    }
    if (rootCategorySlug && categorySlugToId[rootCategorySlug]) {
      return categorySlugToId[rootCategorySlug]
    }
    return undefined
  }, [
    selectedTypeSlug,
    typeSlugToId,
    selectedSubSlug,
    subSlugToId,
    rootCategorySlug,
    categorySlugToId,
  ])

  const categoryFilterActive = Boolean(
    categoryIds.size > 0
    || urlCategorySlug
    || selectedSubSlug
    || selectedTypeSlug,
  )
  const isResolvingCategoryFilter =
    categoryFilterActive
    && !apiCategoryId
    && (
      isCategoriesLoading
      || (rootCategorySlug && !rootCategoryUuid)
      || (rootCategoryUuid && selectedSubSlug && isSubcategoriesFetching)
      || (subCategoryUuid && selectedTypeSlug && isProductTypesFetching)
    )

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetMarketplaceProductsQuery(
    {
      page,
      limit: MARKETPLACE_PRODUCTS_PAGE_SIZE,
      categoryId: apiCategoryId,
      search: search || undefined,
      minPrice,
      maxPrice,
      pricingView: authRole === 'company' ? 'company' : 'retail',
    },
    { skip: isResolvingCategoryFilter },
  )

  const products = data?.products ?? []
  const pagination = data?.pagination
  const listingRole = useMemo(
    () => resolveListingRole(data?.viewer, user),
    [data?.viewer, user],
  )
  const isCompanyView = listingRole === 'company'
  const totalResults = pagination?.total ?? 0
  const totalPages = Math.max(1, pagination?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    const categoryId = searchParams.get('category')
    const subId = searchParams.get('sub')
    const typeId = searchParams.get('type')

    if (categoryId) {
      setCategoryIds(new Set([categoryId]))
      setActiveCategoryId(categoryId)
    }
    if (typeId) {
      setTypeIds(new Set([typeId]))
    }
    if (subId) {
      setExpandedSubcategoryIds((prev) => new Set(prev).add(subId))
    } else if (categoryId === 'cement-mortar-concrete') {
      setExpandedSubcategoryIds((prev) => new Set(prev).add('cements'))
    }
  }, [searchParams])

  useEffect(() => {
    if (page > totalPages) {
      const params = new URLSearchParams(searchParams)
      if (totalPages <= 1) params.delete('page')
      else params.set('page', String(totalPages))
      setSearchParams(params, { replace: true })
    }
  }, [page, totalPages, searchParams, setSearchParams])

  const setPage = useCallback(
    (nextPage) => {
      const params = new URLSearchParams(searchParams)
      if (nextPage <= 1) params.delete('page')
      else params.set('page', String(nextPage))
      setSearchParams(params, { replace: true })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [searchParams, setSearchParams],
  )

  const resetPageParam = useCallback(() => {
    if (!searchParams.get('page')) return
    const params = new URLSearchParams(searchParams)
    params.delete('page')
    setSearchParams(params, { replace: true })
  }, [searchParams, setSearchParams])

  const toggleCategory = (categoryId) => {
    setCategoryIds((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
    setActiveCategoryId(categoryId)
    setTypeIds(new Set())
    resetPageParam()
  }

  const toggleType = (typeId) => {
    const willCheck = !typeIds.has(typeId)
    setTypeIds((prev) => {
      const next = new Set(prev)
      if (next.has(typeId)) next.delete(typeId)
      else next.add(typeId)
      return next
    })
    if (willCheck) {
      const path = findCatalogTaxonomy({ typeSlug: typeId })
      if (path?.categorySlug) {
        setCategoryIds(new Set([path.categorySlug]))
        setActiveCategoryId(path.categorySlug)
        if (path.subSlug) {
          setExpandedSubcategoryIds((prev) => new Set(prev).add(path.subSlug))
        }
      }
    }
    resetPageParam()
  }

  const toggleSubcategory = (subcategoryId) => {
    setExpandedSubcategoryIds((prev) => {
      const next = new Set(prev)
      if (next.has(subcategoryId)) next.delete(subcategoryId)
      else next.add(subcategoryId)
      return next
    })
  }

  const activateCategory = (categoryId) => {
    setActiveCategoryId(categoryId)
    const category = PRODUCT_CATEGORIES.find((item) => item.id === categoryId)
    const firstSub = category?.subcategories[0]?.id
    setExpandedSubcategoryIds(firstSub ? new Set([firstSub]) : new Set())
  }

  const clearFilters = useCallback(() => {
    setMinPrice(0)
    setMaxPrice(500)
    setPriceBracketId(null)
    setCategoryIds(new Set())
    setTypeIds(new Set())
    setActiveCategoryId(PRODUCT_CATEGORIES[0]?.id ?? '')
    setExpandedSubcategoryIds(new Set())
    resetPageParam()
  }, [resetPageParam])

  if ((isLoading && !data) || isResolvingCategoryFilter) {
    return <ProductsPageSkeleton />
  }

  return (
    <div className="w-full bg-white py-6 sm:py-8 lg:py-10">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          <ProductsSidebar
            className="lg:sticky lg:top-48 lg:self-start"
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={(value) => {
              setMinPrice(value)
              resetPageParam()
            }}
            onMaxPriceChange={(value) => {
              setMaxPrice(value)
              resetPageParam()
            }}
            priceBracketId={priceBracketId}
            onPriceBracketChange={setPriceBracketId}
            categoryIds={categoryIds}
            typeIds={typeIds}
            onToggleCategory={toggleCategory}
            onToggleType={toggleType}
            expandedSubcategoryIds={expandedSubcategoryIds}
            onToggleSubcategory={toggleSubcategory}
            activeCategoryId={activeCategoryId}
            onActivateCategory={activateCategory}
            resultCount={totalResults}
            onClearFilters={clearFilters}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-4 hidden items-center justify-between gap-3 lg:mb-6 lg:flex">
              <p className="text-sm text-[var(--secondary-text)]">
                {t('productsPage.resultsCount', { count: totalResults })}
              </p>
              {isCompanyView ? (
                <p className="text-xs font-medium text-[var(--active)] sm:text-sm">
                  {t('productsPage.companyPricing', {
                    defaultValue: 'Company pricing shown',
                  })}
                </p>
              ) : null}
            </div>

            {isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
                <p className="text-sm text-red-700">
                  {error?.data?.message
                    || t('productsPage.loadFailed', {
                      defaultValue: 'Could not load products.',
                    })}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
                >
                  {t('productsPage.retry', { defaultValue: 'Try again' })}
                </button>
              </div>
            ) : products.length ? (
              <ul
                className={[
                  'grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6',
                  isFetching ? 'opacity-60' : '',
                ].join(' ')}
              >
                {products.map((product) => (
                  <li key={product.id} className="flex h-full min-w-0">
                    <StorefrontProductListingCell
                      product={product}
                      role={listingRole}
                      onAction={handleListingAction}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
                <p className="text-base font-semibold text-[var(--primary-text)]">
                  {t('productsPage.emptyTitle')}
                </p>
                <p className="mt-2 text-sm text-[var(--secondary-text)]">
                  {t('productsPage.emptyHint')}
                </p>
              </div>
            )}

            {!isLoading && !isError && products.length > 0 ? (
              <Pagination
                className="mt-8 sm:mt-10"
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
