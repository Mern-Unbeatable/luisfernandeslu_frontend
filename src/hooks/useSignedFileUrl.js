import { useCallback } from 'react'
import {
  useGetSignedFileUrlQuery,
  useLazyGetSignedFileUrlQuery,
} from '@/features/files/filesApi'

/** Short-lived link for a stored document (private files need one to load). */
export function useSignedFileUrl(url) {
  const { data, isLoading, isFetching, isError } = useGetSignedFileUrlQuery(url, {
    skip: !url,
  })
  return { url: data, isLoading: isLoading || isFetching, isError }
}

/** Returns `open(url)`: fetches a signed link and opens it in a new tab. */
export function useOpenStoredFile() {
  const [getSignedUrl] = useLazyGetSignedFileUrlQuery()

  return useCallback(
    async (url) => {
      if (!url) return false
      // Open synchronously so popup blockers allow it, then point it at the link.
      const win = window.open('', '_blank')
      try {
        const signed = await getSignedUrl(url, true).unwrap()
        if (win) {
          win.opener = null
          win.location.href = signed
        } else {
          window.location.assign(signed)
        }
        return true
      } catch {
        win?.close()
        return false
      }
    },
    [getSignedUrl],
  )
}
