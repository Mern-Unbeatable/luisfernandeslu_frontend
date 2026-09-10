import Seo from '@/components/common/Seo/Seo'
import { useTranslation } from 'react-i18next'
import PromotionPlansSection from '../marketing-management/sections/PromotionPlansSection'

const I18N = 'adminMarketingManagement.promotionPlans'

export default function PromotionPlansPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo
        title={t(`${I18N}.sectionTitle`)}
        description={t(`${I18N}.sectionSubtitle`)}
      />
      <PromotionPlansSection asPage />
    </div>
  )
}
