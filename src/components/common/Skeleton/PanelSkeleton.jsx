import Skeleton from './Skeleton'

/** Panel outlet — coming-soon style card. */
export default function PanelSkeleton() {
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
      <div className="mx-auto flex flex-col items-center gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
