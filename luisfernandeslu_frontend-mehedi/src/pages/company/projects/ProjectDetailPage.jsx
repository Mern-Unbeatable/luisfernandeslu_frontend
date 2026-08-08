import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CompanyProjectDetail from '@/components/data-display/CompanyProjectDetail/CompanyProjectDetail'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import { getCompanyProject } from './data/companyProjectsDemo'

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const project = getCompanyProject(projectId ?? '')

  if (!project) {
    return <NotFoundPage />
  }

  return (
    <CompanyProjectDetail
      project={project}
      page={page}
      pageSize={7}
      onPageChange={setPage}
      onBack={() => navigate('/company/projects')}
      onViewMaterial={(row) =>
        navigate(`/company/projects/${project.id}/materials/${row.id}`)
      }
    />
  )
}
