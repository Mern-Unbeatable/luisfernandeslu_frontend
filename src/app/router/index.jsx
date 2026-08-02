import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '../../layouts/PublicLayout/PublicLayout'
import PageSkeleton from '../../components/common/Skeleton/PageSkeleton'
import { routeSeo } from '../../config/seo'

const HomePage = lazy(() => import('../../pages/HomePage'))
const MessagePage = lazy(() => import('../../pages/MessagePage'))
const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'))

function withSuspense(element) {
  return <Suspense fallback={<PageSkeleton />}>{element}</Suspense>
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
        path: 'message',
        element: withSuspense(<MessagePage />),
        handle: { seo: routeSeo.message },
      },
      {
        path: '*',
        element: withSuspense(<NotFoundPage />),
        handle: { seo: routeSeo.notFound },
      },
    ],
  },
])

export default router
