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

function buildYTicks(maxValue) {
  const safeMax = Math.max(Number(maxValue) || 0, 1)
  const step = safeMax / 4
  return [0, step, step * 2, step * 3, safeMax]
}

export default function EarningAnalytics({
  title = 'Earning Analytics',
  subtitle = 'Track earning',
  filterAriaLabel = 'Earning analytics period filter',
  labels = [],
  values = [],
  amountLabels = [],
  series = {},
  filterOptions = ['This year', 'Last year'],
  defaultFilter,
  filter: controlledFilter,
  onFilterChange,
}) {
  const [internalFilter, setInternalFilter] = useState(
    defaultFilter || getFilterValue(filterOptions[0]) || 'This year',
  )
  const filter =
    controlledFilter != null ? controlledFilter : internalFilter

  const chartValues =
    values.length > 0
      ? values
      : series[filter] || Object.values(series)[0] || []

  const maxAmount = Math.max(0, ...chartValues.map((value) => Number(value) || 0))
  const yTicks = buildYTicks(maxAmount)

  const chartData = {
    labels,
    datasets: [
      {
        data: chartValues,
        borderColor: BRAND,
        borderWidth: 3.5,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: BRAND,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        fill: true,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart
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
          label: (context) => {
            const labelFromApi = amountLabels[context.dataIndex]
            if (labelFromApi != null && labelFromApi !== '') return labelFromApi
            return String(context.raw ?? '')
          },
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
        max: yTicks[yTicks.length - 1],
        afterBuildTicks: (axis) => {
          axis.ticks = yTicks.map((value) => ({ value }))
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          callback: (value) => {
            const rounded = Number(value)
            if (rounded === 0) return '0'
            return Number.isInteger(rounded)
              ? String(rounded)
              : rounded.toFixed(2)
          },
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
    <div className="rounded-2xl border border-[#00000026] bg-white p-5 sm:p-6">
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
            onChange={(event) => {
              const next = event.target.value
              if (controlledFilter == null) setInternalFilter(next)
              onFilterChange?.(next)
            }}
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
