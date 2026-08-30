import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import {
  FiAlertCircle,
  FiDollarSign,
  FiFileText,
  FiTrendingUp,
} from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs'
import Pagination from '@/components/common/Pagination/Pagination'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import StatusCard from '@/components/data-display/StatusCard'
import {
  useGetAdminPromotionsQuery,
  useUpdateAdminPromotionMutation,
} from '@/features/admin/adminPromotionApi'
import { mapAdminPromotion } from '@/features/admin/adminPromotionMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import MarketingBoostMeta from './components/MarketingBoostMeta'
import MarketingRequestActions from './components/MarketingRequestActions'
import MarketingRemoveSponsoredAction from './components/MarketingRemoveSponsoredAction'
import PromotionRejectModal from './components/PromotionRejectModal'
import PromotionPlansSection from './sections/PromotionPlansSection'
import { MARKETING_STATS, MARKETING_TABS } from './data/marketingDemo'

const I18N_KEY = 'adminMarketingManagement'
const PAGE_SIZE = 12

function productCardStatus(rowStatus) {
  if (rowStatus === 'pending') return 'pending'
  if (rowStatus === 'active') return 'active'
  return 'completed'
}

function resolveStatusParam(tabId) {
  if (tabId === 'pending') return 'pending'
  if (tabId === 'active') return 'active'
  if (tabId === 'completed') return 'completed'
  return ''
}

