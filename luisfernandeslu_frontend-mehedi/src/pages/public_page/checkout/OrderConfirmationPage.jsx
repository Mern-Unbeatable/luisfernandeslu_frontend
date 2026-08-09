import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiMail,
  FiMapPin,
  FiPackage,
} from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import OrderConfirmationSummary from './components/OrderConfirmationSummary'
import { ORDER_CONFIRMATION_META } from './data/orderConfirmationDemo'

export default function OrderConfirmationPage() {
  const { t } = useTranslation()
  const meta = ORDER_CONFIRMATION_META

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
                    number: meta.orderNumber,
                  })}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--secondary-text)]">
                  <span className="inline-flex items-center gap-1.5">
                    <FiCalendar className="size-4 shrink-0" aria-hidden />
                    {meta.orderDate}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FiMail className="size-4 shrink-0" aria-hidden />
                    {meta.email}
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
                  count: meta.shipmentItemCount,
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
                        {meta.deliveryAddress}
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
                          {meta.deliveryDateFrom} - {meta.deliveryDateTo}
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
                        <p className="mt-1 text-sm text-[var(--secondary-text)]">
                          {meta.shippingMethod}
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

          <OrderConfirmationSummary />
        </div>
      </div>
    </div>
  )
}
