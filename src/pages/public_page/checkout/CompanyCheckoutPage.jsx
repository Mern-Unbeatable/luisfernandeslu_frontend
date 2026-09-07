import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import BillingInformationForm, {
  emptyBillingValues,
} from './components/BillingInformationForm'
import CheckoutOrderSummary from './components/CheckoutOrderSummary'
import ShippingUnloadingForm, {
  emptyShippingValues,
} from './components/ShippingUnloadingForm'
import PaymentMethodSelector from './components/PaymentMethodSelector'
import { useGetCompanyProfileQuery } from '@/features/company/companyProfileApi'
import { useGetSupplierProfileQuery } from '@/features/supplier/profile/profileApi'
import { usePlaceCheckoutMutation, useQuoteDirectBuyMutation } from '@/features/checkout/checkoutApi'
import { useGetCartQuery } from '@/features/cart/cartApi'
import { usePaySupplierQuoteOfferMutation } from '@/features/supplier/quotes/quotesApi'
import { usePayFactoryOfferMutation } from '@/features/chat/chatApi'
import toast from 'react-hot-toast'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

export default function CompanyCheckoutPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  
  const role = useSelector((state) => state.auth?.user?.role)

  const { data: companyProfile } = useGetCompanyProfileQuery(undefined, { skip: role !== 'company' })
  const { data: supplierProfile } = useGetSupplierProfileQuery(undefined, { skip: role !== 'supplier' })
  const profileData = role === 'supplier' ? supplierProfile : companyProfile
  
  const savedAddress = profileData?.profile?.billingAddress
  const hasSavedAddress = Boolean(savedAddress && savedAddress.address)

  const directBuy = location.state?.directBuy
  const isOfferBuy = Boolean(directBuy?.offerId)
  const offerData = directBuy?.offer

  const mapUnloading = (label) => {
    if (!label) return ''
    const map = {
      'Crane (12m)': 'crane-12',
      'Crane (24m)': 'crane-24',
      'Tipper Truck': 'tipper',
      'Forklift': 'forklift',
      'Manual Unloading': 'manual'
    }
    return map[label] || label
  }

  const mapAccess = (label) => {
    if (!label) return ''
    const map = {
      'Easy Access': 'easy',
      'Narrow Road': 'narrow',
      'Restricted Area': 'restricted',
      'Difficult Terrain': 'terrain',
      'Manual Unloading': 'manual' // CreateOfferModal has this
    }
    return map[label] || label
  }

  const [billing, setBilling] = useState({
    ...emptyBillingValues,
    projectName: offerData?.projectName || '',
    projectLocation: offerData?.deliveryLocation || offerData?.projectLocation || '',
  })
  
  const [shipping, setShipping] = useState({
    ...emptyShippingValues,
    address: offerData?.deliveryLocation || '',
    unloadingType: mapUnloading(offerData?.unloadingType),
    accessConditions: mapAccess(offerData?.accessConditions),
  })
  
  const [paymentMethod, setPaymentMethod] = useState('MULTIBANCO')
  const [mbwayPhone, setMbwayPhone] = useState('')
  const [useCustomBilling, setUseCustomBilling] = useState(false)
  const [placeCheckout, { isLoading: isSubmitting }] = usePlaceCheckoutMutation()
  const { data: cartDataQuery } = useGetCartQuery(undefined, { skip: !!directBuy })
  const [quoteDirect, { data: directDataResponse }] = useQuoteDirectBuyMutation()
  const [payQuoteOffer, { isLoading: isPayingQuoteOffer }] = usePaySupplierQuoteOfferMutation()
  const [payFactoryOffer, { isLoading: isPayingFactoryOffer }] = usePayFactoryOfferMutation()
  const [shippingCost, setShippingCost] = useState(0)
  
  const isPayingOffer = isPayingQuoteOffer || isPayingFactoryOffer
  
  const [directPromos, setDirectPromos] = useState([])
  const [initialDirectQuoteDone, setInitialDirectQuoteDone] = useState(false)

  useEffect(() => {
    if (directBuy && !isOfferBuy && !initialDirectQuoteDone) {
      quoteDirect({ directBuy, promos: directPromos }).unwrap().catch(() => {})
      setInitialDirectQuoteDone(true)
    }
  }, [directBuy, isOfferBuy, initialDirectQuoteDone, quoteDirect, directPromos])

  const cartData = directBuy && !isOfferBuy ? directDataResponse?.cart : cartDataQuery?.cart
  
  const allCartItems = cartData?.items || []
  const selectedIds = location.state?.selectedIds
  let cartItems = selectedIds && selectedIds.length > 0 && !directBuy
    ? allCartItems.filter(item => selectedIds.includes(item.id))
    : allCartItems

  if (isOfferBuy && offerData) {
    const firstInstallment = offerData.installments?.[0]
    const qty = firstInstallment ? Number(firstInstallment.quantity) || 1 : (Number(offerData.totalQuantity) || 1)
    const price = firstInstallment ? Number(firstInstallment.amount) || 0 : (Number(offerData.totalPrice) || 0)
    cartItems = [{
      id: offerData.id,
      title: offerData.productName || offerData.title || 'Special Offer',
      image: 'https://placehold.co/100?text=Offer',
      quantity: qty,
      unitPriceText: `€${(price / qty).toFixed(2)}`,
      subtotal: price,
    }]
  }

  useEffect(() => {
    if (savedAddress && !useCustomBilling) {
      setBilling((prev) => ({ ...prev, ...savedAddress }))
    }
  }, [savedAddress, useCustomBilling])

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (isOfferBuy) {
      try {
        let result
        const paymentPayload = {
          paymentMethod: paymentMethod.toLowerCase(),
          mbwayPhone: paymentMethod === 'MBWAY' ? mbwayPhone : undefined,
        }
        if (directBuy.chatType === 'FACTORY_SUPPLIER' || directBuy.isFactoryOffer) {
          result = await payFactoryOffer({ offerId: directBuy.offerId, shippingFee: shippingCost, ...paymentPayload }).unwrap()
        } else {
          result = await payQuoteOffer({ quoteId: directBuy.quoteId, offerId: directBuy.offerId, shippingFee: shippingCost, ...paymentPayload }).unwrap()
        }
        if (result.url) {
          window.location.href = result.url
        } else if (result.checkout?.id) {
          navigate(`/order/confirmation?id=${result.checkout.id}`)
        }
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to process payment')
      }
      return
    }

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
      projectName: billing.projectName,
      projectLocation: billing.projectLocation,
      unloadingType: shipping.unloadingType || 'Forklift',
      unloadingLocationDescription: shipping.unloadingLocationDescription,
      accessConditions: shipping.accessConditions,
      paymentMethod: paymentMethod.toLowerCase(),
      mbwayPhone: paymentMethod === 'MBWAY' ? mbwayPhone : undefined,
      directBuy: directBuy || undefined,
      promos: directBuy ? directPromos : undefined,
    }

    try {
      const result = await placeCheckout(payload).unwrap()
      if (result.success) {
        if (paymentMethod === 'CREDITCARD' && result.payment?.url?.startsWith('http')) {
          window.location.href = result.payment.url
        } else {
          navigate(`/order/confirmation?id=${result.id}`)
        }
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
        title={t('checkoutPage.companySeoTitle')}
        description={t('checkoutPage.companySeoDescription')}
      />
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:gap-10">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            
            {role !== 'supplier' && (
              <>
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
                  showProjectFields
                  showCompanyFields
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
              </>
            )}

            <ShippingUnloadingForm values={shipping} onChange={setShipping} />

            <PaymentMethodSelector 
              value={paymentMethod} 
              onChange={setPaymentMethod} 
              mbwayPhone={mbwayPhone} 
              onMbwayPhoneChange={setMbwayPhone} 
            />
          </form>

          <CheckoutOrderSummary 
            backTo={isOfferBuy ? '/messages' : directBuy ? `/product/${location.state?.productSlug || ''}` : '/cart'} 
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
            onShippingQuoted={setShippingCost}
          />
        </div>
      </div>
    </div>
  )
}
