import { useLayoutEffect } from 'react'
import HeroSection from './home/sections/HeroSection'
import SponsoredProductsSection from './home/sections/SponsoredProductsSection'
import TopSellingProductsSection from './home/sections/TopSellingProductsSection'
import AffiliateCtaSection from './home/sections/AffiliateCtaSection'

export default function HomePage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  return (
    <div>
      <HeroSection />
      <SponsoredProductsSection />
      <TopSellingProductsSection />
      <AffiliateCtaSection />
    </div>
  )
}