export default function MarketingManagementPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')
  const [requestsPage, setRequestsPage] = useState(1)
  const [featuredPage, setFeaturedPage] = useState(1)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [updatingPromotionId, setUpdatingPromotionId] = useState(null)

  const [updatePromotion] = useUpdateAdminPromotionMutation()

  const statusParam = resolveStatusParam(activeTab)

  useEffect(() => {
    setRequestsPage(1)
  }, [activeTab])

  const {
    data: requestsData,
    isLoading: requestsLoading,
    isError: requestsError,
    error: requestsErrorData,
    isFetching: requestsFetching,
    refetch: refetchRequests,
  } = useGetAdminPromotionsQuery({
    status: statusParam,
    featured: false,
    search: '',
    page: requestsPage,
    limit: PAGE_SIZE,
  })

  const {
    data: featuredData,
    isLoading: featuredLoading,
    isError: featuredError,
    error: featuredErrorData,
    isFetching: featuredFetching,
    refetch: refetchFeatured,
  } = useGetAdminPromotionsQuery({
    status: '',
    featured: true,
    search: '',
    page: featuredPage,
    limit: PAGE_SIZE,
  })

  const { data: pendingCountData } = useGetAdminPromotionsQuery({
    status: 'pending',
    featured: false,
    search: '',
    page: 1,
    limit: 1,
  })

  const { data: activeCountData } = useGetAdminPromotionsQuery({
    status: 'active',
    featured: false,
    search: '',
    page: 1,
    limit: 1,
  })

  const { data: featuredCountData } = useGetAdminPromotionsQuery({
    status: '',
    featured: true,
    search: '',
    page: 1,
    limit: 1,
  })

  const pendingCount = pendingCountData?.pagination?.total ?? 0
  const activeCount = activeCountData?.pagination?.total ?? 0
  const featuredCount = featuredCountData?.pagination?.total ?? 0

  const tabs = useMemo(
    () =>
      MARKETING_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey, {
          count:
            tab.id === 'pending'
              ? pendingCount
              : tab.id === 'active'
                ? activeCount
                : 0,
        }),
      })),
    [t, pendingCount, activeCount],
  )

  const requestRows = useMemo(
    () => (requestsData?.promotions ?? []).map(mapAdminPromotion),
    [requestsData?.promotions],
  )

  const featuredRows = useMemo(
    () => (featuredData?.promotions ?? []).map(mapAdminPromotion),
    [featuredData?.promotions],
  )

  const requestsPagination = requestsData?.pagination
  const requestsTotalPages = Math.max(
    1,
    requestsPagination?.totalPages ?? 1,
  )
  const safeRequestsPage = Math.min(requestsPage, requestsTotalPages)

  useEffect(() => {
    if (requestsPage > requestsTotalPages) {
      setRequestsPage(requestsTotalPages)
    }
  }, [requestsPage, requestsTotalPages])

  const featuredPagination = featuredData?.pagination
  const featuredTotalPages = Math.max(
    1,
    featuredPagination?.totalPages ?? 1,
  )
  const safeFeaturedPage = Math.min(featuredPage, featuredTotalPages)

  useEffect(() => {
    if (featuredPage > featuredTotalPages) {
      setFeaturedPage(featuredTotalPages)
    }
  }, [featuredPage, featuredTotalPages])

  const showRequestsInitialLoading = requestsLoading && !requestsData
  const showFeaturedInitialLoading = featuredLoading && !featuredData

  const statCards = [
    {
      label: t(`${I18N_KEY}.stats.totalRevenue`),
      value: MARKETING_STATS.totalRevenue,
      icon: FiDollarSign,
      iconTone: 'brand',
    },
    {
      label: t(`${I18N_KEY}.stats.pendingRequests`),
      value: String(pendingCount),
      icon: FiFileText,
      iconTone: 'teal',
    },
    {
      label: t(`${I18N_KEY}.stats.activeBoosts`),
      value: String(activeCount),
      icon: FiTrendingUp,
      iconTone: 'purple',
    },
    {
      label: t(`${I18N_KEY}.stats.totalFeatured`),
      value: String(featuredCount),
      icon: FiAlertCircle,
      iconTone: 'red',
    },
  ]

  const showPendingMeta = (row) => row.status === 'pending'

  const handleAccept = useCallback(
    async (row) => {
      setUpdatingPromotionId(row.id)

      try {
        const result = await updatePromotion({
          promotionId: row.id,
          status: 'approved',
        }).unwrap()

        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.actionFailed`)))
          return
        }

        toast.success(result?.message || t(`${I18N_KEY}.approveSuccess`))
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
      } finally {
        setUpdatingPromotionId(null)
      }
    },
    [updatePromotion, t],
  )

  const handleRemoveSponsored = useCallback(
    async (row) => {
      setUpdatingPromotionId(row.id)

      try {
        const result = await updatePromotion({
          promotionId: row.id,
          status: 'removed',
        }).unwrap()

        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.actionFailed`)))
          return
        }

        toast.success(
          result?.message || t(`${I18N_KEY}.removeSponsoredSuccess`, {
            defaultValue: 'Sponsored product removed.',
          }),
        )
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
      } finally {
        setUpdatingPromotionId(null)
      }
    },
    [updatePromotion, t],
  )

  const handleRejectOpen = useCallback((row) => {
    setRejectTarget({
      id: row.id,
      name: row.card.title,
    })
  }, [])

  const canRemoveSponsored = (row) =>
    row.status === 'active' || row.status === 'featured'

  return (
    <div className="space-y-8 sm:space-y-10">
      <Seo
        title={t(`${I18N_KEY}.title`)}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t(`${I18N_KEY}.title`)}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t(`${I18N_KEY}.subtitle`)}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5">
        {statCards.map((card) => (
          <StatusCard
            key={card.label}
            variant="inline"
            label={card.label}
            value={card.value}
            icon={card.icon}
            iconTone={card.iconTone}
          />
        ))}
      </div>

      <PromotionPlansSection />

      <SegmentedTabs
        standalone
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id)
          setRequestsPage(1)
        }}
      />

      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-[var(--primary-text)] sm:text-xl">
            {t(`${I18N_KEY}.pendingBoostTitle`)}
          </h2>
          {pendingCount > 0 ? (
            <span className="rounded-full bg-[color-mix(in_srgb,var(--active)_14%,white)] px-3 py-1 text-xs font-semibold text-[var(--active)]">
              {t(`${I18N_KEY}.actionRequired`)}
            </span>
          ) : null}
        </div>

        {showRequestsInitialLoading ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-[var(--secondary-text)]">
            {t(`${I18N_KEY}.loading`)}
          </p>
        ) : requestsError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
            <p className="text-sm text-red-700">
              {requestsErrorData?.data?.message
                || t(`${I18N_KEY}.loadFailed`)}
            </p>
            <button
              type="button"
              onClick={() => refetchRequests()}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t(`${I18N_KEY}.retry`)}
            </button>
          </div>
        ) : requestRows.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-[var(--secondary-text)]">
            {t(`${I18N_KEY}.emptyRequests`)}
          </p>
        ) : (
          <div
            className={[
              'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5',
              requestsFetching ? 'opacity-60' : '',
            ].join(' ')}
          >
            {requestRows.map((row) => (
              <div
                key={row.id}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <ProductCard
                  className="rounded-none border-0 shadow-none"
                  type="dashboard"
                  role="admin"
                  context="promotion"
                  status={productCardStatus(row.status)}
                  product={row.card}
                  actions={row.status === 'pending' ? [] : undefined}
                />
                {showPendingMeta(row) ? (
                  <>
                    <MarketingBoostMeta
                      boostTier={row.boostTier}
                      duration={row.duration}
                    />
                    <MarketingRequestActions
                      disabled={updatingPromotionId === row.id}
                      onAccept={() => handleAccept(row)}
                      onReject={() => handleRejectOpen(row)}
                    />
                  </>
                ) : canRemoveSponsored(row) ? (
                  <MarketingRemoveSponsoredAction
                    disabled={updatingPromotionId === row.id}
                    onRemove={() => handleRemoveSponsored(row)}
                  />
                ) : null}
              </div>
            ))}
          </div>
        )}

        {!showRequestsInitialLoading && !requestsError && requestRows.length > 0 ? (
          <Pagination
            page={safeRequestsPage}
            totalPages={requestsTotalPages}
            onPageChange={setRequestsPage}
          />
        ) : null}
      </section>

      <section className="space-y-5">
        <h2 className="text-lg font-bold text-[var(--primary-text)] sm:text-xl">
          {t(`${I18N_KEY}.featuredTitle`)}
        </h2>

        {showFeaturedInitialLoading ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-[var(--secondary-text)]">
            {t(`${I18N_KEY}.loading`)}
          </p>
        ) : featuredError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
            <p className="text-sm text-red-700">
              {featuredErrorData?.data?.message
                || t(`${I18N_KEY}.loadFailed`)}
            </p>
            <button
              type="button"
              onClick={() => refetchFeatured()}
              className="mt-3 text-sm font-semibold text-[var(--active)] hover:underline"
            >
              {t(`${I18N_KEY}.retry`)}
            </button>
          </div>
        ) : featuredRows.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-[var(--secondary-text)]">
            {t(`${I18N_KEY}.emptyFeatured`)}
          </p>
        ) : (
          <div
            className={[
              'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5',
              featuredFetching ? 'opacity-60' : '',
            ].join(' ')}
          >
            {featuredRows.map((row) => (
              <div
                key={row.id}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <ProductCard
                  className="rounded-none border-0 shadow-none"
                  type="dashboard"
                  role="admin"
                  context="promotion"
                  status="featured"
                  product={row.card}
                />
                {canRemoveSponsored(row) ? (
                  <MarketingRemoveSponsoredAction
                    disabled={updatingPromotionId === row.id}
                    onRemove={() => handleRemoveSponsored(row)}
                  />
                ) : null}
              </div>
            ))}
          </div>
        )}

        {!showFeaturedInitialLoading && !featuredError && featuredRows.length > 0 ? (
          <Pagination
            page={safeFeaturedPage}
            totalPages={featuredTotalPages}
            onPageChange={setFeaturedPage}
          />
        ) : null}
      </section>

      <PromotionRejectModal
        open={Boolean(rejectTarget)}
        promotion={rejectTarget}
        onClose={() => setRejectTarget(null)}
        onRejected={() => setRejectTarget(null)}
      />
    </div>
  )
}
