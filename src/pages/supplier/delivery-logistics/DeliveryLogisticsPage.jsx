import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import AuctionCard from '@/components/data-display/AuctionCard'
import AuctionDetails from '@/components/data-display/AuctionDetails'
import CreateAuction from '@/components/forms/CreateAuction'
import {
  DEMO_AUCTION_ASSIGNED,
  DEMO_AUCTION_CREATED,
  DEMO_AUCTION_DETAILS_ACTIVE,
  DEMO_AUCTION_DETAILS_ASSIGNED,
  DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS,
} from '@/data/demoData'

const ACTIVE_AUCTIONS = [
  DEMO_AUCTION_CREATED,
  {
    id: 'auc-ord-003',
    orderId: 'ORD-2026-003',
    pickupLocation: '450 Factory Rd, Phoenix, AZ',
    customerName: 'Maria Garcia',
    deliveryLocation: '88 Harbor Way, San Diego, CA',
    productName: 'Portland Cement - 500 Bags',
    status: 'open',
  },
  {
    id: 'auc-ord-004',
    orderId: 'ORD-2026-004',
    pickupLocation: 'Ambuja Cement Factory, Kalyan',
    customerName: 'Metro Construction',
    deliveryLocation: 'Metro Construction Site, Andheri West',
    productName: 'Premium Portland Cement',
    status: 'open',
  },
  {
    id: 'auc-ord-007',
    orderId: 'ORD-2026-007',
    pickupLocation: '2200 Quarry Lane, Tucson, AZ',
    customerName: 'Daniel Wright',
    deliveryLocation: '15 Desert View Blvd, Tucson, AZ',
    productName: 'Crushed Stone Aggregate',
    status: 'open',
  },
]

const ASSIGNED_DELIVERIES = [
  DEMO_AUCTION_ASSIGNED,
  {
    id: 'auc-ord-005',
    orderId: 'ORD-2026-005',
    productName: 'Steel Rebar Bundle',
    pickupLocation: '2100 Industrial Park, Austin, TX',
    deliveryLocation: '77 Riverside Ave, Austin, TX',
    assignedTransporter: 'RoadRunner Freight',
    bidPrice: 3200,
    status: 'assigned',
  },
  {
    id: 'auc-ord-006',
    orderId: 'ORD-2026-006',
    productName: 'Ready-Mix Concrete Load',
    pickupLocation: '12 Batch Plant Rd, Denver, CO',
    deliveryLocation: '900 Civic Center, Denver, CO',
    assignedTransporter: 'HaulMaster Inc.',
    bidPrice: 1850,
    status: 'assigned',
  },
  {
    id: 'auc-ord-012',
    orderId: 'ORD-2026-012',
    productName: 'Glass Facade Panels',
    pickupLocation: '45 Glass Works, Boston, MA',
    deliveryLocation: '800 Harbor Point, Boston, MA',
    assignedTransporter: 'FastShip Logistics',
    bidPrice: 5600,
    status: 'assigned',
  },
]

