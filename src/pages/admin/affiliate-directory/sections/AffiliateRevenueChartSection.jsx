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
import {
  AFFILIATE_CHART_LABELS,
  AFFILIATE_COMMISSION_SERIES,
  AFFILIATE_MARKETPLACE_SERIES,
} from '../data/affiliatesAdminDemo'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
)

const MARKETPLACE_COLOR = '#F59E0B'
const COMMISSION_COLOR = '#10B981'

export default function AffiliateRevenueChartSection() {
  const { t } = useTranslation()
  const [timeframe] = useState('thisYear')

  const marketplaceLabel = t(
    'adminAffiliateDirectory.detail.chart.marketplaceRev',
  )
  const commissionLabel = t(
    'adminAffiliateDirectory.detail.chart.affiliateCommission',
  )

  const chartData = useMemo(
    () => ({
      labels: AFFILIATE_CHART_LABELS,
      datasets: [
        {
          label: marketplaceLabel,
          data: AFFILIATE_MARKETPLACE_SERIES,
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
          data: AFFILIATE_COMMISSION_SERIES,
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
    [marketplaceLabel, commissionLabel],
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
              return `${context.dataset.label}: $${Number(value).toLocaleString('en-US')}`
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
          max: 80000,
          ticks: {
            color: '#6B7280',
            font: { size: 11 },
            callback: (value) =>
              `$${Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
          },
          grid: { color: 'rgba(0,0,0,0.06)' },
        },
      },
    }),
    [],
  )

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
            {t('adminAffiliateDirectory.detail.chart.eyebrow')}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--primary-text)] sm:text-lg">
            {t('adminAffiliateDirectory.detail.chart.title')}
          </h3>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t('adminAffiliateDirectory.detail.chart.subtitle')}
          </p>
        </div>
        <select
          value={timeframe}
          readOnly
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-[var(--primary-text)]"
          aria-label={t('adminAffiliateDirectory.detail.chart.timeframe')}
        >
          <option value="thisYear">
            {t('adminAffiliateDirectory.detail.chart.thisYear')}
          </option>
        </select>
      </div>
      <div className="h-72 w-full sm:h-80">
        <Line data={chartData} options={options} />
      </div>
    </section>
  )
}
