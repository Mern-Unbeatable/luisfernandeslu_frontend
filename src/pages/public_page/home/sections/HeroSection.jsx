import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiAward,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiHeadphones,
  FiPackage,
} from 'react-icons/fi'
import { HERO_FEATURES, HERO_SLIDES } from '../data/heroSlides'

/** Figma: badge = saturated orange; CTA = golden amber (both pill, white bold text). */
const HERO_BADGE_BG = '#F64C00'
const HERO_CTA_BG = '#FFB020'

const FEATURE_ICONS = {
  package: FiPackage,
  trophy: FiAward,
  card: FiCreditCard,
  headset: FiHeadphones,
}

function HeroFeatureIcon({ name }) {
  const Icon = FEATURE_ICONS[name] ?? FiPackage
  return <Icon className="size-8 shrink-0 text-[#6B7280]" strokeWidth={1.5} aria-hidden />
}

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const slide = HERO_SLIDES[activeIndex]
  const slideCount = HERO_SLIDES.length

  const goTo = (index) => {
    if (index < 0) setActiveIndex(slideCount - 1)
    else if (index >= slideCount) setActiveIndex(0)
    else setActiveIndex(index)
  }

  return (
    <section className="w-full bg-[#FEF5E7] pb-4 pt-5 sm:pt-6 ">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg sm:h-95 lg:h-120">
            {HERO_SLIDES.map((item, index) => (
              <div
                key={item.id}
                className={[
                  'absolute inset-0 bg-cover bg-center transition-opacity duration-500',
                  index === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0',
                ].join(' ')}
                style={{ backgroundImage: `url(${item.image})` }}
                aria-hidden={index !== activeIndex}
              />
            ))}

            <div
              className="absolute inset-0 bg-linear-to-r from-black/80 via-black/70 to-black/40 sm:from-black/80 sm:via-black/70 sm:to-black/40"
              aria-hidden
            />

            <div className="relative z-10 flex flex-col px-6 pt-6 pb-5 sm:absolute sm:inset-0 sm:justify-center sm:px-12 sm:pb-14 sm:pt-8 lg:pl-20 lg:pr-24 lg:pb-16">
              <div className="flex flex-col sm:min-h-0 sm:flex-1 sm:justify-center">
                <span
                  className="mb-2 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 font-['Barlow',sans-serif] text-[11px] font-semibold leading-none text-white sm:mb-4 sm:px-4 sm:py-1.5 sm:text-sm sm:font-bold"
                  style={{ backgroundColor: HERO_BADGE_BG }}
                >
                  {slide.badge}
                </span>

                <h1 className="font-['Barlow',sans-serif] text-[26px] font-black leading-[1.12] text-white sm:text-5xl lg:text-[72px] lg:leading-[79.2px]">
                  {slide.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>

                <p className="mt-3 max-w-[520px] font-['Barlow',sans-serif] text-sm leading-snug text-white sm:mt-4 sm:text-base sm:leading-relaxed lg:text-lg">
                  {slide.description}
                </p>

                <Link
                  to={slide.ctaTo}
                  className="mt-5 inline-flex w-fit items-center rounded-full px-6 py-2.5 font-['Barlow',sans-serif] text-sm font-bold leading-none text-white transition-opacity hover:opacity-90 sm:mt-7 sm:px-8 sm:py-3.5 sm:text-base lg:mt-8"
                  style={{ backgroundColor: HERO_CTA_BG }}
                >
                  {slide.ctaLabel}
                </Link>
              </div>

              <div className="mt-4 flex shrink-0 justify-center gap-2.5 sm:mt-0 sm:hidden">
                {HERO_SLIDES.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    onClick={() => goTo(index)}
                    className={[
                      'size-2.5 rounded-full transition-colors',
                      index === activeIndex ? 'bg-[#FFB020]' : 'bg-white',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>

            <div className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2.5 sm:flex lg:bottom-6">
              {HERO_SLIDES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  onClick={() => goTo(index)}
                  className={[
                    'size-2.5 rounded-full transition-colors',
                    index === activeIndex ? 'bg-[#FFB020]' : 'bg-white',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>

          {/* Half on hero, half on cream — centered on left/right edges */}
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous slide"
            className="absolute top-1/2 left-0 z-30 hidden size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--primary-text)] shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition hover:bg-gray-50 sm:inline-flex"
          >
            <FiChevronLeft className="size-6" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next slide"
            className="absolute top-1/2 right-0 z-30 hidden size-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--primary-text)] shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition hover:bg-gray-50 sm:inline-flex"
          >
            <FiChevronRight className="size-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white lg:mt-5">
          <ul className="flex flex-col divide-y divide-gray-200 lg:flex-row lg:divide-x lg:divide-y-0">
            {HERO_FEATURES.map((feature) => (
              <li
                key={feature.id}
                className="flex flex-1 items-center gap-4 px-6 py-5 sm:px-8 sm:py-6"
              >
                <HeroFeatureIcon name={feature.icon} />
                <div className="min-w-0 font-['Barlow',sans-serif]">
                  <p className="text-xs font-bold tracking-wide text-[var(--primary-text)]">
                    {feature.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--secondary-text)]">
                    {feature.subtitle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
