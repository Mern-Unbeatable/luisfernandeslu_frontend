import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiChevronDown, FiMoreVertical } from 'react-icons/fi'
import Skeleton from '../../common/Skeleton/Skeleton'
import StatusBadge from './StatusBadge'

/**
 * Fully prop-driven data table toolkit.
 * Toggle: showTabs / showSearch / showFilters / showTable / showActions / showPagination
 * Shell: showCard / bgClassName / className
 * Loading: loading / skeletonRows
 */
export default function DataTable({
  showTabs = false,
  tabs = [],
  activeTab,
  onTabChange,

  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',

  showFilters = false,
  filterLabel = 'Sort By:',
  filters = [],

  showTable = true,
  columns = [],
  data = [],
  emptyMessage = 'No data found',
  getRowKey = (row, index) => row?.id ?? index,
  loading = false,
  skeletonRows = 7,

  showActions = false,
  actions = [],
  getActions,
  actionType = 'menu',
  actionHeader = 'Action',

  showPagination = false,
  pagination = null,

  /** Card shell: border, radius, padding. Set false for no chrome. */
  showCard = true,
  /** Background class when showCard is true. Use '' / false for no bg. */
  bgClassName = 'bg-white',

  className = '',
}) {
  const showActionColumn =
    showActions && (typeof getActions === 'function' || actions.length > 0)
  const showToolbar = showTabs || showSearch || showFilters
  const colSpan = columns.length + (showActionColumn ? 1 : 0)

  const wrapperClassName = [
    'w-full overflow-visible',
    showCard
      ? [
          'rounded-xl border border-gray-200 p-4 sm:p-5',
          bgClassName || '',
        ].filter(Boolean).join(' ')
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={wrapperClassName}
      aria-busy={loading || undefined}
    >      {showToolbar ? (
        <div className="mb-5 flex flex-col gap-3">
          {showSearch ? (
            <>
              {showTabs && tabs.length > 0 ? <TabsBar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} /> : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex w-full min-w-0 max-w-md items-center rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:border-[var(--active)]">
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(event) => onSearchChange?.(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full min-w-0 bg-transparent text-sm text-[var(--primary-text)] placeholder:text-[var(--secondary-text)] outline-none"
                  />
                </label>
                {showFilters && filters.length > 0 ? (
                  <FiltersBar filterLabel={filterLabel} filters={filters} />
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {showTabs && tabs.length > 0 ? (
                <TabsBar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
              ) : (
                <div />
              )}
              {showFilters && filters.length > 0 ? (
                <FiltersBar filterLabel={filterLabel} filters={filters} />
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      {showTable ? (
        <div className="w-full overflow-x-auto overflow-y-visible">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-[#F6FBFF]">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-3 py-3 font-semibold text-[var(--primary-text)] whitespace-nowrap sm:px-4 ${column.headerClassName || ''}`}
                  >
                    {column.header}
                  </th>
                ))}
                {showActionColumn ? (
                  <th className="px-3 py-3 font-semibold text-[var(--primary-text)] whitespace-nowrap sm:px-4">
                    {actionHeader}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                  <tr
                    key={`skeleton-${rowIndex}`}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-3 py-3.5 sm:px-4 ${column.className || ''}`}
                      >
                        <Skeleton className="h-4 w-full max-w-[9rem]" />
                      </td>
                    ))}
                    {showActionColumn ? (
                      <td className="px-3 py-3.5 sm:px-4">
                        <Skeleton className="mx-auto size-5 rounded-full" />
                      </td>
                    ) : null}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={colSpan}
                    className="px-4 py-10 text-center text-[var(--secondary-text)]"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={getRowKey(row, rowIndex)}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {columns.map((column) => {
                      const value = row?.[column.key]
                      return (
                        <td
                          key={column.key}
                          className={`px-3 py-3.5 text-[var(--primary-text)] whitespace-nowrap sm:px-4 ${column.className || ''}`}
                        >
                          {typeof column.render === 'function'
                            ? column.render(value, row, rowIndex)
                            : value ?? '—'}
                        </td>
                      )
                    })}
                    {showActionColumn ? (
                      <td className="px-3 py-3.5 sm:px-4">
                        <RowActions
                          row={row}
                          actions={
                            typeof getActions === 'function'
                              ? getActions(row)
                              : actions
                          }
                          actionType={actionType}
                        />
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {showPagination && pagination && !loading ? (
        <PaginationBar pagination={pagination} />
      ) : null}
      {showPagination && loading ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-5 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function TabsBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="inline-flex w-fit max-w-full shrink-0 items-center rounded-lg bg-gray-100 p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange?.(tab.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
              isActive
                ? 'bg-[var(--active)] text-white shadow-sm'
                : 'bg-transparent text-[var(--primary-text)] hover:bg-white/80'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function FiltersBar({ filterLabel, filters }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
      {filterLabel ? (
        <span className="text-sm font-medium text-[var(--primary-text)]">{filterLabel}</span>
      ) : null}
      {filters.map((filter) => (
        <FilterSelect key={filter.id} filter={filter} />
      ))}
    </div>
  )
}

function FilterSelect({ filter }) {
  return (
    <label className="relative inline-flex min-w-[140px] items-center">
      <select
        value={filter.value ?? ''}
        onChange={(event) => filter.onChange?.(event.target.value)}
        disabled={filter.disabled}
        className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none transition-colors hover:border-gray-300 focus:border-[var(--active)] disabled:cursor-not-allowed"
        aria-label={filter.placeholder || filter.id}
      >
        {filter.placeholder && !filter.options?.some((o) => o.value === '') ? (
          <option value="" disabled>
            {filter.placeholder}
          </option>
        ) : null}
        {(filter.options || []).map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FiChevronDown
        className="pointer-events-none absolute right-2.5 size-4 text-[var(--secondary-text)]"
        aria-hidden
      />
    </label>
  )
}

function RowActions({ row, actions, actionType }) {
  if (actionType === 'buttons') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.id || action.label}
            type="button"
            disabled={action.disabled?.(row)}
            onClick={() => action.onClick?.(row)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              action.variant === 'danger'
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'bg-gray-100 text-[var(--primary-text)] hover:bg-gray-200'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {action.icon ? <span className="mr-1 inline-flex">{action.icon}</span> : null}
            {action.label}
          </button>
        ))}
      </div>
    )
  }

  return <ActionMenu row={row} actions={actions} />
}

function ActionMenu({ row, actions }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const menuId = useId()

  const updatePosition = () => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const menuWidth = menuRef.current?.offsetWidth || 148
    const menuHeight = menuRef.current?.offsetHeight || actions.length * 42 + 8
    const gap = 6

    let top = rect.bottom + gap
    let left = rect.right - menuWidth

    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - gap
    }
    if (left < 8) left = 8
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8
    }

    setCoords({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
  }, [open, actions.length])

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      const inButton = buttonRef.current?.contains(event.target)
      const inMenu = menuRef.current?.contains(event.target)
      if (!inButton && !inMenu) setOpen(false)
    }

    const onReposition = () => updatePosition()

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100"
      >
        <FiMoreVertical className="size-5" />
      </button>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              style={{ top: coords.top, left: coords.left }}
              className="fixed z-[9999] min-w-[160px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              {actions.map((action) => {
                if (action.variant === 'header') {
                  return (
                    <button
                      key={action.id || action.label}
                      type="button"
                      role="menuitem"
                      disabled={action.disabled?.(row)}
                      onClick={() => {
                        action.onClick?.(row)
                        setOpen(false)
                      }}
                      className="flex w-full items-center bg-[var(--active)] px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  )
                }

                if (action.variant === 'section') {
                  return (
                    <p
                      key={action.id || action.label}
                      className="px-4 py-2.5 text-sm font-semibold text-[var(--primary-text)]"
                    >
                      {action.label}
                    </p>
                  )
                }

                return (
                  <button
                    key={action.id || action.label}
                    type="button"
                    role="menuitem"
                    disabled={action.disabled?.(row)}
                    onClick={() => {
                      action.onClick?.(row)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      action.variant === 'danger'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-[var(--primary-text)] hover:bg-gray-50'
                    }`}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                )
              })}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

function PaginationBar({ pagination }) {
  const page = Number(pagination.page) || 1
  const pageSize = Number(pagination.pageSize) || 10
  const total = Number(pagination.total) || 0

  const from =
    pagination.from ?? (total === 0 ? 0 : (page - 1) * pageSize + 1)
  const to =
    pagination.to ?? (total === 0 ? 0 : Math.min(page * pageSize, total))

  const hasPrevious = pagination.hasPrevious ?? page > 1
  const hasNext = pagination.hasNext ?? page * pageSize < total

  const goPrevious = () => {
    if (!hasPrevious) return
    if (pagination.onPrevious) {
      pagination.onPrevious()
      return
    }
    pagination.onPageChange?.(page - 1)
  }

  const goNext = () => {
    if (!hasNext) return
    if (pagination.onNext) {
      pagination.onNext()
      return
    }
    pagination.onPageChange?.(page + 1)
  }

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-[var(--active)]">
        {pagination.summaryLabel
          || `Showing ${from} to ${to} of ${total} results`}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goPrevious}
          disabled={!hasPrevious}
          className="rounded-md border border-[var(--active)] bg-white px-4 py-2 text-sm font-medium text-[var(--active)] transition-colors hover:bg-[color-mix(in_srgb,var(--active)_10%,transparent)] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-[var(--secondary-text)] disabled:hover:bg-white"
        >
          {pagination.previousLabel || 'Previous'}
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!hasNext}
          className="rounded-md border border-[var(--active)] bg-white px-4 py-2 text-sm font-medium text-[var(--active)] transition-colors hover:bg-[color-mix(in_srgb,var(--active)_10%,transparent)] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-[var(--secondary-text)] disabled:hover:bg-white"
        >
          {pagination.nextLabel || 'Next'}
        </button>
      </div>
    </div>
  )
}

export { StatusBadge }
