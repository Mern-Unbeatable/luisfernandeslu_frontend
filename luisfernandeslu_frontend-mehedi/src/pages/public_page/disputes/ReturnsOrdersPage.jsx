import Seo from '@/components/common/Seo/Seo'
import ReturnsOrdersCenter from '@/components/data-display/ReturnsOrdersCenter/ReturnsOrdersCenter'
import {
  RETURN_ORDERS_LIST,
  RETURN_REQUESTS_LIST,
} from '../disputes/data/disputesDemo'

export default function ReturnsOrdersPage() {
  return (
    <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
      <Seo />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ReturnsOrdersCenter
          orders={RETURN_ORDERS_LIST}
          returns={RETURN_REQUESTS_LIST}
        />
      </div>
    </div>
  )
}
