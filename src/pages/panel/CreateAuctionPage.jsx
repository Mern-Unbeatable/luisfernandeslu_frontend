import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Seo from '../../components/common/Seo/Seo'
import CreateAuction from '../../components/forms/CreateAuction'
import { getRoleBasePath } from '../../roles'

/** Panel page — create auction (supplier / factory). */
export default function CreateAuctionPage() {
  const navigate = useNavigate()
  const role = useSelector((state) => state.auth.user?.role) || 'supplier'
  const formRole = role === 'factory' ? 'factory' : 'supplier'
  const base = getRoleBasePath(formRole)

  return (
    <div className="w-full">
      <Seo titleKey="auction.create.title" />
      <CreateAuction
        role={formRole}
        onBack={() => navigate(base)}
        onSubmit={(payload) => {
          console.log('create auction', formRole, payload)
          navigate(`${base}/auction`)
        }}
      />
    </div>
  )
}
