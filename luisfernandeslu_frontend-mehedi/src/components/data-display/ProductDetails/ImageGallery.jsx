import { useState } from 'react'

export default function ImageGallery({ images = [], alt = 'Product' }) {
  const list = images.length ? images : []
  const [active, setActive] = useState(0)
  const current = list[active] || list[0]

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-sm text-[var(--secondary-text)]">
        No image
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-lg bg-[#F3F4F6]">
        <img
          src={current}
          alt={alt}
          className="aspect-square w-full object-cover"
        />
      </div>
      {list.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {list.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`overflow-hidden rounded-md border-2 bg-[#F3F4F6] transition-colors ${
                active === index
                  ? 'border-[var(--active)]'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={src}
                alt={`${alt} ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
