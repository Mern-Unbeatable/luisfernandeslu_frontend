import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft } from 'react-icons/fi'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'

export default function ReturnRequestDetailView({
  request,
  className = '',
}) {
  const { t } = useTranslation()
  if (!request) return null

  return (
    <div className={`mx-auto w-full max-w-5xl ${className}`}>
      <Link
        to="/returns?tab=return"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] hover:text-[var(--active)]"
      >
        <FiArrowLeft className="size-4" aria-hidden />
        {t('returnsCenter.backToOrders')}
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px]">
        <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
            <div>
              <p className="text-lg font-bold text-[var(--primary-text)]">
                {t('returnsCenter.requestTitle', {
                  id: request.displayId,
                })}
              </p>
              <p className="mt-1 text-sm text-[var(--secondary-text)]">
                {t('returnsCenter.submittedOn', { date: request.submittedOn })}
              </p>
            </div>
            <StatusBadge
              status={request.status}
              label={t(
                `returnsCenter.returnStatus.${request.status}`,
                request.status,
              )}
            />
          </div>

          <div className="flex gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
            <img
              src={request.product.image}
              alt=""
              className="size-16 shrink-0 rounded-lg object-cover"
            />
            <div>
              <p className="font-bold text-[var(--primary-text)]">
                {request.product.title}
              </p>
              <p className="mt-1 text-sm text-[var(--secondary-text)]">
                {t('returnsCenter.orderIdLabel', {
                  id: request.product.orderId,
                })}
              </p>
              <p className="mt-0.5 text-sm text-[var(--active)]">
                {t('returnsCenter.reasonLabel', { reason: request.reason })}
              </p>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6">
            <p className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
              {t('returnsCenter.descriptionHeading')}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--primary-text)]">
              {request.description}
            </p>
          </div>

          {request.evidence?.length ? (
            <div className="border-t border-gray-100 px-4 py-4 sm:px-6">
              <p className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
                {t('returnsCenter.evidenceHeading')}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {request.evidence.map((src, index) => (
                  <li key={`${request.id}-ev-${index}`}>
                    <img
                      src={src}
                      alt=""
                      className="size-20 rounded-lg object-cover"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <h3 className="font-bold text-[var(--primary-text)]">
              {t('returnsCenter.timelineTitle')}
            </h3>
            <ul className="mt-4 space-y-4">
              {request.timeline?.map((entry, index) => (
                <li key={`${request.id}-tl-${index}`}>
                  <p className="font-semibold text-[var(--primary-text)]">
                    {t(
                      `returnsCenter.returnStatus.${entry.status}`,
                      entry.status,
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
                    {entry.date} · {entry.actor}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-[var(--active)] p-5 text-white">
            <h3 className="font-bold">{t('returnsCenter.needHelpTitle')}</h3>
            <p className="mt-2 text-sm text-white/90">
              {t('returnsCenter.needHelpBody')}
            </p>
            <Link
              to="/help-center"
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-[var(--active)] hover:bg-gray-50"
            >
              {t('returnsCenter.contactSupport')}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
