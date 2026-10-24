import Skeleton from './Skeleton'
import TableSkeleton from './TableSkeleton'
import { useTranslation } from 'react-i18next'

function LoadingStatus({ className = '', children }) {
  const { t } = useTranslation()
  return (
    <div
      className={className}
      role="status"
      aria-busy="true"
      aria-label={t('ui.loading')}
    >
      <span className="sr-only">{t('ui.loading')}</span>
      {children}
    </div>
  )
}

/** Order cards only — shaped like `BuyerOrderCard`. */
export function BuyerOrderCardsSkeleton({ count = 3 }) {
  return (
    <LoadingStatus className="flex flex-col gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex w-full gap-4 rounded-lg bg-[#F3F4F6] p-4 sm:gap-6 sm:p-5"
        >
          <Skeleton className="size-24 shrink-0 rounded-md bg-gray-300/70 sm:size-28" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-32 bg-gray-300/70" />
              <Skeleton className="h-6 w-20 rounded-full bg-gray-300/70" />
            </div>
            <Skeleton className="h-5 w-3/4 max-w-sm bg-gray-300/70" />
            <Skeleton className="h-4 w-24 bg-gray-300/70" />
            <div className="mt-auto flex justify-end gap-2">
              <Skeleton className="h-9 w-28 rounded-md bg-gray-300/70" />
            </div>
          </div>
        </div>
      ))}
    </LoadingStatus>
  )
}

/** Rows only — shaped like `ProductReviewRow`. */
export function BuyerReviewRowsSkeleton({ count = 3 }) {
  return (
    <LoadingStatus>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-4 border-t border-gray-200 px-4 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(120px,160px)_minmax(140px,180px)] sm:items-center sm:px-6"
        >
          <div className="flex min-w-0 gap-4">
            <Skeleton className="size-20 shrink-0 sm:size-[88px]" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 max-w-xs" />
              <Skeleton className="h-4 w-full max-w-sm" />
            </div>
          </div>
          <Skeleton className="h-4 w-20 sm:mx-auto" />
          <Skeleton className="h-10 w-full rounded-md sm:ml-auto sm:w-[148px]" />
        </div>
      ))}
    </LoadingStatus>
  )
}

/** Project cards only — shaped like `CompanyProjectCard`. */
export function BuyerProjectCardsSkeleton({ count = 4 }) {
  return (
    <LoadingStatus className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="space-y-3 p-5 sm:p-6">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full max-w-xs" />
          </div>
          <div className="border-t border-gray-100 bg-[#F9FAFB] px-5 py-3 sm:px-6">
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      ))}
    </LoadingStatus>
  )
}

function ProjectsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-6 h-7 w-32" />
      <BuyerProjectCardsSkeleton />
    </div>
  )
}

function ProjectDetailSkeleton() {
  return (
    <div className="w-full space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-gray-200 bg-white p-5"
          >
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
      <TableSkeleton />
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <BuyerOrderCardsSkeleton />
    </div>
  )
}

function ReviewsSkeleton() {
  return (
    <div className="w-full space-y-5">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="hidden border-b border-gray-200 bg-[#F3F4F6] px-6 py-3 sm:block">
          <Skeleton className="h-4 w-1/3" />
        </div>
        <BuyerReviewRowsSkeleton />
      </div>
    </div>
  )
}

function OrderDetailSkeleton() {
  return (
    <LoadingStatus className="w-full space-y-5">
      <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 max-w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <div className="mt-8 flex items-center justify-between gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg border border-gray-200 bg-white p-5 sm:p-6"
          >
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </LoadingStatus>
  )
}

function ReviewFormSkeleton() {
  return (
    <LoadingStatus className="w-full space-y-5 rounded-lg border border-gray-200 bg-white p-5 sm:p-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="size-8 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-32 w-full rounded-md" />
      <div className="flex justify-end">
        <Skeleton className="h-11 w-36 rounded-md" />
      </div>
    </LoadingStatus>
  )
}

/** Buyer account outlet — one skeleton per page shape, shared by route Suspense and API loading. */
export default function BuyerSkeleton({ variant = 'dashboard' }) {
  if (variant === 'orders') return <OrdersSkeleton />
  if (variant === 'orderDetail') return <OrderDetailSkeleton />
  if (variant === 'reviews') return <ReviewsSkeleton />
  if (variant === 'reviewForm') return <ReviewFormSkeleton />
  if (variant === 'table') return <TableSkeleton />
  if (variant === 'projects') return <ProjectsSkeleton />
  if (variant === 'projectDetail') return <ProjectDetailSkeleton />

  if (variant === 'placeholder') {
    return (
      <LoadingStatus className="rounded-sm border border-gray-200 bg-white p-6 sm:p-8">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      </LoadingStatus>
    )
  }

  return (
    <LoadingStatus className="flex flex-col gap-8">
      <div className="space-y-3">
        <Skeleton className="h-6 w-64 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-sm border border-gray-300 bg-white px-3 py-8 sm:min-h-40 sm:gap-4 sm:px-6 sm:py-10"
          >
            <Skeleton className="size-9 rounded-full sm:size-12" />
            <Skeleton className="h-4 w-16 sm:h-5 sm:w-24" />
          </div>
        ))}
      </div>
    </LoadingStatus>
  )
}
