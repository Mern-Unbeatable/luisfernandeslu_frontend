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
import StatusCard from '../../../components/data-display/StatusCard'

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth)
  const userName = user?.name || 'Atik Adnan'

  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [timeframe, setTimeframe] = useState('This year')

  // Mock revenue chart data
  const chartData = [
    { month: 'Jan', val: 8000, orders: 4 },
    { month: 'Feb', val: 12000, orders: 6 },
    { month: 'Mar', val: 18000, orders: 9 },
    { month: 'Apr', val: 15000, orders: 7 },
    { month: 'May', val: 21000, orders: 11 },
    { month: 'Jun', val: 26000, orders: 13 },
    { month: 'Jul', val: 24500, orders: 12 },
    { month: 'Aug', val: 28000, orders: 14 },
    { month: 'Sep', val: 32000, orders: 16 },
    { month: 'Oct', val: 29000, orders: 15 },
    { month: 'Nov', val: 36000, orders: 18 },
    { month: 'Dec', val: 42000, orders: 22 },
  ]

  // Chart configuration parameters
  const width = 1000
  const height = 300
  const paddingLeft = 80
  const paddingRight = 40
  const paddingTop = 30
  const paddingBottom = 40

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom
  const maxVal = 50000

  // Calculate coordinates
  const points = chartData.map((d, i) => {
    const x = paddingLeft + i * (chartWidth / (chartData.length - 1))
    const y = height - paddingBottom - (d.val / maxVal) * chartHeight
    return { x, y, ...d }
  })

  // Generate SVG path for line and area
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`

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

        {/* Premium SVG Line Area Chart */}
        <div className="relative mt-8">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full overflow-visible"
          >
            <defs>
              <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--active)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--active)" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid Lines & Y Axis Labels */}
            {[0, 10000, 20000, 30000, 40000, 50000].map((val) => {
              const y = height - paddingBottom - (val / maxVal) * chartHeight
              return (
                <g key={val} className="opacity-40">
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                  <text
                    x={paddingLeft - 15}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-gray-400 text-xs font-medium"
                  >
                    €{val.toLocaleString()}
                  </text>
                </g>
              )
            })}

            {/* X Axis Labels */}
            {points.map((p) => (
              <text
                key={p.month}
                x={p.x}
                y={height - paddingBottom + 24}
                textAnchor="middle"
                className="fill-gray-400 text-xs font-medium"
              >
                {p.month}
              </text>
            ))}

            {/* Area Path */}
            <path d={areaPath} fill="url(#chart-area-grad)" />

            {/* Line Path */}
            <path
              d={linePath}
              fill="none"
              stroke="var(--active)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Vertical Guide Line */}
            {hoveredIndex !== null && (
              <line
                x1={points[hoveredIndex].x}
                y1={paddingTop}
                x2={points[hoveredIndex].x}
                y2={height - paddingBottom}
                stroke="var(--active)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                className="opacity-70"
              />
            )}

            {/* Data Points / Circles */}
            {points.map((p, idx) => (
              <g key={p.month}>
                {/* Invisible hover target column */}
                <rect
                  x={p.x - chartWidth / (chartData.length - 1) / 2}
                  y={paddingTop}
                  width={chartWidth / (chartData.length - 1)}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {/* Visible dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIndex === idx ? 6 : 4}
                  fill="white"
                  className="fill-white transition-all duration-200"
                  stroke="var(--active)"
                  strokeWidth={hoveredIndex === idx ? 3 : 2}
                  pointerEvents="none"
                />
              </g>
            ))}
          </svg>

          {/* Tooltip Overlay */}
          {hoveredIndex !== null && (
            <div
              className="absolute rounded-xl border border-gray-100 bg-white p-3 shadow-lg transition-all duration-150 pointer-events-none"
              style={{
                left: `${(points[hoveredIndex].x / width) * 100}%`,
                top: `${(points[hoveredIndex].y / height) * 100 - 30}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <p className="text-xs font-semibold text-gray-400">
                {points[hoveredIndex].month}
              </p>
              <div className="mt-1 space-y-0.5">
                <p className="text-sm font-bold text-gray-900">
                  Revenue: €{points[hoveredIndex].val.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Orders: {points[hoveredIndex].orders}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
