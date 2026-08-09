import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { Doughnut } from 'react-chartjs-2'
import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Tooltip)

function getFilterValue(option) {
  return typeof option === 'string' ? option : option.value
}

function getFilterLabel(option) {
  return typeof option === 'string' ? option : option.label
}

export default function OrderStatus({
  title = 'Order Status',
  filterAriaLabel = 'Order status period filter',
  series = {},
  filterOptions = ['This month', 'This week'],
  defaultFilter,
}) {
  const [filter, setFilter] = useState(
    defaultFilter || getFilterValue(filterOptions[0]) || 'This month',
  )

  const items = series[filter] || Object.values(series)[0] || []

  const chartData = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        data: items.map((item) => item.value),
        backgroundColor: items.map((item) => item.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#191c1f',
        bodyColor: '#4a5565',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          {title}
        </h2>

        <label className="relative inline-flex shrink-0">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pr-9 pl-3 text-sm font-medium text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
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

      <div className="mx-auto mt-6 h-52 w-full max-w-[220px] sm:h-56">
        <Doughnut data={chartData} options={chartOptions} />
      </div>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li
            key={item.key || item.label}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="inline-flex items-center gap-2 text-[var(--primary-text)]">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              {item.label}
            </span>
            <span className="font-semibold text-[var(--primary-text)]">
              {Number(item.value).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
