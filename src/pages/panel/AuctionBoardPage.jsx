import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Seo from '../../components/common/Seo/Seo'
import AuctionCard, {
  DEMO_AUCTION_CREATED,
  DEMO_AUCTION_ASSIGNED,
  DEMO_AUCTION_LIVE,
} from '../../components/data-display/AuctionCard'

/**
 * Role-aware auction board preview using the shared AuctionCard.
 * supplier/factory → created + assigned
 * transporter → live bidding
 * admin → competing bids
 */
export default function AuctionBoardPage() {
  const { t } = useTranslation()
  const role = useSelector((state) => state.auth.user?.role) || 'supplier'

  const titleKey =
    role === 'admin'
      ? 'panel.nav.auction'
      : role === 'transporter'
        ? 'panel.nav.auctionBoard'
        : 'panel.nav.auction'

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Seo titleKey={titleKey} />
      <h1 className="mb-6 text-2xl font-bold text-[var(--primary-text)]">
        {t(titleKey)}
      </h1>

      <div className="flex flex-col gap-5">
        {(role === 'supplier' || role === 'factory') && (
          <>
            <AuctionCard
              role={role}
              status="open"
              auction={DEMO_AUCTION_CREATED}
              onViewDetails={() => {}}
            />
            <AuctionCard
              role={role}
              status="assigned"
              auction={DEMO_AUCTION_ASSIGNED}
              onViewDetails={() => {}}
            />
          </>
        )}

        {role === 'transporter' && (
          <AuctionCard
            role="transporter"
            auction={DEMO_AUCTION_LIVE}
            onPlaceBid={() => {}}
          />
        )}

        {role === 'admin' && (
          <AuctionCard role="admin" auction={DEMO_AUCTION_LIVE} />
        )}
      </div>
    </div>
  )
}
