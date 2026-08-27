import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  Filler,
)

const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
]

export default function RevenueSection({
  revenue,
  period = 'thisYear',
  onPeriodChange,
}) {
  const { t } = useTranslation()

  const labels = MONTH_KEYS.map((key) =>
    t(`transporterPaymentsPayouts.months.${key}`),
  )
  const values = revenue?.values || Array.from({ length: 12 }, () => 0)
  const year = revenue?.year || new Date().getFullYear()
  const maxValue = Math.max(Number(revenue?.maxValue) || 0, 1)
  const yTicks = Array.isArray(revenue?.yTicks) ? revenue.yTicks : []

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          borderColor: '#6366f1',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#6366f1',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
          fill: false,
        },
      ],
    }),
    [labels, values],
  )

  const chartOptions = useMemo(() => {
    const tickOptions =
      yTicks.length > 0
        ? { values: yTicks }
        : { stepSize: Math.max(Math.ceil(maxValue / 4), 1) }

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#ffffff',
          titleColor: '#9ca3af',
          titleFont: {
            size: 12,
            weight: '600',
          },
          bodyColor: '#10b981',
          bodyFont: {
            size: 16,
            weight: '700',
          },
          borderColor: '#f3f4f6',
          borderWidth: 1,
          padding: 12,
          boxPadding: 4,
          displayColors: false,
          callbacks: {
            title: (context) => `${context[0].label}, ${year}`,
            label: (context) => `€${Number(context.raw || 0).toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#9ca3af',
            font: {
              size: 11,
            },
          },
          border: {
            display: false,
          },
        },
        y: {
          min: 0,
          max: maxValue,
          ticks: {
            ...tickOptions,
            color: '#9ca3af',
            font: {
              size: 11,
            },
            callback: (value) => `€${value}`,
          },
          grid: {
            color: '#f3f4f6',
            lineWidth: 1,
            borderDash: [4, 4],
            drawTicks: false,
          },
          border: {
            display: false,
          },
        },
      },
    }
  }, [maxValue, yTicks, year])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {t('transporterPaymentsPayouts.revenueOverview.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('transporterPaymentsPayouts.revenueOverview.subtitle')}
          </p>
        </div>
        <div>
          <select
            value={period}
            onChange={(e) => onPeriodChange?.(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500"
            aria-label={t('transporterPaymentsPayouts.revenueOverview.filterAria')}
          >
            <option value="thisYear">
              {t('transporterPaymentsPayouts.filters.thisYear')}
            </option>
            <option value="lastYear">
              {t('transporterPaymentsPayouts.filters.lastYear')}
            </option>
          </select>
        </div>
      </div>

      <div className="mt-8 h-80 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
