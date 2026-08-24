import Skeleton from "@/components/common/Skeleton/Skeleton";

export default function ProductCardSkeleton({ className = "" }) {
  return (
    <article
      className={[
        "flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white",
        className,
      ].join(" ")}
      role="status"
      aria-busy="true"
      aria-label="Loading product card"
    >
      <span className="sr-only">Loading</span>

      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
        <Skeleton className="size-full rounded-none" />
        <Skeleton className="absolute top-2.5 left-2.5 h-5 w-16 rounded px-2 py-0.5" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/5" />

        <div className="mt-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </article>
  );
}
