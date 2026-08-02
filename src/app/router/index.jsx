import { createBrowserRouter } from 'react-router-dom'
import App from '../../App'
import PublicLayout from '../../layouts/PublicLayout/PublicLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
    ],
  },
])

export default router