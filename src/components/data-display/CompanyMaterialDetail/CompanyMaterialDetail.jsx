import { useTranslation } from 'react-i18next'
import {
  FiBell,
  FiBriefcase,
  FiDollarSign,
} from 'react-icons/fi'
import InstallmentTimeline from '@/components/data-display/InstallmentTimeline/InstallmentTimeline'
import BuyerOrderProgress from '@/components/data-display/BuyerOrderProgress/BuyerOrderProgress'
import DriverContactCard from '@/components/data-display/DriverContactCard/DriverContactCard'
import { MetaCard } from '@/components/data-display/OrderDetails/shared'

export default function CompanyMaterialDetail({
  material,
  onBack,
  showPay = true,
  onPayNow,
  onCancelInstallment,
  onChatDriver,
  className = '',
}) {
  const { t } = useTranslation()
  if (!material) return null

  const payment = material.paymentSummary ?? {}

  return (
    <div className={`mx-auto w-full ${className}`}>
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 text-sm text-[var(--secondary-text)] hover:text-[var(--active)]"
        >
          {t('companyProjects.backToProjectDetails')}
        </button>
      ) : null}

      {material.reminder ? (
        <div className="mb-6 flex gap-3 rounded-xl border border-gray-200 bg-[#F3F4F6] px-4 py-4 sm:px-5">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--secondary-text)]">
            <FiBell className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-[var(--primary-text)]">
              {material.reminder.title}
            </p>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {material.reminder.body}
            </p>
          </div>
        </div>
      ) : null}

      <article className="rounded-xl border border-gray-200 bg-white p-5 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
              {material.orderId}
            </p>
            <div className="mt-4 flex items-start gap-2">
              <FiBriefcase
                className="mt-0.5 size-5 shrink-0 text-[var(--secondary-text)]"
                aria-hidden
              />
              <div>
                <p className="font-semibold text-[var(--primary-text)]">
                  {material.supplierName}
                </p>
                <p className="text-sm text-[var(--secondary-text)]">
                  {t('companyProjects.projectLabel', {
                    name: material.projectName,
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            {material.planLabel ? (
              <p className="text-sm font-semibold text-[var(--active)]">
                {material.planLabel}
              </p>
            ) : null}
            {material.planRange ? (
              <p className="mt-1 text-xs text-[var(--secondary-text)]">
                {material.planRange}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <FiDollarSign className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs text-[var(--secondary-text)]">
              {t('companyProjects.totalOrderValue')}
            </p>
            <p className="text-xl font-bold text-emerald-600">
              {material.totalOrderValue}
            </p>
          </div>
        </div>
      </article>

      <section className="mt-6 rounded-xl border border-orange-200 bg-[#FFF7ED] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          {t('companyProjects.paymentSummary')}
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-[var(--secondary-text)]">
              {t('companyProjects.totalAmount')}
            </p>
            <p className="mt-1 text-xl font-bold text-[var(--primary-text)]">
              {payment.totalAmount}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--secondary-text)]">
              {t('companyProjects.paidAmount')}
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-600">
              {payment.paidAmount}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--secondary-text)]">
              {t('companyProjects.remainingBalance')}
            </p>
            <p className="mt-1 text-xl font-bold text-[var(--active)]">
              {payment.remainingBalance}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--primary-text)]">
              {t('companyProjects.progress')}
            </span>
            <span className="text-[var(--secondary-text)]">
              {payment.progressLabel}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${payment.progressPercent ?? 0}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetaCard
            label={t('companyProjects.nextInstallment')}
            value={payment.nextInstallmentDate}
          />
          <MetaCard
            label={t('companyProjects.monthlyPayment')}
            value={payment.monthlyPayment}
          />
        </div>

        {payment.note ? (
          <p className="mt-4 text-sm text-[var(--secondary-text)]">
            {payment.note}
          </p>
        ) : null}
      </section>

      {material.driver ? (
        <div className="mt-6">
          <DriverContactCard driver={material.driver} onChat={onChatDriver} />
        </div>
      ) : null}

      {material.progressSteps?.length ? (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 sm:p-8">
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t('companyProjects.deliveryProgress')}
          </h2>
          <div className="mt-6">
            <BuyerOrderProgress steps={material.progressSteps} />
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <InstallmentTimeline
          title={t('companyProjects.installmentTimeline')}
          items={material.installments}
          showPay={showPay}
          onPayNow={onPayNow}
          onCancel={onCancelInstallment}
        />
      </div>
    </div>
  )
}
