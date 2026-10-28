import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useOpenSupplierProductChat from '@/features/marketplace/useOpenSupplierProductChat'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails'
import ProductDetailPageSkeleton from './components/ProductDetailPageSkeleton'
import { resolveDetailsView } from '@/components/data-display/ProductDetails/resolveDetailsView'
import Seo from '@/components/common/Seo/Seo'
import NotFoundPage from '../NotFoundPage'
import SendQuoteModal from './components/SendQuoteModal'
import { useGetMarketplaceProductBySlugQuery, useCreateProductQuoteMutation } from '@/features/marketplace/marketplaceApi'
import { resolveStorefrontBuyerRole } from '@/features/auth/resolveStorefrontBuyerRole'
import useCartAction from '@/hooks/useCartAction'

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
  const { t } = useTranslation()
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const { openSupplierProductChat, isOpeningChat } = useOpenSupplierProductChat()
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  const authRole = resolveStorefrontBuyerRole(user)
  const pricingView = authRole === 'company' ? 'company' : 'retail'
  const { handleAddToCart } = useCartAction()
  const [createProductQuote] = useCreateProductQuoteMutation()

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
  const isSupplierViewer = user?.role === 'supplier'
  const actions = useMemo(() => {
    if (isSupplierViewer) {
      return product?.actions?.sendQuote
        ? [{ id: 'send_message', label: t('panel.supplierBuyFromFactory.sendMessage'), variant: 'primary' }]
        : []
    }
    return filterDetailActions(listingRole, product?.actions)
  }, [isSupplierViewer, listingRole, product?.actions, t])

  const [loadingAction, setLoadingAction] = useState(null)

  const handleAction = async (actionId) => {
    if (actionId === 'send_quote') setQuoteOpen(true)
    if (actionId === 'send_message' && !isOpeningChat) {
      await openSupplierProductChat(product.id)
    }
    if (actionId === 'buy_now') {
      if (!isAuthenticated) {
        Swal.fire({
          title: t('ui.loginRequired'),
          text: t('ui.loginToCheckout'),
          icon: 'info',
          showCloseButton: true,
          showCancelButton: false,
          showDenyButton: true,
          confirmButtonText: t('ui.loginAsCustomer'),
          denyButtonText: t('ui.loginAsCompany'),
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-2xl pb-6',
            title: 'text-xl font-bold text-[var(--primary-text)]',
            htmlContainer: 'text-sm text-[var(--secondary-text)] mt-2 mb-6',
            actions: 'flex w-full justify-center gap-3 px-6',
            confirmButton: 'flex-1 whitespace-nowrap rounded-lg border-2 border-[var(--active)] bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--active)] transition-colors hover:bg-[color-mix(in_srgb,var(--active)_8%,transparent)]',
            denyButton: 'flex-1 whitespace-nowrap rounded-lg border-2 border-[var(--active)] bg-[var(--active)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90',
            closeButton: 'hover:text-[var(--active)] focus:shadow-none'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login/customer')
          } else if (result.isDenied) {
            navigate('/login/company')
          }
        })
        return
      }

      setLoadingAction('buy_now')
      try {
        const state = { directBuy: { productId: product.id, quantity: product?.defaultQuantity ?? 1 } }
        navigate(listingRole === 'company' ? '/checkout/company' : '/checkout', { state })
      } finally {
        setLoadingAction(null)
      }
    }
    if (actionId === 'add_to_cart') {
      setLoadingAction('add_to_cart')
      try {
        await handleAddToCart(product?.id, product?.defaultQuantity ?? 1)
      } finally {
        setLoadingAction(null)
      }
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
              {error?.data?.message || t('common.error')}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t('productsPage.retry', { defaultValue: 'Try again' })}
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
        {product.purchasable === false ? (
          <p className="mb-4 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {t('productsPage.unavailableForPurchase', {
              defaultValue: 'Currently unavailable for purchase',
            })}
          </p>
        ) : null}
        <ProductDetails
          role={listingRole}
          product={product}
          quantity={product.defaultQuantity ?? 1}
          actions={actions}
          onAction={handleAction}
          loadingAction={loadingAction}
        />
      </div>

      {quoteOpen ? (
      <SendQuoteModal
        open
        onClose={() => {
          setQuoteOpen(false)
          setQuoteError('')
        }}
        product={product}
        isSubmitting={isSubmittingQuote}
        error={quoteError}
        onSubmit={async (data) => {
          setIsSubmittingQuote(true)
          setQuoteError('')
          try {
            await createProductQuote({
              productId: product.id,
              data: {
                budget: data.budget,
                quantity: String(data.quantity),
                message: data.message || '',
              },
            }).unwrap()
            setQuoteOpen(false)
            navigate('/messages')
          } catch (err) {
            setQuoteError(
              `${t('ui.sendQuoteFailed')}: ${err?.data?.message || err?.message || t('ui.somethingWentWrong')}`,
            )
          } finally {
            setIsSubmittingQuote(false)
          }
        }}
      />
      ) : null}
    </div>
  )
}
