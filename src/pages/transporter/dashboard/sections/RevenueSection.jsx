import { useState } from 'react'
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

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  Filler
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

const REVENUES = [
  2300, 3500, 3800, 3000, 4500, 6800, 6700, 5900, 7700, 5900, 4100, 4600,
]

export default function RevenueSection() {
  const { t } = useTranslation()
  const [timeframe, setTimeframe] = useState('thisYear')

  const labels = MONTH_KEYS.map((key) => t(`transporterDashboard.months.${key}`))

  const chartData = {
    labels,
    datasets: [
      {
        data: REVENUES,
        borderColor: '#6366f1',
        borderWidth: 3,
        tension: 0.4, // smooth curve
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#6366f1',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        fill: false,
      },
    ],
  }

  const chartOptions = {
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
          title: (context) => {
            return `${context[0].label}, 2026`
          },
          label: (context) => {
            return `€${context.raw.toFixed(2)}`
          },
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
        max: 10000,
        ticks: {
          stepSize: 2500,
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {t('transporterDashboard.revenueOverview.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('transporterDashboard.revenueOverview.subtitle')}
          </p>
        </div>
        <div>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500"
            aria-label={t('transporterDashboard.revenueOverview.filterAria')}
          >
            <option value="thisYear">
              {t('transporterDashboard.filters.thisYear')}
            </option>
            <option value="lastYear">
              {t('transporterDashboard.filters.lastYear')}
            </option>
          </select>
        </div>
      </div>

      {/* ChartJS Line Chart */}
      <div className="mt-8 h-80 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
