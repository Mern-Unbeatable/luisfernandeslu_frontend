import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Line } from 'react-chartjs-2'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import {
  FINANCE_CHART_LABELS,
  FINANCE_COMMISSION_SERIES,
  FINANCE_MARKETING_SERIES,
} from '../data/financeDemo'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

const COMMISSION_COLOR = '#F59E0B'
const MARKETING_COLOR = '#10B981'

function formatTooltipAmount(value) {
  return `€${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function RevenueTrendSection() {
  const { t } = useTranslation()
  const [timeframe, setTimeframe] = useState('thisYear')
  const timeLabel = t('adminFinancePayments.charts.thisYear')

  const commissionLabel = t('adminFinancePayments.charts.commission')
  const marketingLabel = t('adminFinancePayments.charts.marketing')

  const chartData = useMemo(
    () => ({
      labels: FINANCE_CHART_LABELS,
      datasets: [
        {
          label: commissionLabel,
          data: FINANCE_COMMISSION_SERIES,
          borderColor: COMMISSION_COLOR,
          backgroundColor: COMMISSION_COLOR,
          tension: 0.42,
          cubicInterpolationMode: 'monotone',
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: COMMISSION_COLOR,
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
          borderWidth: 2,
        },
        {
          label: marketingLabel,
          data: FINANCE_MARKETING_SERIES,
          borderColor: MARKETING_COLOR,
          backgroundColor: MARKETING_COLOR,
          tension: 0.42,
          cubicInterpolationMode: 'monotone',
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: MARKETING_COLOR,
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
          borderWidth: 2,
        },
      ],
    }),
    [commissionLabel, marketingLabel],
  )

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'bottom',
          align: 'center',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 24,
            color: '#6B7280',
            font: { size: 12 },
          },
        },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#9CA3AF',
          bodyColor: '#111827',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          padding: 14,
          displayColors: false,
          caretSize: 6,
          caretPadding: 8,
          boxPadding: 6,
          callbacks: {
            title: () => '',
            label(context) {
              const name = context.dataset.label || ''
              const amount = formatTooltipAmount(context.parsed.y)
              return `${name}\n${amount}`
            },
            labelTextColor(context) {
              return context.datasetIndex === 0
                ? COMMISSION_COLOR
                : MARKETING_COLOR
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#9CA3AF', font: { size: 11 } },
          border: { display: false },
        },
        y: {
          min: 0,
          max: 80000,
          ticks: {
            color: '#9CA3AF',
            stepSize: 20000,
            font: { size: 11 },
            padding: 8,
          },
          grid: {
            color: '#E5E7EB',
            borderDash: [4, 4],
            drawBorder: false,
          },
          border: { display: false },
        },
      },
    }),
    [],
  )

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          {t('adminFinancePayments.charts.revenueTrend')}
        </h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
          aria-label={timeLabel}
        >
          <option value="thisYear">{timeLabel}</option>
          <option value="lastYear">
            {t('adminFinancePayments.charts.lastYear')}
          </option>
        </select>
      </div>
      <div className="mt-6 h-72 w-full sm:h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
