import { FiStar } from 'react-icons/fi'

export default function SellerCard({ seller = {}, variant = 'store' }) {
  const name = seller.name || 'Store'
  const avatar = seller.avatar
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center gap-3">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="size-11 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-[var(--primary-text)]">
          {initials}
        </div>
      )}

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--primary-text)]">
          {name}
        </p>
        {variant === 'supplier' ? (
          <div className="mt-0.5 space-y-0.5 text-xs text-[var(--secondary-text)]">
            {seller.email ? <p className="truncate">{seller.email}</p> : null}
            {seller.phone ? <p>{seller.phone}</p> : null}
          </div>
        ) : (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-[var(--secondary-text)]">
            {seller.rating != null ? (
              <>
                <FiStar className="size-3.5 fill-[var(--active)] text-[var(--active)]" />
                <span>
                  {seller.rating}
                  {seller.reviewCount != null
                    ? ` ( ${seller.reviewCount} reviews )`
                    : ''}
                </span>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
