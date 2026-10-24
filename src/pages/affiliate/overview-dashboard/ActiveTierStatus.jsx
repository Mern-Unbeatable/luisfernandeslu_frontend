import { FiAward } from 'react-icons/fi'
import i18n from '@/i18n'

export default function ActiveTierStatus({
  label = i18n.t('fallback.activeTierStatus'),
  tierName = i18n.t('fallback.starterLevel'),
  headline = i18n.t('fallback.commissionRateHeadline', { percent: 5 }),
  description = i18n.t('fallback.keepInviting'),
  progressLabel = i18n.t('fallback.progressToLevelPercent', { level: i18n.t('fallback.bronzeLevel'), percent: 10 }),
  clientsLabel,
  currentClients = 0,
  targetClients = 100,
  progressPercent: progressPercentProp,
  helpText,
}) {
  const progressPercent =
    progressPercentProp != null
      ? Math.min(100, Math.max(0, Number(progressPercentProp) || 0))
      : Math.min(
          100,
          Math.round((currentClients / Math.max(targetClients, 1)) * 100),
        )
  const clientsNeeded = Math.max(targetClients - currentClients, 0)
  const resolvedHelpText =
    helpText ||
    i18n.t('fallback.clientsNeeded', { count: clientsNeeded, level: i18n.t('fallback.bronzeLevel') })
  const resolvedClientsLabel =
    clientsLabel || i18n.t('fallback.clientsProgress', { current: currentClients, target: targetClients })

  return (
    <div className="rounded-2xl border border-[#00000026] bg-[#F8FAFC] p-5 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#0000000F] bg-white text-[var(--active)]">
            <FiAward className="size-5" strokeWidth={1.75} aria-hidden />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium tracking-wide text-[var(--secondary-text)] uppercase">
                {label}
              </p>
              <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-[var(--primary-text)]">
                {tierName}
              </span>
            </div>
            <p className="mt-2 text-xl font-bold text-[var(--primary-text)] sm:text-2xl">
              {headline}
            </p>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {description}
            </p>
          </div>
        </div>

        <div className="w-full shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-4 lg:max-w-md">
          <div className="flex items-center justify-between gap-3 text-sm text-[var(--secondary-text)]">
            <span>{progressLabel}</span>
            <span>{resolvedClientsLabel}</span>
          </div>

          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[var(--primary-text)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-[var(--secondary-text)] italic">
            {resolvedHelpText}
          </p>
        </div>
      </div>
    </div>
  )
}
