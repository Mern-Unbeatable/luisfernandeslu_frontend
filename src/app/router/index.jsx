import { Suspense, lazy } from 'react'
import { createBrowserRouter, Outlet, useNavigate } from 'react-router-dom'
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
import ScrollToTop from '../../components/common/ScrollToTop/ScrollToTop'
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

const HomePage = lazy(() => import('../../pages/public_page/HomePage'))
const DeveloperPage = lazy(() => import('../../pages/public_page/DeveloperPage'))
const NotFoundPage = lazy(() => import('../../pages/public_page/NotFoundPage'))
const ComingSoonPage = lazy(() => import('../../pages/shared/ComingSoonPage'))
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

/** Eager map of role page modules: `../../pages/<role>/<segment>/<Name>Page.jsx` */
const rolePageModules = import.meta.glob(
  '../../pages/{customer,company,supplier,factory,transporter,affiliate,admin}/**/*Page.jsx',
)

function toPascal(segment) {
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/** Index routes live under dashboard/ (affiliate: overview-dashboard/). */
function indexSegmentForRole(roleId) {
  return roleId === 'affiliate' ? 'overview-dashboard' : 'dashboard'
}

/**
 * Resolve a lazy page for a role + relative nav segment.
 * @param {string} roleId
 * @param {string|undefined} relativeSegment — undefined for index/dashboard
 */
function lazyRolePage(roleId, relativeSegment) {
  const segment = relativeSegment || indexSegmentForRole(roleId)
  const key = `../../pages/${roleId}/${segment}/${toPascal(segment)}Page.jsx`
  const loader = rolePageModules[key]
  if (!loader) {
    throw new Error(`Missing role page module: ${key}`)
  }
  return lazy(loader)
}

function withSuspense(element, fallback = <PageSkeleton />) {
  return <Suspense fallback={fallback}>{element}</Suspense>
}

/** Root shell: scroll-to-top on navigation for every route tree. */
function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
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

function panelPage(roleId) {
  return (item) => {
    const config = getPanelRoleConfig(roleId)
    const base = config.basePath
    const isIndex = item.end || item.to === base
    const relative = isIndex
      ? undefined
      : item.to.replace(new RegExp(`^${base}/?`), '')
    const Page = lazyRolePage(roleId, relative)

    return {
      element: withSuspense(<Page />, <PanelSkeleton />),
      handle: {
        seo: {
          titleKey: item.labelKey,
          descriptionKey: 'seo.panelDescription',
        },
      },
    }
  }
}

function buyerChildren(roleConfig) {
  const base = roleConfig.basePath
  const roleId = roleConfig.id
  const DashboardPage = lazyRolePage(roleId)

  return [
    {
      index: true,
      element: withSuspense(<DashboardPage />, <BuyerSkeleton />),
      handle: { seo: routeSeo.buyerDashboard },
    },
    ...roleConfig.nav
      .filter((item) => item.to !== base)
      .map((item) => {
        const path = item.to.replace(new RegExp(`^${base}/`), '')
        const Page = lazyRolePage(roleId, path)
        return {
          path,
          element: withSuspense(<Page />, <BuyerSkeleton variant="placeholder" />),
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
      .map((card) => {
        const path = card.to.replace(new RegExp(`^${base}/`), '')
        const Page = lazyRolePage(roleId, path)
        return {
          path,
          element: withSuspense(
            <Page />,
            <BuyerSkeleton variant="placeholder" />,
          ),
          handle: { seo: routeSeo.buyerDashboard },
        }
      }),
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
        children: [
          ...buildNavChildren(config, panelPage(roleId)),
          // Any unlisted panel path → Coming Soon
          {
            path: '*',
            element: withSuspense(<ComingSoonPage />, <PanelSkeleton />),
            handle: {
              seo: {
                titleKey: 'panel.nav.dashboard',
                descriptionKey: 'seo.panelDescription',
              },
            },
          },
        ],
      },
    ],
  }
})

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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
      {
        path: '/developer',
        element: withSuspense(<DeveloperPage />, <PageSkeleton />),
      },
      {
        path: '/developer/:componentId',
        element: withSuspense(<DeveloperPage />, <PageSkeleton />),
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
    ],
  },
])

export default router
