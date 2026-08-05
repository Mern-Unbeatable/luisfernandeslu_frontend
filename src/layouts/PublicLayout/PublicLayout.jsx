import { Outlet } from 'react-router-dom'
import Header from './Header'
import CategoryBar from './CategoryBar'
import Footer from './Footer'
import Seo from '../../components/common/Seo/Seo'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Seo />
      <Header />
      <CategoryBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
