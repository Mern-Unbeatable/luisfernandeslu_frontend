import { useEffect, useRef } from 'react'

/**
 * Scrolls the section anchor into view when `page` changes (skips first mount).
 * Use scroll-mt-* on the anchor for sticky header offset.
 */
export default function useScrollToSectionOnPageChange(page) {
  const sectionRef = useRef(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    sectionRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [page])

  return sectionRef
}
