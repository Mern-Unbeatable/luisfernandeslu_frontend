import Seo from '@/components/common/Seo/Seo'
import { useTranslation } from 'react-i18next'
import PromotionPlansSkeleton from '@/components/common/Skeleton/PromotionPlansSkeleton'
import PromotionPlansSection from '../marketing-management/sections/PromotionPlansSection'
import { useGetAdminPromotionPlansQuery } from '@/features/admin/adminPromotionPlanApi'

const I18N = 'adminMarketingManagement.promotionPlans'

export default function PromotionPlansPage() {
  const { t } = useTranslation()
  const { isLoading, isFetching, data } = useGetAdminPromotionPlansQuery()
  const showSkeleton = isLoading && !data

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo
        title={t(`${I18N}.sectionTitle`)}
        description={t(`${I18N}.sectionSubtitle`)}
      />
      {showSkeleton ? (
        <PromotionPlansSkeleton asPage />
      ) : (
        <div className={isFetching ? 'opacity-90 transition-opacity' : ''}>
          <PromotionPlansSection asPage />
        </div>
      )}
    </div>
  )
}
