import { useTranslation } from 'react-i18next'
import {
  FiAlertCircle,
  FiBox,
  FiEye,
  FiMapPin,
  FiTrendingUp,
} from 'react-icons/fi'
import DataTable from '@/components/data-display/DataTable/DataTable'
import StatusCard from '@/components/data-display/StatusCard'

export default function CompanyProjectDetail({
  project,
  page = 1,
  pageSize = 10,
  total: totalProp,
  totalPages: totalPagesProp,
  serverPaginated = false,
  isFetching = false,
  onPageChange,
  onViewMaterial,
  onBack,
  className = '',
}) {
  const { t } = useTranslation()
  if (!project) return null

  const total = serverPaginated
    ? (totalProp ?? 0)
    : (project.materials?.length ?? 0)
  const totalPages = serverPaginated
    ? Math.max(1, totalPagesProp ?? 1)
    : Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const clientStart = (safePage - 1) * pageSize
  const visible = serverPaginated
    ? (project.materials ?? [])
    : (project.materials ?? []).slice(clientStart, clientStart + pageSize)
  const showingFrom = serverPaginated
    ? (total ? (safePage - 1) * pageSize + 1 : 0)
    : (total ? clientStart + 1 : 0)
  const showingTo = serverPaginated
    ? Math.min(safePage * pageSize, total)
    : Math.min(clientStart + pageSize, total)

  const columns = [
    {
      key: 'materialName',
      header: t('companyProjects.colMaterial'),
    },
    {
      key: 'orderedQuantity',
      header: t('companyProjects.colOrderedQty'),
    },
    {
      key: 'deliveredValue',
      header: t('companyProjects.colDeliveredValue'),
    },
    {
      key: 'duePayment',
      header: t('companyProjects.colDuePayment'),
    },
    {
      key: 'id',
      header: t('companyProjects.colAction'),
      className: 'text-right',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => onViewMaterial?.(row)}
          aria-label={t('companyProjects.viewMaterial', {
            name: row.materialName,
          })}
          className="inline-flex size-9 items-center justify-center rounded-md border border-gray-200 text-[var(--primary-text)] hover:border-[var(--active)] hover:text-[var(--active)]"
        >
          <FiEye className="size-4" aria-hidden />
        </button>
      ),
    },
  ]

  return (
    <div
      className={[
        className,
        isFetching ? 'opacity-60' : '',
      ].join(' ')}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 text-sm text-[var(--secondary-text)] hover:text-[var(--active)]"
        >
          {t('companyProjects.backToProjects')}
        </button>
      ) : null}

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {project.name}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--secondary-text)]">
          <FiMapPin className="size-4 shrink-0" aria-hidden />
          {project.location}
        </p>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatusCard
          variant="inline"
          label={t('companyProjects.materialTypes')}
          value={project.materialTypes}
          icon={FiBox}
          iconTone="purple"
        />
        <StatusCard
          variant="inline"
          label={t('companyProjects.deliveredValue')}
          value={project.deliveredValue}
          icon={FiTrendingUp}
          iconTone="teal"
        />
        <StatusCard
          variant="status"
          label={t('companyProjects.duePayment')}
          value={project.duePayment}
          tone="danger"
          icon={FiAlertCircle}
        />
      </div>

      <h2 className="mb-4 text-lg font-bold text-[var(--primary-text)]">
        {t('companyProjects.materialTrackingTitle')}
      </h2>

      <DataTable
        columns={columns}
        data={visible}
        showCard
        showPagination
        pagination={{
          page: safePage,
          pageSize,
          total,
          onPageChange,
          summaryLabel: t('companyProjects.showing', {
            from: showingFrom,
            to: showingTo,
            total,
          }),
          previousLabel: t('companyProjects.previous'),
          nextLabel: t('companyProjects.next'),
        }}
      />
    </div>
  )
}
