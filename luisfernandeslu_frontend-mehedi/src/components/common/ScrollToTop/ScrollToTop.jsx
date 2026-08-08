import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Reset window + marked overflow containers on every route change.
 * Auth layouts use overflow-y-auto panels — tag them with data-scroll-restore.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    // Allow in-page hash anchors to keep their target
    if (hash) return

    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    document.querySelectorAll('[data-scroll-restore]').forEach((node) => {
      node.scrollTop = 0
      node.scrollLeft = 0
    })
  }, [pathname, search, hash])

  return null
}
