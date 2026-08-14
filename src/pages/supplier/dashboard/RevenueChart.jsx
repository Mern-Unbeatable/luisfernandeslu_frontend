import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CHART_HEIGHT = 280
const PADDING = { top: 12, right: 16, bottom: 32, left: 52 }

function formatCurrency(value) {
  return `€${value.toFixed(2)}`
}

function formatAxisLabel(value) {
  return `€${value}`
}

function buildSmoothPath(points) {
  if (points.length < 2) return ''

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return path
}

function resolveActiveIndex(clientX, rect, pointCount, plotWidth) {
  const relativeX = clientX - rect.left
  const chartX = (relativeX / rect.width) * (plotWidth + PADDING.left + PADDING.right)
  const normalizedX = Math.max(
    PADDING.left,
    Math.min(chartX, PADDING.left + plotWidth),
  )
  const ratio = (normalizedX - PADDING.left) / plotWidth
  return Math.round(ratio * (pointCount - 1))
}

/**
 * Supplier dashboard revenue line chart (SVG, no external chart lib).
 */
export default function RevenueChart({ revenue = {} }) {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(4)
  const [chartWidth, setChartWidth] = useState(800)

  const maxValue = revenue.maxValue || 10000
  const yTicks = revenue.yTicks || [0, 2500, 5000, 7500, 10000]
  const series = revenue.series || []

  const plotWidth = Math.max(chartWidth - PADDING.left - PADDING.right, 1)
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom

  const seriesPaths = useMemo(() => {
    return series.map((item) => {
      const coords = item.points.map((point, index) => {
        const x =
          PADDING.left +
          (index / (item.points.length - 1 || 1)) * plotWidth
        const y =
          PADDING.top + plotHeight - (point.value / maxValue) * plotHeight
        return { x, y, value: point.value, month: point.month }
      })

      return {
        id: item.id,
        color: item.color,
        path: buildSmoothPath(coords),
        coords,
      }
    })
  }, [series, plotWidth, plotHeight, maxValue])

  const months = series[0]?.points?.map((point) => point.month) || []
  const activeX =
    seriesPaths[0]?.coords[activeIndex]?.x ?? PADDING.left + plotWidth / 2

  useLayoutEffect(() => {
    const element = containerRef.current
    if (!element) return undefined

    const updateWidth = () => {
      const width = element.getBoundingClientRect().width
      if (width > 0) setChartWidth(width)
    }

    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const handlePointer = (event) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || !seriesPaths[0]?.coords.length) return

    const clientX = 'touches' in event ? event.touches[0]?.clientX : event.clientX
    if (clientX == null) return

    setActiveIndex(
      resolveActiveIndex(
        clientX,
        rect,
        seriesPaths[0].coords.length,
        plotWidth,
      ),
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      onMouseMove={handlePointer}
      onTouchMove={handlePointer}
      onMouseLeave={() => setActiveIndex(4)}
    >
      <svg
        viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={t('panel.supplierDashboard.revenueTitle')}
      >
        {yTicks.map((tick) => {
          const y =
            PADDING.top + plotHeight - (tick / maxValue) * plotHeight
          return (
            <g key={tick}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={PADDING.left + plotWidth}
                y2={y}
                stroke="#E5E7EB"
                strokeDasharray="4 4"
              />
              <text
                x={PADDING.left - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-400 text-[11px]"
              >
                {formatAxisLabel(tick)}
              </text>
            </g>
          )
        })}

        {months.map((month, index) => {
          const x =
            PADDING.left +
            (index / (months.length - 1 || 1)) * plotWidth
          return (
            <text
              key={month}
              x={x}
              y={CHART_HEIGHT - 8}
              textAnchor="middle"
              className="fill-gray-400 text-[11px]"
            >
              {month}
            </text>
          )
        })}

        {seriesPaths.map((item) => (
          <path
            key={item.id}
            d={item.path}
            fill="none"
            stroke={item.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        <line
          x1={activeX}
          y1={PADDING.top}
          x2={activeX}
          y2={PADDING.top + plotHeight}
          stroke="#D1D5DB"
          strokeDasharray="4 4"
        />

        {seriesPaths.flatMap((item) =>
          item.coords.map((coord, index) =>
            index === activeIndex ? (
              <circle
                key={`${item.id}-${index}`}
                cx={coord.x}
                cy={coord.y}
                r={5}
                fill="white"
                stroke={item.color}
                strokeWidth={2.5}
              />
            ) : null,
          ),
        )}
      </svg>

      {series.length > 0 ? (
        <div
          className="pointer-events-none absolute z-10 min-w-[148px] rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-md"
          style={{
            left: `${(activeX / chartWidth) * 100}%`,
            top: '16%',
            transform: 'translateX(-50%)',
          }}
        >
          {series.map((item, index) => {
            const point = item.points[activeIndex]
            const labelKey =
              item.id === 'customer'
                ? 'panel.supplierDashboard.customer'
                : 'panel.supplierDashboard.company'
            const color =
              item.id === 'customer' ? 'text-violet-600' : 'text-emerald-600'

            return (
              <p
                key={item.id}
                className={`text-xs text-[var(--secondary-text)] ${index > 0 ? 'mt-1' : ''}`}
              >
                {t(labelKey)}:{' '}
                <span className={`font-semibold ${color}`}>
                  {formatCurrency(point?.value ?? 0)}
                </span>
              </p>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
