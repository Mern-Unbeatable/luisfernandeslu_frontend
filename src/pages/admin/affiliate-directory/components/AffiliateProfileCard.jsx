export default function AffiliateProfileCard({ affiliate, t }) {
  if (!affiliate) return null

  const initials = affiliate.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-700">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--primary-text)]">
                {affiliate.name}
              </h2>
              <span className="inline-flex rounded-md bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
                {affiliate.affiliateId}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {affiliate.email}
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-[var(--secondary-text)] sm:flex-row sm:flex-wrap sm:gap-x-6">
              <li>
                {t('adminAffiliateDirectory.detail.joined')}:{' '}
                <span className="font-medium text-[var(--primary-text)]">
                  {affiliate.joined}
                </span>
              </li>
              <li>
                {t('adminAffiliateDirectory.detail.code')}:{' '}
                <span className="font-medium text-[var(--primary-text)]">
                  {affiliate.referralCode}
                </span>
              </li>
              <li>
                {t('adminAffiliateDirectory.detail.tier')}:{' '}
                <span className="font-medium text-[var(--primary-text)]">
                  {affiliate.level} ({affiliate.tierRate}%)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 gap-3 sm:max-w-md lg:w-auto">
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 text-center">
            <p className="text-[10px] font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
              {t('adminAffiliateDirectory.detail.stats.revenue')}
            </p>
            <p className="mt-1 text-sm font-bold text-[var(--primary-text)]">
              {affiliate.revenue}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-3 text-center">
            <p className="text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
              {t('adminAffiliateDirectory.detail.stats.earned')}
            </p>
            <p className="mt-1 text-sm font-bold text-emerald-700">
              {affiliate.earned}
            </p>
          </div>
          <div className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-3 text-center">
            <p className="text-[10px] font-semibold tracking-wide text-sky-700 uppercase">
              {t('adminAffiliateDirectory.detail.stats.clients')}
            </p>
            <p className="mt-1 text-sm font-bold text-sky-700">
              {affiliate.clients}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
