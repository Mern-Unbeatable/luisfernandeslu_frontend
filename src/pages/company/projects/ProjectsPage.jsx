import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CompanyProjectCard from '@/components/data-display/CompanyProjectCard/CompanyProjectCard'
import { COMPANY_PROJECTS_LIST } from './data/companyProjectsDemo'

export default function ProjectsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div>
      <h2 className="mb-6 text-lg font-bold text-[var(--primary-text)] sm:text-xl">
        {t('buyer.projects')}
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {COMPANY_PROJECTS_LIST.map((project) => (
          <CompanyProjectCard
            key={project.id}
            project={project}
            onSelect={(row) => navigate(`/company/projects/${row.id}`)}
          />
        ))}
      </div>
    </div>
  )
}
