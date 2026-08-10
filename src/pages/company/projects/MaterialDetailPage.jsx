import { useNavigate, useParams } from 'react-router-dom'
import CompanyMaterialDetail from '@/components/data-display/CompanyMaterialDetail/CompanyMaterialDetail'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import { getCompanyMaterialDetail } from './data/companyProjectsDemo'

export default function MaterialDetailPage() {
  const { projectId, materialId } = useParams()
  const navigate = useNavigate()
  const material = getCompanyMaterialDetail(projectId ?? '', materialId ?? '')

  if (!material) {
    return <NotFoundPage />
  }

  return (
    <CompanyMaterialDetail
      material={material}
      showPay
      onBack={() => navigate(`/company/projects/${projectId}`)}
      onPayNow={() => {}}
      onCancelInstallment={() => {}}
    />
  )
}
