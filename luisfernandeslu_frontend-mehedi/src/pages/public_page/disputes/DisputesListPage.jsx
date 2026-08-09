import { useNavigate } from 'react-router-dom'
import Seo from '@/components/common/Seo/Seo'
import DisputesCenter from '@/components/data-display/DisputesCenter/DisputesCenter'
import {
  DISPUTES_LIST,
  DISPUTES_STATS,
  DISPUTE_ORDER_OPTIONS,
} from './data/disputesDemo'

export default function DisputesListPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full bg-white py-8 sm:py-10 lg:py-12">
      <Seo />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DisputesCenter
          stats={DISPUTES_STATS}
          disputes={DISPUTES_LIST}
          orderOptions={DISPUTE_ORDER_OPTIONS}
          onOpenDispute={(row) => navigate(`/dispute-resolution/${row.id}`)}
          onCreateDispute={() => navigate('/dispute-resolution/disp-001')}
        />
      </div>
    </div>
  )
}
