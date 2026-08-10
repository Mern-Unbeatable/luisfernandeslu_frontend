import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiAlertCircle,
  FiDollarSign,
  FiFileText,
  FiTrendingUp,
} from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import Pagination from '@/components/common/Pagination/Pagination'
import ProductCard from '@/components/data-display/ProductCard/ProductCard'
import StatusCard from '@/components/data-display/StatusCard'
import MarketingBoostMeta from './components/MarketingBoostMeta'
import MarketingRequestActions from './components/MarketingRequestActions'
import {
  MARKETING_BOOST_REQUESTS,
  MARKETING_FEATURED_PRODUCTS,
  MARKETING_STATS,
  MARKETING_TABS,
  countMarketingRequests,
  filterMarketingRequests,
} from './data/marketingDemo'

const PAGE_SIZE = 8

function MarketingTabsBar({ tabs, activeTab, onTabChange }) {
  return (
    <div
      className="flex flex-wrap gap-6 border-b border-gray-200"
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange?.(tab.id)}
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'border-[var(--active)] text-[var(--active)]'
                : 'border-transparent text-[var(--secondary-text)] hover:text-[var(--primary-text)]'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function productCardStatus(rowStatus) {
  if (rowStatus === 'pending') return 'pending'
  if (rowStatus === 'active') return 'active'
  return 'completed'
}

export default function MarketingManagementPage() {
  const { t } = useTranslation()
  const [requests, setRequests] = useState(MARKETING_BOOST_REQUESTS)
  const [activeTab, setActiveTab] = useState('all')
  const [requestsPage, setRequestsPage] = useState(1)
  const [featuredPage, setFeaturedPage] = useState(1)

  const counts = useMemo(() => countMarketingRequests(requests), [requests])

  const tabs = useMemo(
    () =>
      MARKETING_TABS.map((tab) => ({
        id: tab.id,
        label: t(tab.labelKey, {
          count:
            tab.id === 'all'
              ? counts.all
              : counts[tab.id] ?? 0,
        }),
      })),
    [t, counts],
  )

  const filteredRequests = useMemo(
    () => filterMarketingRequests(requests, activeTab),
    [requests, activeTab],
  )

  const requestsTotalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / PAGE_SIZE),
  )
  const safeRequestsPage = Math.min(requestsPage, requestsTotalPages)
  const pagedRequests = useMemo(
    () =>
      filteredRequests.slice(
        (safeRequestsPage - 1) * PAGE_SIZE,
        safeRequestsPage * PAGE_SIZE,
      ),
    [filteredRequests, safeRequestsPage],
  )

  const featuredTotalPages = Math.max(
    1,
    Math.ceil(MARKETING_FEATURED_PRODUCTS.length / PAGE_SIZE),
  )
  const safeFeaturedPage = Math.min(featuredPage, featuredTotalPages)
  const pagedFeatured = useMemo(
    () =>
      MARKETING_FEATURED_PRODUCTS.slice(
        (safeFeaturedPage - 1) * PAGE_SIZE,
        safeFeaturedPage * PAGE_SIZE,
      ),
    [safeFeaturedPage],
  )

  const handleRequestAction = (actionId, row) => {
    if (actionId === 'accept') {
      setRequests((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: 'active' } : item,
        ),
      )
      return
    }
    if (actionId === 'reject') {
      setRequests((prev) => prev.filter((item) => item.id !== row.id))
      return
    }
    if (actionId === 'deactivate') {
      setRequests((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: 'completed' } : item,
        ),
      )
      return
    }
    if (actionId === 'delete') {
      setRequests((prev) => prev.filter((item) => item.id !== row.id))
    }
  }

  const statCards = [
    {
      label: t('adminMarketingManagement.stats.totalRevenue'),
      value: MARKETING_STATS.totalRevenue,
      icon: FiDollarSign,
      iconTone: 'brand',
    },
    {
      label: t('adminMarketingManagement.stats.pendingRequests'),
      value: String(counts.pending),
      icon: FiFileText,
      iconTone: 'teal',
    },
    {
      label: t('adminMarketingManagement.stats.activeBoosts'),
      value: String(counts.active),
      icon: FiTrendingUp,
      iconTone: 'purple',
    },
    {
      label: t('adminMarketingManagement.stats.totalFeatured'),
      value: MARKETING_STATS.totalFeatured,
      icon: FiAlertCircle,
      iconTone: 'red',
    },
  ]

  const showPendingMeta = (row) => row.status === 'pending'

  return (
    <div className="space-y-8 sm:space-y-10">
      <Seo
        title={t('adminMarketingManagement.title')}
        description={t('adminMarketingManagement.subtitle')}
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t('adminMarketingManagement.title')}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t('adminMarketingManagement.subtitle')}
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

      <MarketingTabsBar
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
            {t('adminMarketingManagement.pendingBoostTitle')}
          </h2>
          {counts.pending > 0 ? (
            <span className="rounded-full bg-[color-mix(in_srgb,var(--active)_14%,white)] px-3 py-1 text-xs font-semibold text-[var(--active)]">
              {t('adminMarketingManagement.actionRequired')}
            </span>
          ) : null}
        </div>

        {pagedRequests.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-[var(--secondary-text)]">
            {t('adminMarketingManagement.emptyRequests')}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5">
            {pagedRequests.map((row) => (
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
                  onAction={(actionId) => handleRequestAction(actionId, row)}
                />
                {showPendingMeta(row) ? (
                  <>
                    <MarketingBoostMeta
                      boostTier={row.boostTier}
                      duration={row.duration}
                    />
                    <MarketingRequestActions
                      onAccept={() => handleRequestAction('accept', row)}
                      onReject={() => handleRequestAction('reject', row)}
                    />
                  </>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <Pagination
          page={safeRequestsPage}
          totalPages={requestsTotalPages}
          onPageChange={setRequestsPage}
        />
      </section>

      <section className="space-y-5">
        <h2 className="text-lg font-bold text-[var(--primary-text)] sm:text-xl">
          {t('adminMarketingManagement.featuredTitle')}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5">
          {pagedFeatured.map((row) => (
            <ProductCard
              key={row.id}
              type="dashboard"
              role="admin"
              context="promotion"
              status="featured"
              product={row.card}
            />
          ))}
        </div>

        <Pagination
          page={safeFeaturedPage}
          totalPages={featuredTotalPages}
          onPageChange={setFeaturedPage}
        />
      </section>
    </div>
  )
}
