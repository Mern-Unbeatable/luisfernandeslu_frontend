import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi'

function buildPageItems(page, totalPages) {
  if (totalPages <= 1) return [1]

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items = [1]

  if (page > 3) {
    items.push('ellipsis')
  }

  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)

  for (let current = start; current <= end; current += 1) {
    items.push(current)
  }

  if (page < totalPages - 2) {
    items.push('ellipsis')
  }

  if (totalPages > 1) {
    items.push(totalPages)
  }

  return items
}

/**
 * Numbered pagination with first/prev/next/last controls.
 */
export default function Pagination({
  page = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const pageItems = buildPageItems(safePage, totalPages)

  const goTo = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === safePage) return
    onPageChange?.(nextPage)
  }

  const navButtonClass =
    'inline-flex size-8 items-center justify-center rounded-full text-[var(--primary-text)] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent'

  return (
    <nav
      className={`flex items-center justify-center gap-1.5 sm:gap-2 ${className}`}
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => goTo(1)}
        disabled={safePage <= 1}
        className={navButtonClass}
        aria-label="First page"
      >
        <FiChevronsLeft className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => goTo(safePage - 1)}
        disabled={safePage <= 1}
        className={navButtonClass}
        aria-label="Previous page"
      >
        <FiChevronLeft className="size-4" aria-hidden />
      </button>

      {pageItems.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex size-8 items-center justify-center text-sm text-[var(--secondary-text)]"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => goTo(item)}
            aria-current={item === safePage ? 'page' : undefined}
            className={`inline-flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              item === safePage
                ? 'bg-[var(--active)] text-white'
                : 'text-[var(--primary-text)] hover:bg-gray-100'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => goTo(safePage + 1)}
        disabled={safePage >= totalPages}
        className={navButtonClass}
        aria-label="Next page"
      >
        <FiChevronRight className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => goTo(totalPages)}
        disabled={safePage >= totalPages}
        className={navButtonClass}
        aria-label="Last page"
      >
        <FiChevronsRight className="size-4" aria-hidden />
      </button>
    </nav>
  )
}
