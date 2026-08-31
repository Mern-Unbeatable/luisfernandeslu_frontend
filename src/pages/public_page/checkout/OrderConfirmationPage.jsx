import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiMail,
  FiMapPin,
  FiPackage,
  FiLoader
} from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import OrderConfirmationSummary from './components/OrderConfirmationSummary'
import { useGetCheckoutQuery } from '@/features/checkout/checkoutApi'
import dayjs from 'dayjs'

export default function OrderConfirmationPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const checkoutId = searchParams.get('id')
  
  const { data, isLoading, isError } = useGetCheckoutQuery(checkoutId, {
    skip: !checkoutId
  })

  const checkout = data?.body

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center py-12">
        <FiLoader className="size-8 animate-spin text-[var(--active)]" />
      </div>
    )
  }

  if (isError || !checkout) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center py-12">
        <p className="text-lg text-red-500 font-semibold">{t('orderConfirmationPage.notFound', { defaultValue: 'Order not found' })}</p>
        <Link to="/" className="mt-4 text-[var(--active)] hover:underline">
          {t('orderConfirmationPage.goHome', { defaultValue: 'Go back home' })}
        </Link>
      </div>
    )
  }

  // Calculate estimated delivery: +2 and +5 days for demo purposes
  const createdAt = dayjs(checkout.createdAt)
  const deliveryDateFrom = createdAt.add(2, 'day').format('MMMM D, YYYY')
  const deliveryDateTo = createdAt.add(5, 'day').format('MMMM D, YYYY')
  
  const address = checkout.shippingAddress
  const deliveryAddress = address 
    ? `${address.streetAddress}, ${address.city}, ${address.zipCode}`
    : '—'

  return (
    <div className="w-full bg-[#F9FAFB] py-8 sm:py-10 lg:py-12">
      <Seo
        title={t('orderConfirmationPage.seoTitle')}
        description={t('orderConfirmationPage.seoDescription')}
      />

      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <div className="relative mx-auto mb-5 inline-flex">
            <span
              className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md sm:size-[72px]"
              aria-hidden
            >
              <FiCheck className="size-8 sm:size-9" strokeWidth={3} />
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
            {t('orderConfirmationPage.title')}
          </h1>
          <p className="mt-2 text-sm text-[var(--secondary-text)] sm:text-base">
            {t('orderConfirmationPage.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-100 p-5 sm:p-6">
                <p className="text-base font-bold text-[var(--primary-text)]">
                  {t('orderConfirmationPage.orderNumber', {
                    number: checkout.checkoutNumber,
                  })}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--secondary-text)]">
                  <span className="inline-flex items-center gap-1.5">
                    <FiCalendar className="size-4 shrink-0" aria-hidden />
                    {createdAt.format('MMMM D, YYYY')}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FiMail className="size-4 shrink-0" aria-hidden />
                    {checkout.email}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-[var(--active)] bg-white p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-[var(--primary-text)]">
                  {t('orderConfirmationPage.emailSent')}
                </p>
              </div>
            </div>

            <section>
              <h2 className="text-lg font-bold text-[var(--primary-text)]">
                {t('orderConfirmationPage.shippedTitle')}
              </h2>
              <p className="mt-1 text-sm text-[var(--secondary-text)]">
                {t('orderConfirmationPage.shipmentItems', {
                  count: checkout.items?.length || 0,
                })}
              </p>

              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
                  <div className="flex gap-3">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--active)_12%,white)] text-[var(--active)]">
                      <FiMapPin className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--primary-text)]">
                        {t('orderConfirmationPage.deliveryAddress')}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--secondary-text)]">
                        {deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
                    <div className="flex gap-3">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--active)_12%,white)] text-[var(--active)]">
                        <FiClock className="size-5" aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--primary-text)]">
                          {t('orderConfirmationPage.estimatedDelivery')}
                        </p>
                        <p className="mt-1 text-sm text-[var(--secondary-text)]">
                          {deliveryDateFrom} - {deliveryDateTo}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
                    <div className="flex gap-3">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--active)_12%,white)] text-[var(--active)]">
                        <FiPackage className="size-5" aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--primary-text)]">
                          {t('orderConfirmationPage.shippingMethod')}
                        </p>
                        <p className="mt-1 text-sm text-[var(--secondary-text)] flex flex-col capitalize">
                          {checkout.unloadingType || 'Standard'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Link
              to="/products"
              className="inline-flex text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t('orderConfirmationPage.continueShopping')}
            </Link>
          </div>

          <OrderConfirmationSummary checkout={checkout} />
        </div>
      </div>
    </div>
  )
}
