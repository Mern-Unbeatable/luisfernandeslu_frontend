import { Suspense, lazy } from 'react'
import { createBrowserRouter, useSearchParams } from 'react-router-dom'
import PublicLayout from '../../layouts/PublicLayout/PublicLayout'
import BuyerLayout from '../../layouts/BuyerLayout/BuyerLayout'
import PageSkeleton from '../../components/common/Skeleton/PageSkeleton'
import { routeSeo } from '../../config/seo'

const HomePage = lazy(() => import('../../pages/HomePage'))
const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'))
const BuyerDashboardPage = lazy(
  () => import('../../pages/buyer/BuyerDashboardPage'),
)
const BuyerPlaceholderPage = lazy(
  () => import('../../pages/buyer/BuyerPlaceholderPage'),
)

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
])

export default router
