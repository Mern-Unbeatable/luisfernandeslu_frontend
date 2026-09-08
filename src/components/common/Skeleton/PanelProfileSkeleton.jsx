import Skeleton from '@/components/common/Skeleton/Skeleton'

/**
 * Skeleton loader for PanelProfile screens (Admin, Transporter, Factory, Supplier, etc.)
 */
export default function PanelProfileSkeleton({ showWarehouses = false, showIban = true }) {
  return (
    <div
      className="w-full space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      {/* Header Skeleton */}
      <header className="mb-6 space-y-2 sm:mb-8">
        <Skeleton className="h-9 w-48 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </header>

      {/* Main Account & Password Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 space-y-8">
        {/* User Info / Avatar Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="size-16 shrink-0 rounded-full sm:size-[72px]" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>

        {/* Account Information Section */}
        <div className="border-t border-gray-100 pt-6 space-y-5">
          <Skeleton className="h-5 w-44" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-11 w-32 rounded-md" />
          </div>
        </div>

        {/* Change Password Section */}
        <div className="border-t border-gray-100 pt-6 space-y-5">
          <Skeleton className="h-5 w-36" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-11 w-36 rounded-md" />
          </div>
        </div>

        {showWarehouses ? (
          <div className="border-t border-gray-100 pt-6 space-y-5">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={`warehouse-${i}`}
                  className="rounded-xl border border-gray-100 p-4 space-y-3"
                >
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-11 w-36 rounded-md" />
            </div>
          </div>
        ) : null}
      </section>

      {/* IBAN Card Skeleton */}
      {showIban ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 space-y-5">
          <Skeleton className="h-5 w-48" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-11 w-28 rounded-md" />
          </div>
        </section>
      ) : null}
    </div>
  )
}
