export default function Skeleton({ className = '' }) {
  return (
    <span
      aria-hidden
      className={`block animate-pulse rounded-md bg-gray-200 ${className}`}
    />
  )
}
