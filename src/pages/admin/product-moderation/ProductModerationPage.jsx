import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiChevronDown } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs'
import Pagination from '@/components/common/Pagination/Pagination'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import { useGetCategoriesQuery } from '@/features/supplier/inventory/inventoryApi'
import {
  useDeleteAdminProductMutation,
  useGetAdminProductsQuery,
  useModerateAdminProductMutation,
} from '@/features/admin/adminProductApi'
import {
  mapAdminModerationCard,
  toAdminProductStatusParam,
} from '@/features/admin/adminProductMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

const PAGE_SIZE = 8
const I18N = 'adminProductModeration'

export default function ProductModerationPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const panelBase = pathname.startsWith('/moderator') ? '/moderator' : '/admin'

  const [statusTab, setStatusTab] = useState('all')
  const [categoryId, setCategoryId] = useState('all')
  const [page, setPage] = useState(1)

  const { data: categoriesData } = useGetCategoriesQuery()
  const categories = useMemo(() => {
    if (Array.isArray(categoriesData)) return categoriesData
    if (Array.isArray(categoriesData?.categories)) return categoriesData.categories
    return []
  }, [categoriesData])

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminProductsQuery({
    status: toAdminProductStatusParam(statusTab),
    categoryId: categoryId === 'all' ? '' : categoryId,
    page,
    limit: PAGE_SIZE,
  })

  const [moderateProduct] = useModerateAdminProductMutation()
  const [deleteProduct] = useDeleteAdminProductMutation()

  const products = useMemo(
    () => (data?.products ?? []).map(mapAdminModerationCard),
    [data?.products],
  )

  const counts = data?.counts || {
    all: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  }

  const pagination = data?.pagination
  const totalPages = Math.max(1, pagination?.totalPages ?? 1)
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const statusTabs = useMemo(
    () => [
      {
        id: 'all',
        label: t(`${I18N}.tabs.all`, { count: counts.all }),
      },
      {
        id: 'pending',
        label: t(`${I18N}.tabs.pending`, { count: counts.pending }),
      },
      {
        id: 'accepted',
        label: t(`${I18N}.tabs.accepted`, { count: counts.accepted }),
      },
      {
        id: 'rejected',
        label: t(`${I18N}.tabs.rejected`, { count: counts.rejected }),
      },
    ],
    [t, counts],
  )

  const categoryOptions = useMemo(
    () => [
      {
        value: 'all',
        label: t(`${I18N}.filters.allCategories`),
      },
      ...categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    ],
    [categories, t],
  )

  const handleCardAction = async (actionId, row) => {
    try {
      if (actionId === 'accept') {
        await moderateProduct({
          productId: row.id,
          status: 'approved',
        }).unwrap()
        toast.success(t(`${I18N}.approveSuccess`, { defaultValue: 'Product approved.' }))
        return
      }
      if (actionId === 'reject') {
        await moderateProduct({
          productId: row.id,
          status: 'rejected',
        }).unwrap()
        toast.success(t(`${I18N}.rejectSuccess`, { defaultValue: 'Product rejected.' }))
        return
      }
      if (actionId === 'details') {
        navigate(`${panelBase}/product-moderation/${row.id}`)
        return
      }
      if (actionId === 'delete') {
        await deleteProduct(row.id).unwrap()
        toast.success(t(`${I18N}.deleteSuccess`, { defaultValue: 'Product deleted.' }))
      }
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N}.actionFailed`, { defaultValue: 'Action failed.' })))
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Seo
        title={t(`${I18N}.title`)}
        description={t(`${I18N}.subtitle`)}
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t(`${I18N}.title`)}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t(`${I18N}.subtitle`)}
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
            {t(`${I18N}.filters.label`)}
          </span>
          <label className="relative min-w-[180px]">
            <select
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value)
                setPage(1)
              }}
              className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none transition-colors hover:border-gray-300 focus:border-[var(--active)]"
              aria-label={t(`${I18N}.filters.label`)}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>
            {getAuthErrorMessage(
              error,
              t(`${I18N}.loadFailed`, { defaultValue: 'Could not load products.' }),
            )}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t(`${I18N}.retry`, { defaultValue: 'Try again' })}
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-[var(--secondary-text)]">
          {t(`${I18N}.loading`, { defaultValue: 'Loading products…' })}
        </p>
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-[var(--secondary-text)]">
          {t(`${I18N}.empty`)}
        </p>
      ) : (
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5 ${
            isFetching ? 'opacity-70' : ''
          }`}
        >
          {products.map((row) => (
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
        alwaysShow={(pagination?.total ?? 0) > 0}
      />
    </div>
  )
}
