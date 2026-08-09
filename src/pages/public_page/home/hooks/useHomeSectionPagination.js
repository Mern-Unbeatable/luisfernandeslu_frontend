import { useCallback, useRef, useState } from 'react'

function scrollAnchorIntoView(node) {
  if (!node) return

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  node.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}

/**
 * Pagination state + anchor ref; scroll runs only from `changePage` (user action).
 */
export default function useHomeSectionPagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage)
  const anchorRef = useRef(null)

  const changePage = useCallback((nextPage) => {
    setPage(nextPage)
    requestAnimationFrame(() => {
      scrollAnchorIntoView(anchorRef.current)
    })
  }, [])

  return { page, setPage, changePage, anchorRef }
}
