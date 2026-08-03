import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Seo from '../../components/common/Seo/Seo'
import AuctionDetails, {
  DEMO_AUCTION_DETAILS_ACTIVE,
  DEMO_AUCTION_DETAILS_ASSIGNED,
} from '../../components/data-display/AuctionDetails'
import { getRoleBasePath } from '../../roles'

/** Panel page — auction details (supplier / factory). */
export default function AuctionDetailsPage() {
  const navigate = useNavigate()
  const role = useSelector((state) => state.auth.user?.role) || 'supplier'
  const formRole = role === 'factory' ? 'factory' : 'supplier'
  const base = getRoleBasePath(formRole)

  // Demo: show assigned for factory, active for supplier until API is wired
  const auction =
    formRole === 'factory'
      ? DEMO_AUCTION_DETAILS_ASSIGNED
      : DEMO_AUCTION_DETAILS_ACTIVE
  const status = auction.status

  return (
    <div className="w-full">
      <Seo titleKey="auction.details.nav" />
      <AuctionDetails
        role={formRole}
        status={status}
        auction={auction}
        onBack={() => navigate(`${base}/auction`)}
      />
    </div>
  )
}
