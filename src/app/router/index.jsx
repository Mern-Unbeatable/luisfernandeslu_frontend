import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '../../layouts/PublicLayout/PublicLayout'
import { routeSeo } from '../../config/seo'

const HomePage = lazy(() => import('../../pages/HomePage'))
const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status">
      <div className="size-8 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
      <span className="sr-only">Loading</span>
    </div>
  )
}

function withSuspense(element) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
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
])

export default router
