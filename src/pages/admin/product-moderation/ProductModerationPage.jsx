import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FiChevronDown } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs'
import Pagination from '@/components/common/Pagination/Pagination'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import {
  ADMIN_MODERATION_PRODUCTS,
  MODERATION_CATEGORIES,
  countModerationByStatus,
  filterModerationProducts,
} from './data/moderationDemo'

const PAGE_SIZE = 8

export default function ProductModerationPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [products, setProducts] = useState(ADMIN_MODERATION_PRODUCTS)
  const [statusTab, setStatusTab] = useState('all')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)

  const counts = useMemo(() => countModerationByStatus(products), [products])

  const statusTabs = useMemo(
    () => [
      {
        id: 'all',
        label: t('adminProductModeration.tabs.all', { count: counts.all }),
      },
      {
        id: 'pending',
        label: t('adminProductModeration.tabs.pending', { count: counts.pending }),
      },
      {
        id: 'accepted',
        label: t('adminProductModeration.tabs.accepted', { count: counts.active }),
      },
      {
        id: 'rejected',
        label: t('adminProductModeration.tabs.rejected', { count: counts.rejected }),
      },
    ],
    [t, counts],
  )

  const filtered = useMemo(
    () => filterModerationProducts(products, { statusTab, category }),
    [products, statusTab, category],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  )

  const updateStatus = (id, nextStatus) => {
    setProducts((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: nextStatus } : row)),
    )
  }

  const handleCardAction = (actionId, row) => {
    if (actionId === 'accept') {
      updateStatus(row.id, 'active')
      return
    }
    if (actionId === 'reject') {
      updateStatus(row.id, 'rejected')
      return
    }
    if (actionId === 'details') {
      navigate(`/admin/product-moderation/${row.id}`)
      return
    }
    if (actionId === 'delete') {
      setProducts((prev) => prev.filter((item) => item.id !== row.id))
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo
        title={t('adminProductModeration.title')}
        description={t('adminProductModeration.subtitle')}
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t('adminProductModeration.title')}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t('adminProductModeration.subtitle')}
        </p>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SegmentedTabs
          standalone
          tabs={statusTabs}
          activeTab={statusTab}
          onTabChange={(id) => {
            setStatusTab(id)
            setPage(1)
          }}
        />

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <span className="text-sm font-medium text-[var(--primary-text)]">
            {t('adminProductModeration.filters.label')}
          </span>
          <label className="relative min-w-[180px]">
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
                setPage(1)
              }}
              className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none transition-colors hover:border-gray-300 focus:border-[var(--active)]"
              aria-label={t('adminProductModeration.filters.label')}
            >
              {MODERATION_CATEGORIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
            <FiChevronDown
              className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[var(--secondary-text)]"
              aria-hidden
            />
          </label>
        </div>
      </div>

      {paged.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-[var(--secondary-text)]">
          {t('adminProductModeration.empty')}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5">
          {paged.map((row) => (
            <ProductCard
              key={row.id}
              type="dashboard"
              role="admin"
              context="approval"
              status={row.status}
              product={row.card}
              onAction={(actionId) => handleCardAction(actionId, row)}
            />
          ))}
        </div>
      )}

      <Pagination
        className="pt-2"
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
        alwaysShow={filtered.length > 0}
      />
    </div>
  )
}
