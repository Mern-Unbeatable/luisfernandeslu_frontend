import Skeleton from '@/components/common/Skeleton/Skeleton'

/**
 * Suspense fallback matching Messenger's own loading UI
 * (Recent Messages sidebar skeletons + empty conversation pane).
 */
export default function FactoryChatPageSkeleton() {
  return (
    <div className="h-[calc(100vh-7rem)] min-h-[520px]">
      <div
        className="flex h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-white"
        role="status"
        aria-busy="true"
        aria-label="Loading"
      >
        <span className="sr-only">Loading</span>

        <aside className="flex h-full w-full shrink-0 flex-col border-r border-gray-200 bg-[#F5F5F5] md:w-80 lg:w-96">
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-5">
            <h2 className="text-base font-bold text-[var(--primary-text)]">
              Recent Messages
            </h2>
          </div>
          <div className="flex-1 overflow-hidden px-3 py-3">
            <div className="space-y-3 px-2 py-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="hidden min-w-0 flex-1 md:flex md:items-center md:justify-center">
          <div className="px-6 text-center">
            <p className="text-lg font-semibold text-[var(--primary-text)]">
              Your Messages
            </p>
            <p className="mt-2 text-sm text-[var(--secondary-text)]">
              Select a conversation from the sidebar to start chatting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
