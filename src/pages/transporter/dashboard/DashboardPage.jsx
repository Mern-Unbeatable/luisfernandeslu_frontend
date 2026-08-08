import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaGavel } from 'react-icons/fa'
import {
  FiTruck,
  FiCheckCircle,
  FiPackage,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi'
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
import StatusCard from '../../../components/data-display/StatusCard'

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

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth)
  const userName = user?.name || 'Atik Adnan'

  const [timeframe, setTimeframe] = useState('This year')

  // Data config matching the design values
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const revenues = [2300, 3500, 3800, 3000, 4500, 6800, 6700, 5900, 7700, 5900, 4100, 4600]

  const chartData = {
    labels,
    datasets: [
      {
        data: revenues,
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
            return `$${context.raw.toFixed(2)}`
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
          callback: (value) => `$${value}`,
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {userName}
        </p>
      </div>

      {/* Row 1: Status Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        <StatusCard
          variant="default"
          label="Active Auctions"
          value="12"
          icon={FaGavel}
          iconTone="brand"
        />
        <StatusCard
          variant="default"
          label="Won Deliveries"
          value="8"
          icon={FiCheckCircle}
          iconTone="teal"
        />
        <StatusCard
          variant="default"
          label="In Transit"
          value="5"
          icon={FiTruck}
          iconTone="warning"
        />
        <StatusCard
          variant="default"
          label="Completed Today"
          value="3"
          icon={FiPackage}
          iconTone="purple"
        />
        <StatusCard
          variant="default"
          label="Today's Earnings"
          value="€24,500"
          icon={FiDollarSign}
          iconTone="teal"
        />
        <StatusCard
          variant="default"
          label="Pending Earnings"
          value="€12,300"
          icon={FiClock}
          iconTone="warning"
        />
      </div>

      {/* Row 2: Action Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* View Auctions */}
        <Link
          to="/transporter/auction-board"
          className="group block transition-all"
        >
          <StatusCard
            variant="default"
            value="View Auctions"
            description="12 active auctions near you"
            icon={FaGavel}
            iconTone="brand"
            className="!bg-[var(--active)] !border-none !text-white [&_p]:!text-white/90 [&_p:nth-of-type(2)]:!text-white [&_span]:!bg-white/20 [&_span]:!text-white shadow-sm transition-all hover:brightness-95 hover:shadow-md"
          />
        </Link>

        {/* My Deliveries */}
        <Link
          to="/transporter/assign-deliveries"
          className="group block transition-all"
        >
          <StatusCard
            variant="default"
            value="My Deliveries"
            description="8 active deliveries"
            icon={FiTruck}
            iconTone="brand"
            className="!border-2 !border-[var(--active)] bg-white shadow-sm transition-all hover:shadow-md"
          />
        </Link>

        {/* Request Payout */}
        <Link
          to="/transporter/payments-payouts"
          className="group block transition-all"
        >
          <StatusCard
            variant="default"
            value="Request Payout"
            description="€36,800 available"
            icon={FiDollarSign}
            iconTone="teal"
            className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
          />
        </Link>
      </div>

      {/* Row 3: Revenue Overview Section */}
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
    </div>
  )
}
