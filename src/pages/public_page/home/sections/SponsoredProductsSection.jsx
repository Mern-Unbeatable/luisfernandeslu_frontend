import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import { resolveStorefrontBuyerRole } from '@/features/auth/resolveStorefrontBuyerRole'
import {
  SPONSORED_PRODUCTS,
  SPONSORED_PRODUCTS_PAGE_SIZE,
} from '../data/sponsoredProducts'

function CarouselNavButton({ direction, disabled, onClick }) {
  const isPrev = direction === 'prev'
  const Icon = isPrev ? FiChevronLeft : FiChevronRight

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? 'Previous sponsored products' : 'Next sponsored products'}
      className={[
        'inline-flex size-10 items-center justify-center rounded-full transition-opacity',
        isPrev
          ? 'bg-[#FDEACC] text-[var(--primary-text)] hover:brightness-95'
          : 'bg-[var(--active)] text-[var(--primary-text)] hover:brightness-95',
        disabled ? 'cursor-not-allowed opacity-40' : '',
      ].join(' ')}
    >
      <Icon className="size-5" strokeWidth={2.5} aria-hidden />
    </button>
  )
}

export default function SponsoredProductsSection() {
  const [page, setPage] = useState(0)
  const user = useSelector((state) => state.auth.user)
  const listingRole = resolveStorefrontBuyerRole(user)

  const totalPages = Math.max(
    1,
    Math.ceil(SPONSORED_PRODUCTS.length / SPONSORED_PRODUCTS_PAGE_SIZE),
  )

  const visibleProducts = useMemo(() => {
    const start = page * SPONSORED_PRODUCTS_PAGE_SIZE
    return SPONSORED_PRODUCTS.slice(start, start + SPONSORED_PRODUCTS_PAGE_SIZE)
  }, [page])

  const goPrev = () => setPage((current) => Math.max(0, current - 1))
  const goNext = () =>
    setPage((current) => Math.min(totalPages - 1, current + 1))

  return (
    <section className="w-full bg-[#FEF5E7] py-10 sm:py-12">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-[var(--primary-text)] sm:mb-8 sm:text-2xl">
          Sponsored Products
        </h2>

        <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {visibleProducts.map((product) => (
            <li key={product.id} className="flex min-w-0">
              <Link
                to={`/products/${product.slug}`}
                className="flex min-w-0 flex-1 transition-opacity hover:opacity-95"
              >
                <ProductCard
                  type="sponsored"
                  role={listingRole}
                  tag="sponsored"
                  product={product}
                  className="h-full w-full"
                />
              </Link>
            </li>
          ))}
        </ul>

        {totalPages > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10">
            <CarouselNavButton
              direction="prev"
              disabled={page === 0}
              onClick={goPrev}
            />
            <CarouselNavButton
              direction="next"
              disabled={page >= totalPages - 1}
              onClick={goNext}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
