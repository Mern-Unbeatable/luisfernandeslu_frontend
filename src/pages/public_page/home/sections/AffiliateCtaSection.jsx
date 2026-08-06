import { Link } from 'react-router-dom'

export default function AffiliateCtaSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/cta.png)' }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/75" aria-hidden />

      <div className="relative container mx-auto flex flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <h2 className="max-w-3xl text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          It transforms sharing into gains.
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-white/90 sm:text-base">
          Share your affiliate code and earn a 5% commission on every sale.
        </p>
        <Link
          to="/signup/affiliate"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-(--active) px-8 py-3 text-sm font-semibold text-white transition-colors hover:brightness-95 sm:text-base"
        >
          Register For the Program
        </Link>
      </div>
    </section>
  )
}
