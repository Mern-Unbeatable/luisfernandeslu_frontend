import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
)

const BRAND = '#DF900A'

function getFilterValue(option) {
  return typeof option === 'string' ? option : option.value
}

function getFilterLabel(option) {
  return typeof option === 'string' ? option : option.label
}

export default function RevenueOverview({
  title = 'Revenue Overview',
  subtitle = 'Monthly revenue for the last 6 months',
  filterAriaLabel = 'Revenue period filter',
  labels = [],
  series = {},
  filterOptions = ['This year', 'Last year'],
  defaultFilter,
}) {
  const [filter, setFilter] = useState(
    defaultFilter || getFilterValue(filterOptions[0]) || 'This year',
  )

  const values = series[filter] || Object.values(series)[0] || []

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: BRAND,
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: BRAND,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return 'rgba(223, 144, 10, 0.15)'
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          )
          gradient.addColorStop(0, 'rgba(223, 144, 10, 0.35)')
          gradient.addColorStop(0.55, 'rgba(223, 144, 10, 0.12)')
          gradient.addColorStop(1, 'rgba(223, 144, 10, 0)')
          return gradient
        },
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#ffffff',
        titleColor: '#4a5565',
        bodyColor: BRAND,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `$${Number(context.raw).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
        },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 8000,
        ticks: {
          stepSize: 2000,
          color: '#9ca3af',
          font: { size: 11 },
          callback: (value) => `$${value}`,
        },
        grid: {
          color: '#e5e7eb',
          borderDash: [4, 4],
          drawTicks: false,
        },
        grid: {
          color: '#e5e7eb',
          drawTicks: false,
        },
        border: {
          display: false,
          dash: [6, 6],
        },
      },
    },
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
            {subtitle}
          </p>
        </div>

        <label className="relative inline-flex w-full max-w-full shrink-0 overflow-hidden self-start sm:w-auto">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-9 w-full max-w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pr-9 pl-3 text-sm font-medium text-[var(--primary-text)] outline-none focus:border-[var(--active)] sm:w-auto"
            aria-label={filterAriaLabel}
          >
            {filterOptions.map((option) => {
              const value = getFilterValue(option)
              return (
                <option key={value} value={value}>
                  {getFilterLabel(option)}
                </option>
              )
            })}
          </select>
          <FiChevronDown
            className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-[var(--secondary-text)]"
            aria-hidden
          />
        </label>
      </div>

      <div className="mt-6 h-72 w-full sm:h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
