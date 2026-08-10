import { Outlet } from 'react-router-dom'
import Header from '../shared/Header'
import CategoryBar from '../shared/CategoryBar'
import Footer from '../shared/Footer'
import ConstructionAssistantWidget from '../../components/common/ConstructionAssistant/ConstructionAssistantWidget'
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
      <ConstructionAssistantWidget />
    </div>
  )
}
