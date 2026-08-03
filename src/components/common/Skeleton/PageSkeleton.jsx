import Skeleton from './Skeleton'

/** Generic content block — default page fallback (not a data table). */
export default function PageSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-lg" />
      <Skeleton className="h-4 w-full max-w-md" />
      <Skeleton className="mt-6 h-40 w-full rounded-xl" />
    </div>
  )
}
