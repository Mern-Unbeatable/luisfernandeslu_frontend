import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import BillingInformationForm, {
  emptyBillingValues,
} from './components/BillingInformationForm'
import CheckoutOrderSummary from './components/CheckoutOrderSummary'

export default function UserCheckoutPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [billing, setBilling] = useState(emptyBillingValues)

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/order/confirmation')
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
            <BillingInformationForm values={billing} onChange={setBilling} />
          </form>

          <CheckoutOrderSummary backTo="/products" />
        </div>
      </div>
    </div>
  )
}
