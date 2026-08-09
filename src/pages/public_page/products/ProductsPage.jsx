import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import StorefrontProductListingCell from '../components/StorefrontProductListingCell'
import Pagination from '@/components/common/Pagination/Pagination'
import { resolveStorefrontBuyerRole } from '@/features/auth/resolveStorefrontBuyerRole'
import ProductsSidebar from './components/ProductsSidebar'
import {
  PRODUCTS_LIST,
  PRODUCTS_PAGE_SIZE,
  getProductsTotalPages,
} from './data/productsListing'
import { filterProducts } from './utils/filterProducts'
import { PRODUCT_CATEGORIES } from '@/data/productCategories'

export default function ProductsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const user = useSelector((state) => state.auth.user)
  const listingRole = resolveStorefrontBuyerRole(user)

  const handleListingAction = useCallback(
    (actionId, product) => {
      if (actionId === 'add_to_cart') {
        navigate('/cart')
        return
      }
      if (actionId === 'view_details' && product?.slug) {
        navigate(`/products/${product.slug}`)
      }
    },
    [navigate],
  )

  const [minPrice, setMinPrice] = useState(300)
  const [maxPrice, setMaxPrice] = useState(500)
  const [priceBracketId, setPriceBracketId] = useState('300-500')
  const [categoryIds, setCategoryIds] = useState(
    () => new Set(['cement-mortar-concrete']),
  )
  const [typeIds, setTypeIds] = useState(() => new Set())
  const [expandedSubcategoryIds, setExpandedSubcategoryIds] = useState(
    () => new Set(['cements']),
  )
  const [activeCategoryId, setActiveCategoryId] = useState(
    'cement-mortar-concrete',
  )

  const page = Math.max(1, Number(searchParams.get('page')) || 1)

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

  const filteredProducts = useMemo(
    () =>
      filterProducts(PRODUCTS_LIST, {
        minPrice,
        maxPrice,
        categoryIds,
        typeIds,
      }),
    [minPrice, maxPrice, categoryIds, typeIds],
  )

  const totalPages = getProductsTotalPages(filteredProducts.length)
  const safePage = Math.min(page, totalPages)

  const visibleProducts = useMemo(() => {
    const start = (safePage - 1) * PRODUCTS_PAGE_SIZE
    return filteredProducts.slice(start, start + PRODUCTS_PAGE_SIZE)
  }, [filteredProducts, safePage])

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
    resetPageParam()
  }

  const toggleType = (typeId) => {
    setTypeIds((prev) => {
      const next = new Set(prev)
      if (next.has(typeId)) next.delete(typeId)
      else next.add(typeId)
      return next
    })
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
    setMinPrice(300)
    setMaxPrice(500)
    setPriceBracketId('300-500')
    setCategoryIds(new Set(['cement-mortar-concrete']))
    setTypeIds(new Set())
    setActiveCategoryId('cement-mortar-concrete')
    setExpandedSubcategoryIds(new Set(['cements']))
    resetPageParam()
  }, [resetPageParam])

  return (
    <div className="w-full bg-white py-6 sm:py-8 lg:py-10">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          <ProductsSidebar
            className="lg:sticky lg:top-24 lg:self-start"
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
            resultCount={filteredProducts.length}
            onClearFilters={clearFilters}
          />

          <div className="min-w-0 flex-1">
            <p className="mb-4 hidden text-sm text-[var(--secondary-text)] lg:mb-6 lg:block">
              {t('productsPage.resultsCount', { count: filteredProducts.length })}
            </p>

            {visibleProducts.length ? (
              <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
                {visibleProducts.map((product) => (
                  <li key={product.id} className="flex min-w-0">
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

            {filteredProducts.length > 0 ? (
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
