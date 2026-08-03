import { Suspense, lazy } from 'react'
import { createBrowserRouter, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PublicLayout from '../../layouts/PublicLayout/PublicLayout'
import BuyerLayout from '../../layouts/BuyerLayout/BuyerLayout'
import PanelLayout from '../../layouts/PanelLayout/PanelLayout'
import AuthLayout from '../../layouts/AuthLayout/AuthLayout'
import PageSkeleton from '../../components/common/Skeleton/PageSkeleton'
import AuthSkeleton from '../../components/common/Skeleton/AuthSkeleton'
import BuyerSkeleton from '../../components/common/Skeleton/BuyerSkeleton'
import PanelSkeleton from '../../components/common/Skeleton/PanelSkeleton'
import HomeSkeleton from '../../components/common/Skeleton/HomeSkeleton'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import { routeSeo } from '../../config/seo'
import { getAllPanelNavItems, PANEL_ROLE_IDS } from '../../roles'
import { logout } from '../../features/auth/authSlice'

const HomePage = lazy(() => import('../../pages/HomePage'))
const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'))
const BuyerDashboardPage = lazy(
  () => import('../../pages/buyer/BuyerDashboardPage'),
)
const BuyerPlaceholderPage = lazy(
  () => import('../../pages/buyer/BuyerPlaceholderPage'),
)
const ComingSoonPage = lazy(() => import('../../pages/panel/ComingSoonPage'))
const RoleSelectPage = lazy(() => import('../../pages/auth/RoleSelectPage'))
const LoginPage = lazy(() => import('../../pages/auth/LoginPage'))

function withSuspense(element, fallback = <PageSkeleton />) {
  return <Suspense fallback={fallback}>{element}</Suspense>
}

function BuyerShell() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const role = user?.role === 'customer' ? 'customer' : 'company'

  return (
    <BuyerLayout
      role={role}
      userName={user?.name?.split(' ')[0] || 'User'}
      onLogout={() => {
        dispatch(logout())
        navigate('/login', { replace: true })
      }}
    />
  )
}

function PanelShell() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const role = PANEL_ROLE_IDS.includes(user?.role) ? user.role : 'supplier'

  return (
    <PanelLayout
      role={role}
      userName={user?.name || 'User'}
      onLogout={() => {
        dispatch(logout())
        navigate('/login', { replace: true })
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
      <PanelSkeleton />,
    ),
    handle: { seo: routeSeo.panel },
  }
})

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'signup',
            element: withSuspense(<RoleSelectPage />, <AuthSkeleton />),
            handle: { seo: routeSeo.signup },
          },
          {
            path: 'login',
            element: withSuspense(<LoginPage />, <AuthSkeleton />),
            handle: { seo: routeSeo.login },
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: withSuspense(<HomePage />, <HomeSkeleton />),
        handle: { seo: routeSeo.home },
      },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={['customer', 'company']} />
    ),
    children: [
      {
        path: '/account',
        element: <BuyerShell />,
        children: [
          {
            index: true,
            element: withSuspense(
              <BuyerDashboardPage />,
              <BuyerSkeleton />,
            ),
            handle: { seo: routeSeo.buyerDashboard },
          },
          {
            path: 'orders',
            element: withSuspense(
              <BuyerPlaceholderPage titleKey="buyer.orders" />,
              <BuyerSkeleton variant="placeholder" />,
            ),
            handle: { seo: routeSeo.buyerOrders },
          },
          {
            path: 'projects',
            element: withSuspense(
              <BuyerPlaceholderPage titleKey="buyer.projects" />,
              <BuyerSkeleton variant="placeholder" />,
            ),
            handle: { seo: routeSeo.buyerProjects },
          },
          {
            path: 'product-to-review',
            element: withSuspense(
              <BuyerPlaceholderPage titleKey="buyer.productToReview" />,
              <BuyerSkeleton variant="placeholder" />,
            ),
            handle: { seo: routeSeo.buyerProductToReview },
          },
          {
            path: 'profile',
            element: withSuspense(
              <BuyerPlaceholderPage titleKey="buyer.account" />,
              <BuyerSkeleton variant="placeholder" />,
            ),
            handle: { seo: routeSeo.buyerAccount },
          },
          {
            path: 'affiliates',
            element: withSuspense(
              <BuyerPlaceholderPage titleKey="buyer.affiliates" />,
              <BuyerSkeleton variant="placeholder" />,
            ),
            handle: { seo: routeSeo.buyerAffiliates },
          },
        ],
      },
    ],
  },
  {
    element: (
      <ProtectedRoute
        allowedRoles={[
          'supplier',
          'factory',
          'transporter',
          'affiliate',
          'admin',
        ]}
      />
    ),
    children: [
      {
        path: '/panel',
        element: <PanelShell />,
        children: panelChildren,
      },
    ],
  },
  {
    path: '*',
    element: <PublicLayout />,
    children: [
      {
        path: '*',
        element: withSuspense(<NotFoundPage />),
        handle: { seo: routeSeo.notFound },
      },
    ],
  },
])

export default router
