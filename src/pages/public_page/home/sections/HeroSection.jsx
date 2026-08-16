import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
const HERO_AUTOPLAY_MS = 6000

const FEATURE_ICONS = {
  package: FiPackage,
  trophy: FiAward,
  card: FiCreditCard,
  headset: FiHeadphones,
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}

function HeroFeatureIcon({ name }) {
  const Icon = FEATURE_ICONS[name] ?? FiPackage
  return <Icon className="size-8 shrink-0 text-[#6B7280]" strokeWidth={1.5} aria-hidden />
}

function slideCopy(t, slideId) {
  const base = `home.hero.slides.${slideId}`
  const titleLines = t(`${base}.titleLines`, { returnObjects: true })
  return {
    badge: t(`${base}.badge`),
    titleLines: Array.isArray(titleLines) ? titleLines : [titleLines],
    description: t(`${base}.description`),
    ctaLabel: t(`${base}.ctaLabel`),
  }
}

function HeroSlidePanel({ slide, copy, isActive }) {
  const TitleTag = isActive ? 'h1' : 'div'

  return (
    <article
      className="relative shrink-0 grow-0 basis-full pb-10 sm:min-h-0 sm:h-95 sm:pb-0 lg:h-120"
      aria-hidden={!isActive}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.image})` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/80 via-black/70 to-black/40 sm:to-black/30"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col px-6 pt-6 sm:h-full sm:justify-center sm:px-12 sm:pb-16 sm:pt-8 lg:pl-20 lg:pr-24">
        <div className="flex flex-col sm:min-h-0 sm:flex-1 sm:justify-center">
          <span
            className="mb-2 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 font-['Barlow',sans-serif] text-[11px] font-semibold leading-none text-white sm:mb-4 sm:px-4 sm:py-1.5 sm:text-sm sm:font-bold"
            style={{ backgroundColor: HERO_BADGE_BG }}
          >
            {copy.badge}
          </span>

          <TitleTag className="font-['Barlow',sans-serif] text-[26px] font-black leading-[1.12] text-white sm:text-5xl lg:text-[72px] lg:leading-[79.2px]">
            {copy.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </TitleTag>

          <p className="mt-3 max-w-[520px] font-['Barlow',sans-serif] text-sm leading-snug text-white sm:mt-4 sm:text-base sm:leading-relaxed lg:text-lg">
            {copy.description}
          </p>

          <Link
            to={slide.ctaTo}
            className="mt-5 inline-flex w-fit items-center rounded-full px-6 py-2.5 font-['Barlow',sans-serif] text-sm font-bold leading-none text-white transition-opacity hover:opacity-90 sm:mt-7 sm:px-8 sm:py-3.5 sm:text-base lg:mt-8"
            style={{ backgroundColor: HERO_CTA_BG }}
            tabIndex={isActive ? undefined : -1}
          >
            {copy.ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function HeroSection() {
  const { t } = useTranslation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverPaused, setHoverPaused] = useState(false)
  const [hiddenPaused, setHiddenPaused] = useState(false)
  const slideCount = HERO_SLIDES.length

  const goToSlide = useCallback(
    (index) => {
      setActiveIndex(((index % slideCount) + slideCount) % slideCount)
    },
    [slideCount],
  )

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1)
  }, [activeIndex, goToSlide])

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1)
  }, [activeIndex, goToSlide])

  useEffect(() => {
    const onVisibility = () => {
      setHiddenPaused(document.visibilityState !== 'visible')
    }
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || hoverPaused || hiddenPaused || slideCount <= 1) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount)
    }, HERO_AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [
    activeIndex,
    hiddenPaused,
    hoverPaused,
    prefersReducedMotion,
    slideCount,
  ])

  return (
    <section className="w-full bg-[#FEF5E7] pb-4 pt-5 sm:pt-6 ">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-lg"
            onMouseEnter={() => setHoverPaused(true)}
            onMouseLeave={() => setHoverPaused(false)}
            onFocusCapture={() => setHoverPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setHoverPaused(false)
              }
            }}
            aria-roledescription="carousel"
            aria-label={t('home.hero.carouselLabel', { defaultValue: 'Featured offers' })}
          >
            <div
              className={[
                'hero-slide-track flex',
                prefersReducedMotion ? 'hero-slide-track-reduced' : '',
              ].join(' ')}
              style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
            >
              {HERO_SLIDES.map((item, index) => (
                <HeroSlidePanel
                  key={item.id}
                  slide={item}
                  copy={slideCopy(t, item.id)}
                  isActive={index === activeIndex}
                />
              ))}
            </div>

            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 lg:bottom-6">
              {HERO_SLIDES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={t('home.hero.goToSlide', { n: index + 1 })}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  onClick={() => goToSlide(index)}
                  className={[
                    'size-2.5 rounded-full transition-[transform,background-color] duration-300',
                    index === activeIndex
                      ? 'scale-110 bg-[#FFB020]'
                      : 'bg-white/90 hover:bg-white',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goPrev}
            aria-label={t('home.hero.prevSlide')}
            className="absolute top-1/2 left-0 z-30 hidden size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--primary-text)] shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition hover:bg-gray-50 sm:inline-flex"
          >
            <FiChevronLeft className="size-6" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={t('home.hero.nextSlide')}
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
                    {t(`home.hero.features.${feature.id}.title`)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--secondary-text)]">
                    {t(`home.hero.features.${feature.id}.subtitle`)}
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