function buildDetailsAuction(auction) {
  const isAssigned = auction.status === 'assigned'

  if (isAssigned) {
    return {
      ...DEMO_AUCTION_DETAILS_ASSIGNED,
      id: auction.id,
      orderId: auction.orderId,
      pickupLocation: auction.pickupLocation,
      product: {
        ...DEMO_AUCTION_DETAILS_ASSIGNED.product,
        name: auction.productName,
      },
      customer: {
        ...DEMO_AUCTION_DETAILS_ASSIGNED.customer,
        deliveryAddress: auction.deliveryLocation,
      },
      shipping: {
        ...DEMO_AUCTION_DETAILS_ASSIGNED.shipping,
        pickupLocation: auction.pickupLocation,
      },
      transporter: {
        ...DEMO_AUCTION_DETAILS_ASSIGNED.transporter,
        name: auction.assignedTransporter || 'Swift Transport Co.',
        bidAmount:
          auction.bidPrice != null
            ? `$${Number(auction.bidPrice).toLocaleString()}`
            : DEMO_AUCTION_DETAILS_ASSIGNED.transporter.bidAmount,
      },
    }
  }

  return {
    ...DEMO_AUCTION_DETAILS_ACTIVE,
    id: auction.id,
    orderId: auction.orderId,
    pickupLocation: auction.pickupLocation,
    product: {
      ...DEMO_AUCTION_DETAILS_ACTIVE.product,
      name: auction.productName,
    },
    customer: {
      ...DEMO_AUCTION_DETAILS_ACTIVE.customer,
      name: auction.customerName || DEMO_AUCTION_DETAILS_ACTIVE.customer.name,
      deliveryAddress: auction.deliveryLocation,
    },
    shipping: {
      ...DEMO_AUCTION_DETAILS_ACTIVE.shipping,
      pickupLocation: auction.pickupLocation,
    },
  }
}

export default function DeliveryLogisticsPage() {
  const { t } = useTranslation()
  const [activeAuctions, setActiveAuctions] = useState(ACTIVE_AUCTIONS)
  const [assignedDeliveries] = useState(ASSIGNED_DELIVERIES)
  const [view, setView] = useState('list')
  const [selectedAuction, setSelectedAuction] = useState(null)

  const openDetails = (auction) => {
    setSelectedAuction(auction)
    setView('details')
  }

  const closeView = () => {
    setSelectedAuction(null)
    setView('list')
  }

  const handleCreateSubmit = (form) => {
    const next = {
      id: `auc-ord-${Date.now()}`,
      orderId:
        form.orderId ||
        `ORD-2026-${String(activeAuctions.length + 10).padStart(3, '0')}`,
      pickupLocation: form.pickupLocation || form.deliveryAddress || '—',
      customerName: form.customerName || '—',
      deliveryLocation: form.deliveryAddress || '—',
      productName: form.productName || '—',
      status: 'open',
    }
    setActiveAuctions((prev) => [next, ...prev])
    setView('list')
  }

  if (view === 'create') {
    return (
      <>
        <Seo title={t('supplierDeliveryLogistics.startAuctionTitle')} />
        <CreateAuction
          role="supplier"
          placeholders={DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS}
          onBack={closeView}
          onSubmit={handleCreateSubmit}
        />
      </>
    )
  }

  if (view === 'details' && selectedAuction) {
    const isAssigned = selectedAuction.status === 'assigned'

    return (
      <>
        <Seo
          title={
            isAssigned
              ? t('supplierDeliveryLogistics.assignedDetailTitle')
              : t('supplierDeliveryLogistics.activeDetailTitle')
          }
        />
        <AuctionDetails
          role="supplier"
          status={isAssigned ? 'assigned' : 'active'}
          auction={buildDetailsAuction(selectedAuction)}
          onBack={closeView}
        />
      </>
    )
  }

  return (
    <>
      <Seo title={t('supplierDeliveryLogistics.title')} />
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--primary-text)]">
              {t('supplierDeliveryLogistics.title')}
            </h1>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {t('supplierDeliveryLogistics.subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setView('create')}
            className="inline-flex items-center justify-center rounded-full bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
          >
            {t('supplierDeliveryLogistics.startAuction')}
          </button>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-text)]">
              {t('supplierDeliveryLogistics.activeAuctions.title')}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {t('supplierDeliveryLogistics.activeAuctions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {activeAuctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                role="supplier"
                status="open"
                auction={auction}
                onViewDetails={openDetails}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-text)]">
              {t('supplierDeliveryLogistics.assignedDeliveries.title')}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {t('supplierDeliveryLogistics.assignedDeliveries.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {assignedDeliveries.map((auction) => (
              <AuctionCard
                key={auction.id}
                role="supplier"
                status="assigned"
                auction={auction}
                onViewDetails={openDetails}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
