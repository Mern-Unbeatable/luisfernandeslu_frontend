import HeroSection from './home/sections/HeroSection'
import SponsoredProductsSection from './home/sections/SponsoredProductsSection'
import TopSellingProductsSection from './home/sections/TopSellingProductsSection'
import AffiliateCtaSection from './home/sections/AffiliateCtaSection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <SponsoredProductsSection />
      <TopSellingProductsSection />
      <AffiliateCtaSection />
    </div>
  )
}
