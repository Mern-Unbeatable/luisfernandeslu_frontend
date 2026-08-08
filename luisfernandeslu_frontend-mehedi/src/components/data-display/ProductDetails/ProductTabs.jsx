import { useState } from 'react'

function DescriptionPanel({ product }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <h3 className="mb-3 text-base font-bold text-[var(--primary-text)]">
          Description
        </h3>
        <div className="space-y-3 text-sm leading-relaxed text-[var(--secondary-text)]">
          {(product.descriptionParagraphs || [product.description])
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-base font-bold text-[var(--primary-text)]">
          Feature
        </h3>
        <ul className="space-y-2.5 text-sm text-[var(--secondary-text)]">
          {(product.features || []).map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--active)]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PlainTextPanel({ text, paragraphs }) {
  const lines = paragraphs?.length
    ? paragraphs
    : text
      ? [text]
      : []

  if (!lines.length) {
    return (
      <p className="text-sm text-[var(--secondary-text)]">
        No information available.
      </p>
    )
  }

  return (
    <div className="space-y-3 text-sm leading-relaxed text-[var(--secondary-text)]">
      {lines.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}

function KeyValueGrid({ items = [], columns = 2 }) {
  if (!items.length) {
    return (
      <p className="text-sm text-[var(--secondary-text)]">No information available.</p>
    )
  }

  return (
    <div
      className={`grid gap-x-10 gap-y-4 ${
        columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'
      }`}
    >
      {items.map((item) => (
        <div key={item.label} className="text-sm">
          <span className="font-semibold text-[var(--primary-text)]">
            {item.label}:{' '}
          </span>
          <span className="text-[var(--secondary-text)]">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function ReviewPanel({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <p className="text-sm text-[var(--secondary-text)]">No reviews yet.</p>
    )
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-md border border-gray-100 bg-gray-50/60 px-4 py-3"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[var(--primary-text)]">
              {review.author}
            </p>
            <span className="text-xs text-[var(--active)]">
              {review.rating} ★
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {review.text}
          </p>
        </li>
      ))}
    </ul>
  )
}

export default function ProductTabs({ tabs = [], product = {}, defaultTab }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  const renderContent = () => {
    switch (active) {
      case 'description':
        return <DescriptionPanel product={product} />
      case 'additional':
        return (
          <PlainTextPanel
            text={product.additionalText}
            paragraphs={product.additionalParagraphs}
          />
        )
      case 'specification':
        return (
          <PlainTextPanel
            text={product.specificationText}
            paragraphs={product.specificationParagraphs}
          />
        )
      case 'review':
        return <ReviewPanel reviews={product.reviews || []} />
      case 'supplier':
        return (
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-base font-bold text-[var(--primary-text)]">
                Supplier
              </h3>
              <KeyValueGrid
                items={product.supplierDetails || []}
                columns={1}
              />
            </div>
            <div>
              <h3 className="mb-4 text-base font-bold text-[var(--primary-text)]">
                Business Info
              </h3>
              <KeyValueGrid
                items={product.supplierBusiness || []}
                columns={1}
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto overscroll-x-contain border-b border-gray-200 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full justify-start gap-0.5 px-3 sm:justify-center sm:gap-1 sm:px-4">
          {tabs.map((tab) => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`shrink-0 border-b-2 px-2.5 py-3 text-[11px] font-semibold tracking-wide whitespace-nowrap uppercase transition-colors sm:px-4 sm:py-3.5 sm:text-sm ${
                  isActive
                    ? 'border-[var(--active)] text-[var(--active)]'
                    : 'border-transparent text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="p-4 sm:p-6">{renderContent()}</div>
    </div>
  )
}
