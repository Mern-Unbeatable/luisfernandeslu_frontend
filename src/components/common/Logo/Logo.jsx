import { Link } from 'react-router-dom'

export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      className={`inline-flex shrink-0 items-center ${className}`}
      aria-label="CONSTRUPRECO home"
    >
      <img
        src="/logo.png"
        alt="CONSTRUPRECO"
        width={80}
        height={53}
        className="h-10 w-auto md:h-12 lg:h-14"
        decoding="async"
      />
    </Link>
  )
}
