import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AuctionCard from '@/components/data-display/AuctionCard'
import AuctionDetails from '@/components/data-display/AuctionDetails'
import CreateAuction from '@/components/forms/CreateAuction'
import Pagination from '@/components/common/Pagination/Pagination'
import {
  DEMO_AUCTION_ASSIGNED,
  DEMO_AUCTION_CREATED,
  DEMO_AUCTION_DETAILS_ACTIVE,
  DEMO_AUCTION_DETAILS_ASSIGNED,
  DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS,
} from '@/data/demoData'

const PAGE_SIZE = 4

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
  {
    id: 'auc-ord-008',
    orderId: 'ORD-2026-008',
    pickupLocation: '88 Mill Road, Portland, OR',
    customerName: 'Olivia Chen',
    deliveryLocation: '402 Bridge St, Seattle, WA',
    productName: 'Timber Beams - Grade A',
    status: 'open',
  },
  {
    id: 'auc-ord-009',
    orderId: 'ORD-2026-009',
    pickupLocation: '600 Brick Yard, Atlanta, GA',
    customerName: 'James Brown',
    deliveryLocation: '91 Peachtree St, Atlanta, GA',
    productName: 'Clay Bricks - 10,000 Units',
    status: 'open',
  },
  {
    id: 'auc-ord-010',
    orderId: 'ORD-2026-010',
    pickupLocation: '33 Sand Depot, Miami, FL',
    customerName: 'Sofia Alvarez',
    deliveryLocation: '120 Ocean Dr, Miami Beach, FL',
    productName: 'Fine Sand Bulk Load',
    status: 'open',
  },
  {
    id: 'auc-ord-011',
    orderId: 'ORD-2026-011',
    pickupLocation: '1700 Steel Works, Chicago, IL',
    customerName: 'Noah Patel',
    deliveryLocation: '55 Lakeshore Dr, Chicago, IL',
    productName: 'Structural Steel Plates',
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
  {
    id: 'auc-ord-013',
    orderId: 'ORD-2026-013',
    productName: 'PVC Piping Bundles',
    pickupLocation: '910 Pipe Depot, Columbus, OH',
    deliveryLocation: '210 High St, Columbus, OH',
    assignedTransporter: 'BulkFreight Co',
    bidPrice: 2100,
    status: 'assigned',
  },
  {
    id: 'auc-ord-014',
    orderId: 'ORD-2026-014',
    productName: 'Roofing Sheets - Galvanized',
    pickupLocation: '300 Metal Yard, Dallas, TX',
    deliveryLocation: '66 Commerce Loop, Fort Worth, TX',
    assignedTransporter: 'Swift Transport Co.',
    bidPrice: 2750,
    status: 'assigned',
  },
  {
    id: 'auc-ord-015',
    orderId: 'ORD-2026-015',
    productName: 'Ceramic Floor Tiles',
    pickupLocation: '18 Tile Factory, San Jose, CA',
    deliveryLocation: '404 Market St, San Francisco, CA',
    assignedTransporter: 'QuickDelivery Express',
    bidPrice: 3400,
    status: 'assigned',
  },
  {
    id: 'auc-ord-016',
    orderId: 'ORD-2026-016',
    productName: 'Insulation Foam Boards',
    pickupLocation: '72 Foam Plant, Minneapolis, MN',
    deliveryLocation: '1500 Nicolet Mall, Minneapolis, MN',
    assignedTransporter: 'HaulMaster Inc.',
    bidPrice: 1950,
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
      transporter: {
        ...DEMO_AUCTION_DETAILS_ASSIGNED.transporter,
        name: auction.assignedTransporter || 'Swift Transport Co.',
        bidAmount:
          auction.bidPrice != null
            ? `€${Number(auction.bidPrice).toLocaleString()}`
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
  }
}

export default function DeliveryLogisticsPage() {
  const { t } = useTranslation()
  const [activeAuctions, setActiveAuctions] = useState(ACTIVE_AUCTIONS)
  const [assignedDeliveries] = useState(ASSIGNED_DELIVERIES)
  const [activePage, setActivePage] = useState(1)
  const [assignedPage, setAssignedPage] = useState(1)
  const [view, setView] = useState('list')
  const [selectedAuction, setSelectedAuction] = useState(null)

  const activeTotalPages = Math.max(
    1,
    Math.ceil(activeAuctions.length / PAGE_SIZE),
  )
  const assignedTotalPages = Math.max(
    1,
    Math.ceil(assignedDeliveries.length / PAGE_SIZE),
  )
  const safeActivePage = Math.min(activePage, activeTotalPages)
  const safeAssignedPage = Math.min(assignedPage, assignedTotalPages)

  const pagedActiveAuctions = activeAuctions.slice(
    (safeActivePage - 1) * PAGE_SIZE,
    safeActivePage * PAGE_SIZE,
  )
  const pagedAssignedDeliveries = assignedDeliveries.slice(
    (safeAssignedPage - 1) * PAGE_SIZE,
    safeAssignedPage * PAGE_SIZE,
  )

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
      orderId: form.orderId || `ORD-2026-${String(activeAuctions.length + 10).padStart(3, '0')}`,
      pickupLocation: form.pickupLocation || form.deliveryAddress || '—',
      customerName: form.customerName || '—',
      deliveryLocation: form.deliveryAddress || '—',
      productName: form.productName || '—',
      status: 'open',
    }
    setActiveAuctions((prev) => [next, ...prev])
    setActivePage(1)
    setView('list')
  }

  if (view === 'create') {
    return (
      <CreateAuction
        role="factory"
        placeholders={DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS}
        onBack={closeView}
        onSubmit={handleCreateSubmit}
      />
    )
  }

  if (view === 'details' && selectedAuction) {
    const isAssigned = selectedAuction.status === 'assigned'

    return (
      <AuctionDetails
        role="factory"
        status={isAssigned ? 'assigned' : 'active'}
        auction={buildDetailsAuction(selectedAuction)}
        onBack={closeView}
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t('factoryDeliveryLogistics.title')}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t('factoryDeliveryLogistics.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setView('create')}
          className="inline-flex items-center justify-center rounded-full bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
        >
          {t('factoryDeliveryLogistics.requestDelivery')}
        </button>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t('factoryDeliveryLogistics.activeAuctions.title')}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
            {t('factoryDeliveryLogistics.activeAuctions.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pagedActiveAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              role="factory"
              status="open"
              auction={auction}
              onViewDetails={openDetails}
            />
          ))}
        </div>

        <Pagination
          page={safeActivePage}
          totalPages={activeTotalPages}
          onPageChange={setActivePage}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t('factoryDeliveryLogistics.assignedDeliveries.title')}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
            {t('factoryDeliveryLogistics.assignedDeliveries.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pagedAssignedDeliveries.map((auction) => (
            <AuctionCard
              key={auction.id}
              role="factory"
              status="assigned"
              auction={auction}
              onViewDetails={openDetails}
            />
          ))}
        </div>

        <Pagination
          page={safeAssignedPage}
          totalPages={assignedTotalPages}
          onPageChange={setAssignedPage}
        />
      </section>
    </div>
  )
}
