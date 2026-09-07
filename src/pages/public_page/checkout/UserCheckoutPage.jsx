import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import BillingInformationForm, {
  emptyBillingValues,
} from './components/BillingInformationForm'
import CheckoutOrderSummary from './components/CheckoutOrderSummary'
import ShippingUnloadingForm, {
  emptyShippingValues,
} from './components/ShippingUnloadingForm'
import { useGetCustomerProfileQuery } from '@/features/customer/customerProfileApi'
import { usePlaceCheckoutMutation, useQuoteDirectBuyMutation } from '@/features/checkout/checkoutApi'
import { useGetCartQuery } from '@/features/cart/cartApi'
import toast from 'react-hot-toast'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

export default function UserCheckoutPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { data: profileData } = useGetCustomerProfileQuery()
  const savedAddress = profileData?.profile?.billingAddress
  const hasSavedAddress = Boolean(savedAddress && savedAddress.address)

  const [billing, setBilling] = useState(emptyBillingValues)
  const [shipping, setShipping] = useState(emptyShippingValues)
  const [useCustomBilling, setUseCustomBilling] = useState(false)
  const [placeCheckout, { isLoading: isSubmitting }] = usePlaceCheckoutMutation()
  const { data: cartDataQuery } = useGetCartQuery(undefined, { skip: !!location.state?.directBuy })
  const [quoteDirect, { data: directDataResponse }] = useQuoteDirectBuyMutation()
  
  const directBuy = location.state?.directBuy
  const [directPromos, setDirectPromos] = useState([])
  const [initialDirectQuoteDone, setInitialDirectQuoteDone] = useState(false)

  useEffect(() => {
    if (directBuy && !initialDirectQuoteDone) {
      quoteDirect({ directBuy, promos: directPromos })
        .unwrap()
        .catch((err) => {
          console.error("Direct buy quote error:", err)
          toast.error("Failed to fetch product price.")
        })
      setInitialDirectQuoteDone(true)
    }
  }, [directBuy, initialDirectQuoteDone, quoteDirect, directPromos])

  const cartData = directBuy ? directDataResponse?.cart : cartDataQuery?.cart
  
  const allCartItems = cartData?.items || []
  const selectedIds = location.state?.selectedIds
  const cartItems = selectedIds && selectedIds.length > 0 && !directBuy
    ? allCartItems.filter(item => selectedIds.includes(item.id))
    : allCartItems

  useEffect(() => {
    if (savedAddress && !useCustomBilling) {
      setBilling((prev) => ({ ...prev, ...savedAddress }))
    }
  }, [savedAddress, useCustomBilling])

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (cartItems.length === 0 && !directBuy) {
      toast.error(t('checkoutPage.emptyCart'))
      return
    }

    const cartItemIds = directBuy ? undefined : cartItems.map(item => item.id)

    let finalBillingAddress = null
    if (!useCustomBilling && hasSavedAddress) {
      finalBillingAddress = {
        title: 'Profile Billing',
        streetAddress: savedAddress.address || '—',
        city: savedAddress.city || '—',
        state: savedAddress.region || '—',
        zipCode: savedAddress.zipCode || '—',
        country: savedAddress.country || 'Portugal'
      }
    } else {
      finalBillingAddress = {
        title: 'Custom Billing',
        streetAddress: billing.address || '—',
        city: billing.city || '—',
        state: billing.region || '—',
        zipCode: billing.zipCode || '—',
        country: 'Portugal'
      }
    }

    const payload = {
      cartItemIds,
      firstName: billing.firstName || savedAddress?.firstName || '—',
      lastName: billing.lastName || savedAddress?.lastName || '—',
      email: billing.email || savedAddress?.email || 'test@test.com',
      phone: billing.phone || savedAddress?.phone || '000000',
      billingAddress: finalBillingAddress,
      shippingAddress: {
        title: 'Shipping',
        streetAddress: shipping.address || '—',
        city: shipping.city || '—',
        state: shipping.region || '—',
        zipCode: shipping.zipCode || '—',
        country: 'Portugal'
      },
      unloadingType: shipping.unloadingType || 'Forklift',
      unloadingLocationDescription: shipping.unloadingLocationDescription,
      accessConditions: shipping.accessConditions,
      paymentMethod: 'multibanco',
      directBuy: directBuy || undefined,
      promos: directBuy ? directPromos : undefined,
    }

    try {
      const result = await placeCheckout(payload).unwrap()
      if (result.success) {
        navigate(`/order/confirmation?id=${result.id}`)
      } else {
        toast.error(getAuthErrorMessage(result, t('checkoutPage.placeOrderFailed')))
      }
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t('checkoutPage.placeOrderFailed')))
    }
  }

  return (
    <div className="w-full bg-[#F9FAFB] py-6 sm:py-8 lg:py-10">
      <Seo
        title={t('checkoutPage.userSeoTitle')}
        description={t('checkoutPage.userSeoDescription')}
      />
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:gap-10">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            
            {hasSavedAddress && !useCustomBilling ? (
              <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6 lg:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--primary-text)]">
                    {t('checkoutPage.billingTitle')}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setUseCustomBilling(true)}
                    className="text-sm font-semibold text-[var(--active)] hover:underline"
                  >
                    Use different address
                  </button>
                </div>
                <div className="text-sm text-[var(--secondary-text)]">
                  <p className="font-semibold text-[var(--primary-text)]">
                    {savedAddress.firstName} {savedAddress.lastName}
                  </p>
                  <p className="mt-1">{savedAddress.address}</p>
                  <p>
                    {savedAddress.city}, {savedAddress.region} {savedAddress.zipCode}
                  </p>
                  <p>{savedAddress.country}</p>
                  <p className="mt-2">{savedAddress.email}</p>
                  <p>{savedAddress.phone}</p>
                </div>
              </div>
            ) : null}

            <BillingInformationForm 
              values={billing} 
              onChange={setBilling} 
              hideBillingFields={hasSavedAddress && !useCustomBilling} 
            />
            
            {hasSavedAddress && useCustomBilling && (
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={() => setUseCustomBilling(false)}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline"
                >
                  Cancel and use saved address
                </button>
              </div>
            )}

            <ShippingUnloadingForm values={shipping} onChange={setShipping} />
          </form>

          <CheckoutOrderSummary 
            backTo={directBuy ? `/product/${location.state?.productSlug || ''}` : "/cart"} 
            shippingForm={shipping} 
            isSubmitting={isSubmitting} 
            cartItems={cartItems}
            promos={cartData?.promos || []}
            fees={cartData?.fees || {}}
            directBuy={directBuy}
            directPromos={directPromos}
            onDirectPromoUpdate={async (newPromos) => {
              setDirectPromos(newPromos)
              await quoteDirect({ directBuy, promos: newPromos }).unwrap()
            }}
          />
        </div>
      </div>
    </div>
  )
}
