import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CompanyMaterialDetail from '@/components/data-display/CompanyMaterialDetail/CompanyMaterialDetail'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import { useGetCompanyProjectOrderByIdQuery } from '@/features/company/companyProjectApi'
import { mapCompanyProjectOrderDetail } from '@/features/company/companyProjectMappers'

export default function MaterialDetailPage() {
  const { projectId, materialId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCompanyProjectOrderByIdQuery(
    {
      projectId: projectId ?? '',
      orderId: materialId ?? '',
    },
    { skip: !projectId || !materialId },
  )

  const material = useMemo(() => mapCompanyProjectOrderDetail(data), [data])

  if (isLoading && !data) {
    return (
      <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
        {t('companyProjects.loading')}
      </p>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
        <p className="text-sm text-red-700">
          {error?.data?.message || t('companyProjects.loadFailed')}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
        >
          {t('companyProjects.retry')}
        </button>
      </div>
    )
  }

  if (!material) {
    return <NotFoundPage />
  }

  return (
    <CompanyMaterialDetail
      material={material}
      showPay={material.installments?.some((item) => item.canPayNow)}
      onBack={() => navigate(`/company/projects/${projectId}`)}
      onChatDriver={() => navigate('/messages')}
      onPayNow={() => {}}
      onCancelInstallment={() => {}}
    />
  )
}
