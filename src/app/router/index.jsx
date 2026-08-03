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
import {
  PANEL_ROLE_IDS,
  BUYER_ROLE_IDS,
  getBuyerRoleConfig,
  getPanelRoleConfig,
  buildNavChildren,
} from '../../roles'
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
const AuctionBoardPage = lazy(
  () => import('../../pages/panel/AuctionBoardPage'),
)
const RoleSelectPage = lazy(() => import('../../pages/auth/RoleSelectPage'))
const LoginPage = lazy(() => import('../../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../../pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(
  () => import('../../pages/auth/ForgotPasswordPage'),
)
const OtpVerificationPage = lazy(
  () => import('../../pages/auth/OtpVerificationPage'),
)
const ResetPasswordPage = lazy(
  () => import('../../pages/auth/ResetPasswordPage'),
)

function withSuspense(element, fallback = <PageSkeleton />) {
  return <Suspense fallback={fallback}>{element}</Suspense>
}

function useAuthLogout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  return () => {
    dispatch(logout())
    navigate(user?.role === 'admin' ? '/admin/login' : '/login', {
      replace: true,
    })
  }
}

function BuyerShell() {
  const user = useSelector((state) => state.auth.user)
  const onLogout = useAuthLogout()
  const role = BUYER_ROLE_IDS.includes(user?.role) ? user.role : 'company'

  return (
    <BuyerLayout
      role={role}
      userName={user?.name?.split(' ')[0] || 'User'}
      onLogout={onLogout}
    />
  )
}

function PanelShell() {
  const user = useSelector((state) => state.auth.user)
  const onLogout = useAuthLogout()
  const role = PANEL_ROLE_IDS.includes(user?.role) ? user.role : 'supplier'

  return (
    <PanelLayout
      role={role}
      userName={user?.name || 'User'}
      onLogout={onLogout}
    />
  )
}

function isAuctionNavItem(item) {
  return (
    typeof item?.to === 'string' &&
    (item.to.endsWith('/auction') || item.to.endsWith('/auction-board'))
  )
}

function panelPage(item) {
  if (isAuctionNavItem(item)) {
    return {
      element: withSuspense(<AuctionBoardPage />, <PanelSkeleton />),
      handle: {
        seo: {
          titleKey: item.labelKey,
          descriptionKey: 'seo.panelDescription',
        },
      },
    }
  }

  return {
    element: withSuspense(
      <ComingSoonPage titleKey={item.labelKey} />,
      <PanelSkeleton />,
    ),
    handle: {
      seo: {
        titleKey: item.labelKey,
        descriptionKey: 'seo.panelDescription',
      },
    },
  }
}

function buyerChildren(roleConfig) {
  const base = roleConfig.basePath
  return [
    {
      index: true,
      element: withSuspense(<BuyerDashboardPage />, <BuyerSkeleton />),
      handle: { seo: routeSeo.buyerDashboard },
    },
    ...roleConfig.nav
      .filter((item) => item.to !== base)
      .map((item) => {
        const path = item.to.replace(new RegExp(`^${base}/`), '')
        return {
          path,
          element: withSuspense(
            <BuyerPlaceholderPage titleKey={item.labelKey} />,
            <BuyerSkeleton variant="placeholder" />,
          ),
          handle: { seo: routeSeo.buyerDashboard },
        }
      }),
    // Affiliates card may not be in nav — keep route for cards
    ...(roleConfig.dashboardCards || [])
      .filter(
        (card) =>
          !roleConfig.nav.some((n) => n.to === card.to) &&
          card.to !== base,
      )
      .map((card) => ({
        path: card.to.replace(new RegExp(`^${base}/`), ''),
        element: withSuspense(
          <BuyerPlaceholderPage titleKey={card.labelKey} />,
          <BuyerSkeleton variant="placeholder" />,
        ),
        handle: { seo: routeSeo.buyerDashboard },
      })),
  ]
}

const buyerRouteTrees = BUYER_ROLE_IDS.map((roleId) => {
  const config = getBuyerRoleConfig(roleId)
  return {
    element: <ProtectedRoute allowedRoles={[roleId]} />,
    children: [
      {
        path: config.basePath,
        element: <BuyerShell />,
        children: buyerChildren(config),
      },
    ],
  }
})

const panelRouteTrees = PANEL_ROLE_IDS.map((roleId) => {
  const config = getPanelRoleConfig(roleId)
  return {
    element: (
      <ProtectedRoute
        allowedRoles={[roleId]}
        redirectTo={roleId === 'admin' ? '/admin/login' : '/login'}
      />
    ),
    children: [
      {
        path: config.basePath,
        element: <PanelShell />,
        children: buildNavChildren(config, panelPage),
      },
    ],
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
            path: 'signup/:role',
            element: withSuspense(<RegisterPage />, <AuthSkeleton />),
            handle: { seo: routeSeo.signup },
          },
          {
            path: 'admin/login',
            element: withSuspense(<LoginPage />, <AuthSkeleton />),
            handle: { seo: routeSeo.login },
          },
          {
            path: 'login',
            element: withSuspense(<RoleSelectPage />, <AuthSkeleton />),
            handle: { seo: routeSeo.login },
          },
          {
            path: 'login/:role',
            element: withSuspense(<LoginPage />, <AuthSkeleton />),
            handle: { seo: routeSeo.login },
          },
          {
            path: 'forgot-password',
            element: withSuspense(<ForgotPasswordPage />, <AuthSkeleton />),
            handle: { seo: routeSeo.forgotPassword },
          },
          {
            path: 'forgot-password/otp',
            element: withSuspense(<OtpVerificationPage />, <AuthSkeleton />),
            handle: { seo: routeSeo.forgotPassword },
          },
          {
            path: 'forgot-password/reset',
            element: withSuspense(<ResetPasswordPage />, <AuthSkeleton />),
            handle: { seo: routeSeo.forgotPassword },
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
  ...buyerRouteTrees,
  ...panelRouteTrees,
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
