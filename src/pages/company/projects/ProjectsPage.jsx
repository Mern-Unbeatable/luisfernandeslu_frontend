import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CompanyProjectCard from '@/components/data-display/CompanyProjectCard/CompanyProjectCard'
import Pagination from '@/components/common/Pagination/Pagination'
import { useGetCompanyProjectsQuery } from '@/features/company/companyProjectApi'
import { mapCompanyProject } from '@/features/company/companyProjectMappers'

const PAGE_SIZE = 20

export default function ProjectsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetCompanyProjectsQuery({
    page,
    limit: PAGE_SIZE,
  })

  const projects = useMemo(
    () => (data?.projects ?? []).map(mapCompanyProject),
    [data?.projects],
  )

  const pagination = data?.pagination
  const totalPages = Math.max(1, pagination?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const showInitialLoading = isLoading && !data

  return (
    <div>
      <h2 className="mb-6 text-lg font-bold text-[var(--primary-text)] sm:text-xl">
        {t('buyer.projects')}
      </h2>

      {showInitialLoading ? (
        <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
          {t('companyProjects.loading')}
        </p>
      ) : isError ? (
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
      ) : projects.length === 0 ? (
        <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
          {t('companyProjects.empty')}
        </p>
      ) : (
        <>
          <div
            className={[
              'grid grid-cols-1 gap-5 sm:grid-cols-2',
              isFetching ? 'opacity-60' : '',
            ].join(' ')}
          >
            {projects.map((project) => (
              <CompanyProjectCard
                key={project.id}
                project={project}
                onSelect={(row) => navigate(`/company/projects/${row.id}`)}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-6">
              <Pagination
                page={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
