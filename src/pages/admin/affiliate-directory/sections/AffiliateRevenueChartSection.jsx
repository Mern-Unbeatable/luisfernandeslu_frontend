import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Line } from 'react-chartjs-2'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { useGetAdminAffiliateAnalyticsQuery } from '@/features/admin/adminAffiliateApi'
import { mapAdminAffiliateAnalytics } from '@/features/admin/adminAffiliateMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
)

const I18N_KEY = 'adminAffiliateDirectory.detail.chart'
const MARKETPLACE_COLOR = '#F59E0B'
const COMMISSION_COLOR = '#10B981'

function getChartMaxValue(marketplaceRevenue, affiliateCommission) {
  const values = [...marketplaceRevenue, ...affiliateCommission].map(
    (value) => Number(value) || 0,
  )
  const maxValue = Math.max(0, ...values)
  if (maxValue === 0) return 100
  return Math.ceil(maxValue * 1.15)
}

export default function AffiliateRevenueChartSection({ affiliateId }) {
  const { t } = useTranslation()
  const [period, setPeriod] = useState('thisYear')

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminAffiliateAnalyticsQuery(
    { affiliateId: affiliateId ?? '', period },
    { skip: !affiliateId },
  )

  const analytics = useMemo(
    () => mapAdminAffiliateAnalytics(data?.analytics),
    [data?.analytics],
  )

  const marketplaceLabel = t(`${I18N_KEY}.marketplaceRev`)
  const commissionLabel = t(`${I18N_KEY}.affiliateCommission`)

  const chartData = useMemo(
    () => ({
      labels: analytics?.labels ?? [],
      datasets: [
        {
          label: marketplaceLabel,
          data: analytics?.marketplaceRevenue ?? [],
          borderColor: MARKETPLACE_COLOR,
          backgroundColor: MARKETPLACE_COLOR,
          tension: 0.42,
          cubicInterpolationMode: 'monotone',
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2,
          fill: false,
        },
        {
          label: commissionLabel,
          data: analytics?.affiliateCommission ?? [],
          borderColor: COMMISSION_COLOR,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          tension: 0.42,
          cubicInterpolationMode: 'monotone',
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2,
          fill: true,
        },
      ],
    }),
    [analytics, marketplaceLabel, commissionLabel],
  )

  const yMax = useMemo(
    () =>
      getChartMaxValue(
        analytics?.marketplaceRevenue ?? [],
        analytics?.affiliateCommission ?? [],
      ),
    [analytics?.marketplaceRevenue, analytics?.affiliateCommission],
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true },
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = context.parsed.y ?? 0
              return `${context.dataset.label}: €${Number(value).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#6B7280', font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          max: yMax,
          ticks: {
            color: '#6B7280',
            font: { size: 11 },
            callback: (value) =>
              `€${Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
          },
          grid: { color: 'rgba(0,0,0,0.06)' },
        },
      },
    }),
    [yMax],
  )

  const showInitialLoading = isLoading && !analytics

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
            {t(`${I18N_KEY}.eyebrow`)}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--primary-text)] sm:text-lg">
            {t(`${I18N_KEY}.title`)}
          </h3>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t(`${I18N_KEY}.subtitle`)}
          </p>
        </div>
        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-[var(--primary-text)]"
          aria-label={t(`${I18N_KEY}.timeframe`)}
        >
          <option value="thisYear">{t(`${I18N_KEY}.thisYear`)}</option>
        </select>
      </div>

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, t(`${I18N_KEY}.loadFailed`))}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t('adminAffiliateDirectory.retry')}
          </button>
        </div>
      ) : null}

      <div
        className={`h-72 w-full sm:h-80 ${isFetching && analytics ? 'opacity-60 transition-opacity' : ''}`}
      >
        {showInitialLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-[var(--secondary-text)]">
            {t(`${I18N_KEY}.loading`)}
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </section>
  )
}
