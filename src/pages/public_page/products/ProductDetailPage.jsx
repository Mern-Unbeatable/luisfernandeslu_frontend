import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails'
import ProductDetailPageSkeleton from './components/ProductDetailPageSkeleton'
import { resolveDetailsView } from '@/components/data-display/ProductDetails/resolveDetailsView'
import Seo from '@/components/common/Seo/Seo'
import NotFoundPage from '../NotFoundPage'
import SendQuoteModal from './components/SendQuoteModal'
import { useGetMarketplaceProductBySlugQuery } from '@/features/marketplace/marketplaceApi'
import { resolveStorefrontBuyerRole } from '@/features/auth/resolveStorefrontBuyerRole'

function resolveDetailRole(viewer, user) {
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

function filterDetailActions(role, apiActions) {
  const view = resolveDetailsView(role)
  if (!apiActions) return view.actions

  return view.actions.filter((action) => {
    if (action.id === 'add_to_cart') return apiActions.addToCart !== false
    if (action.id === 'buy_now') return apiActions.buyNow !== false
    if (action.id === 'send_quote') return apiActions.sendQuote === true
    return true
  })
}

export default function ProductDetailPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const authRole = resolveStorefrontBuyerRole(user)
  const pricingView = authRole === 'company' ? 'company' : 'retail'

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMarketplaceProductBySlugQuery(
    { slug, pricingView },
    { skip: !slug },
  )

  const product = data?.product
  const listingRole = useMemo(
    () => resolveDetailRole(data?.viewer, user),
    [data?.viewer, user],
  )
  const actions = useMemo(
    () => filterDetailActions(listingRole, product?.actions),
    [listingRole, product?.actions],
  )

  const handleAction = (actionId) => {
    if (actionId === 'send_quote') setQuoteOpen(true)
    if (actionId === 'buy_now') {
      navigate(listingRole === 'company' ? '/checkout/company' : '/checkout')
    }
    if (actionId === 'add_to_cart') {
      navigate('/cart')
    }
  }

  if (!slug) {
    return <NotFoundPage />
  }

  if (isLoading && !product) {
    return <ProductDetailPageSkeleton />
  }

  if (isError) {
    const notFound = error?.status === 404
    if (notFound) return <NotFoundPage />

    return (
      <div className="w-full bg-white py-6 sm:py-8 lg:py-10">
        <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
            <p className="text-sm text-red-700">
              {error?.data?.message || 'Could not load product details.'}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return <NotFoundPage />
  }

  return (
    <div className="w-full bg-white py-6 sm:py-8 lg:py-10">
      <Seo
        title={product.title}
        description={product.descriptionParagraphs?.[0]}
      />
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <ProductDetails
          role={listingRole}
          product={product}
          quantity={product.defaultQuantity ?? 1}
          actions={actions}
          onAction={handleAction}
        />
      </div>

      <SendQuoteModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        product={product}
      />
    </div>
  )
}
