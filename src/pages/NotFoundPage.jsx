import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold text-ink-500">404</h1>
      <p className="text-ink-300 text-sm md:text-base">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
      >
        Back to Home
      </Link>
    </section>
  )
}
