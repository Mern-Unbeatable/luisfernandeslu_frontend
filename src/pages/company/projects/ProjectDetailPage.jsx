import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CompanyProjectDetail from '@/components/data-display/CompanyProjectDetail/CompanyProjectDetail'
import NotFoundPage from '@/pages/public_page/NotFoundPage'
import { useGetCompanyProjectByIdQuery } from '@/features/company/companyProjectApi'
import { mapCompanyProjectDetail } from '@/features/company/companyProjectMappers'

const PAGE_SIZE = 20

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [page, setPage] = useState(1)

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetCompanyProjectByIdQuery(
    {
      projectId: projectId ?? '',
      page,
      limit: PAGE_SIZE,
    },
    { skip: !projectId },
  )

  const project = useMemo(() => mapCompanyProjectDetail(data), [data])

  const pagination = data?.pagination
  const total = pagination?.total ?? project?.materials?.length ?? 0
  const totalPages = Math.max(1, pagination?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

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

  if (!project) {
    return <NotFoundPage />
  }

  return (
    <CompanyProjectDetail
      project={project}
      page={safePage}
      pageSize={PAGE_SIZE}
      total={total}
      totalPages={totalPages}
      serverPaginated
      isFetching={isFetching}
      onPageChange={setPage}
      onBack={() => navigate('/company/projects')}
      onViewMaterial={(row) =>
        navigate(`/company/projects/${project.id}/materials/${row.id}`)
      }
    />
  )
}
