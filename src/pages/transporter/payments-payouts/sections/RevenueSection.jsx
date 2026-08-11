import { useState } from 'react'
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

export default function RevenueSection() {
  const [timeframe, setTimeframe] = useState('This year')

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const revenues = [2300, 3500, 3800, 3000, 4500, 6800, 6700, 5900, 7700, 5900, 4100, 4600]

  const chartData = {
    labels,
    datasets: [
      {
        data: revenues,
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
          title: (context) => `${context[0].label}, 2026`,
          label: (context) => `€${context.raw.toFixed(2)}`,
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
          <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
          <p className="text-sm text-gray-500">
            Revenue and order volume analysis for the current year
          </p>
        </div>
        <div>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500"
          >
            <option>This year</option>
            <option>Last year</option>
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
