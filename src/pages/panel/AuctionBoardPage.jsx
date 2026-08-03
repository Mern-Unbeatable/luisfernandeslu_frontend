import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Seo from '../../components/common/Seo/Seo'
import AuctionCard, {
  DEMO_AUCTION_CREATED,
  DEMO_AUCTION_ASSIGNED,
  DEMO_AUCTION_LIVE,
} from '../../components/data-display/AuctionCard'
import { getRoleBasePath } from '../../roles'

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

  const canCreate = role === 'supplier' || role === 'factory'

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Seo titleKey={titleKey} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          {t(titleKey)}
        </h1>
        {canCreate ? (
          <Link
            to={`${getRoleBasePath(role)}/create-auction`}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--active)] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t('auction.create.nav')}
          </Link>
        ) : null}
      </div>

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
