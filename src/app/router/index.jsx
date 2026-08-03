import { Suspense, lazy } from 'react'
import { createBrowserRouter, useSearchParams } from 'react-router-dom'
import PublicLayout from '../../layouts/PublicLayout/PublicLayout'
import BuyerLayout from '../../layouts/BuyerLayout/BuyerLayout'
import PanelLayout from '../../layouts/PanelLayout/PanelLayout'
import PageSkeleton from '../../components/common/Skeleton/PageSkeleton'
import { routeSeo } from '../../config/seo'
import {
  PANEL_ROLE_IDS,
  getAllPanelNavItems,
} from '../../roles'

const HomePage = lazy(() => import('../../pages/HomePage'))
const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'))
const BuyerDashboardPage = lazy(
  () => import('../../pages/buyer/BuyerDashboardPage'),
)
const BuyerPlaceholderPage = lazy(
  () => import('../../pages/buyer/BuyerPlaceholderPage'),
)
const ComingSoonPage = lazy(() => import('../../pages/panel/ComingSoonPage'))

function withSuspense(element) {
  return <Suspense fallback={<PageSkeleton />}>{element}</Suspense>
}

/** Demo: /account?role=customer | /account?role=company (default). Later: from auth. */
function BuyerShell() {
  const [params] = useSearchParams()
  const role = params.get('role') === 'customer' ? 'customer' : 'company'

  return (
    <BuyerLayout
      role={role}
      onLogout={() => {
        console.log('buyer logout', role)
      }}
    />
  )
}

/**
 * Demo roles via query:
 * /panel?role=supplier|factory|transporter|affiliate|admin
 * Later: role from auth.
 */
function PanelShell() {
  const [params] = useSearchParams()
  const roleParam = params.get('role')
  const role = PANEL_ROLE_IDS.includes(roleParam) ? roleParam : 'supplier'

  return (
    <PanelLayout
      role={role}
      userName="Atik Adnan"
      onLogout={() => {
        console.log('panel logout', role)
      }}
    />
  )
}

const panelChildren = getAllPanelNavItems().map((item) => {
  const isIndex = item.to === '/panel'
  const path = isIndex ? undefined : item.to.replace(/^\/panel\/?/, '')

  return {
    ...(isIndex ? { index: true } : { path }),
    element: withSuspense(
      <ComingSoonPage titleKey={item.labelKey} />,
    ),
    handle: { seo: routeSeo.panel },
  }
})

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: withSuspense(<HomePage />),
        handle: { seo: routeSeo.home },
      },
      {
        path: '*',
        element: withSuspense(<NotFoundPage />),
        handle: { seo: routeSeo.notFound },
      },
    ],
  },
  {
    path: '/account',
    element: <BuyerShell />,
    children: [
      {
        index: true,
        element: withSuspense(<BuyerDashboardPage />),
        handle: { seo: routeSeo.buyerDashboard },
      },
      {
        path: 'orders',
        element: withSuspense(
          <BuyerPlaceholderPage titleKey="buyer.orders" />,
        ),
        handle: { seo: routeSeo.buyerOrders },
      },
      {
        path: 'projects',
        element: withSuspense(
          <BuyerPlaceholderPage titleKey="buyer.projects" />,
        ),
        handle: { seo: routeSeo.buyerProjects },
      },
      {
        path: 'product-to-review',
        element: withSuspense(
          <BuyerPlaceholderPage titleKey="buyer.productToReview" />,
        ),
        handle: { seo: routeSeo.buyerProductToReview },
      },
      {
        path: 'profile',
        element: withSuspense(
          <BuyerPlaceholderPage titleKey="buyer.account" />,
        ),
        handle: { seo: routeSeo.buyerAccount },
      },
      {
        path: 'affiliates',
        element: withSuspense(
          <BuyerPlaceholderPage titleKey="buyer.affiliates" />,
        ),
        handle: { seo: routeSeo.buyerAffiliates },
      },
    ],
  },
  {
    path: '/panel',
    element: <PanelShell />,
    children: panelChildren,
  },
])

export default router
