import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import AuctionCard from '@/components/data-display/AuctionCard'
import AuctionDetails from '@/components/data-display/AuctionDetails'
import CreateAuction from '@/components/forms/CreateAuction'
import { DEFAULT_CREATE_AUCTION } from '@/components/forms/CreateAuction/defaults'
import Pagination from '@/components/common/Pagination/Pagination'
import {
  useCreateFactoryAuctionMutation,
  useGetActiveFactoryAuctionByIdQuery,
  useGetActiveFactoryAuctionsQuery,
  useGetAssignedFactoryAuctionByIdQuery,
  useGetAssignedFactoryAuctionsQuery,
  useLazyGetFactoryAuctionCreateInfoQuery,
} from '@/features/factory-auctions/factoryAuctionApi'

const PAGE_SIZE = 4
const DEFAULT_VEHICLE_TYPE = 'HEAVY_TRUCK'

function formatMoney(value) {
  if (value == null || value === '') return '—'
  const amount = Number(value)
  if (Number.isNaN(amount)) return String(value)
  return `€${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString()
}

function mapActiveCard(auction) {
  return {
    id: auction.auctionId,
    auctionId: auction.auctionId,
    orderId: auction.orderNumber || auction.orderId,
    orderDbId: auction.orderDbId,
    pickupLocation: auction.pickupLocation || '—',
    customerName: auction.customerName || '—',
    deliveryLocation: auction.deliveryLocation || '—',
    productName: auction.productName || '—',
    status: 'open',
    listKind: 'active',
  }
}

function mapAssignedCard(auction) {
  return {
    id: auction.auctionId,
    auctionId: auction.auctionId,
    orderId: auction.orderNumber || auction.orderId,
    orderDbId: auction.orderDbId,
    pickupLocation: auction.pickupLocation || '—',
    customerName: auction.customerName || '—',
    deliveryLocation: auction.deliveryLocation || '—',
    productName: auction.productName || '—',
    assignedTransporter: auction.assignedTransporter || '—',
    bidPrice: auction.bidPrice,
    status: 'assigned',
    listKind: 'assigned',
  }
}

function mapDetailAuction(apiAuction) {
  if (!apiAuction) return null

  const order = apiAuction.order || {}
  const customer = apiAuction.customer || {}
  const shipping = apiAuction.shipping || {}
  const product = apiAuction.product || {}
  const bidSummary = apiAuction.bidSummary || {}
  const assigned = apiAuction.assignedTransporter

  return {
    id: apiAuction.auctionId,
    auctionId: apiAuction.auctionId,
    orderId: order.orderNumber || order.id,
    auctionDate: formatDateTime(order.auctionDate),
    pickupLocation: shipping.pickupLocation || '—',
    status: assigned ? 'assigned' : 'active',
    customer: {
      name: customer.name || '—',
      phone: customer.phone || '—',
      email: customer.email || '—',
      deliveryAddress:
        customer.deliveryAddress || shipping.deliveryLocation || '—',
    },
    product: {
      name: product.name || '—',
      sku: product.sku || '—',
      weight:
        product.weightKg != null ? `${product.weightKg} kg` : '—',
      price: formatMoney(product.price ?? bidSummary.shippingCharge),
      quantity: '—',
    },
    shipping: {
      pickupLocation: shipping.pickupLocation || '—',
      deliveryLocation: shipping.deliveryLocation || '—',
      unloadingInstructions: shipping.unloadingInstructions || '—',
      accessCondition: shipping.accessCondition || '—',
      additionalNotes: shipping.additionalNotes || '—',
    },
    bids: (apiAuction.bids || []).map((bid) => ({
      id: bid.id,
      transporterName: bid.transporterName,
      amount: formatMoney(bid.bidAmount),
      status: bid.status,
    })),
    transporter: assigned
      ? {
          name: assigned.name || '—',
          phone: assigned.phone || '—',
          vehicleType: '—',
          bidAmount: formatMoney(assigned.bidAmount),
          assignedAt: formatDateTime(assigned.assignedAt),
        }
      : null,
  }
}

function mapCreateInfoToForm(order) {
  if (!order) return null

  return {
    orderId: order.orderNumber || order.id || '',
    orderDbId: order.dbId || '',
    pickupLocation: order.pickupLocation || '',
    customerName: order.customer?.name || '',
    phone: order.customer?.phone || '',
    email: order.customer?.email || '',
    deliveryAddress: order.deliveryLocation || '',
    productName: order.product?.title || '',
    weight:
      order.product?.weightKg != null
        ? `${order.product.weightKg} kg`
        : '',
    sku: order.product?.sku || '',
    price:
      order.bidStartFrom != null
        ? String(order.bidStartFrom)
        : '',
    unloadingNeeds: '',
    unloadingInstruction: '',
    accessCondition: '',
    additionalNotes: '',
    requiredVehicleType: DEFAULT_VEHICLE_TYPE,
  }
}

function AuctionDetailsView({ auctionId, listKind, onBack }) {
  const isAssigned = listKind === 'assigned'

  const activeQuery = useGetActiveFactoryAuctionByIdQuery(auctionId, {
    skip: !auctionId || isAssigned,
  })
  const assignedQuery = useGetAssignedFactoryAuctionByIdQuery(auctionId, {
    skip: !auctionId || !isAssigned,
  })

  const query = isAssigned ? assignedQuery : activeQuery
  const detail = mapDetailAuction(query.data?.auction)

  if (query.isLoading) {
    return <p className="text-sm text-[var(--secondary-text)]">Loading…</p>
  }

  if (query.isError || !detail) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[var(--active)]"
        >
          Back
        </button>
        <p className="text-sm text-red-600">Failed to load auction details.</p>
      </div>
    )
  }

  return (
    <AuctionDetails
      role="factory"
      status={isAssigned ? 'assigned' : 'active'}
      auction={detail}
      onBack={onBack}
    />
  )
}

export default function DeliveryLogisticsPage() {
  const { t } = useTranslation()
  const [activePage, setActivePage] = useState(1)
  const [assignedPage, setAssignedPage] = useState(1)
  const [view, setView] = useState('list')
  const [selectedAuction, setSelectedAuction] = useState(null)
  const [createForm, setCreateForm] = useState(DEFAULT_CREATE_AUCTION)
  const [createInfoOrderId, setCreateInfoOrderId] = useState('')

  const { data: activeResponse, isLoading: isActiveLoading } =
    useGetActiveFactoryAuctionsQuery({
      page: activePage,
      limit: PAGE_SIZE,
    })

  const { data: assignedResponse, isLoading: isAssignedLoading } =
    useGetAssignedFactoryAuctionsQuery({
      page: assignedPage,
      limit: PAGE_SIZE,
    })

  const [fetchCreateInfo] = useLazyGetFactoryAuctionCreateInfoQuery()
  const [createFactoryAuction, { isLoading: isCreating }] =
    useCreateFactoryAuctionMutation()

  const activeAuctions = useMemo(
    () => (activeResponse?.auctions || []).map(mapActiveCard),
    [activeResponse],
  )

  const assignedDeliveries = useMemo(
    () => (assignedResponse?.auctions || []).map(mapAssignedCard),
    [assignedResponse],
  )

  const activeTotalPages = Math.max(
    1,
    activeResponse?.pagination?.totalPages || 1,
  )
  const assignedTotalPages = Math.max(
    1,
    assignedResponse?.pagination?.totalPages || 1,
  )
  const safeActivePage = Math.min(activePage, activeTotalPages)
  const safeAssignedPage = Math.min(assignedPage, assignedTotalPages)

  useEffect(() => {
    if (view !== 'create') return undefined

    const orderId = String(createForm.orderId || '').trim()
    if (!orderId || orderId.length < 3) return undefined
    if (orderId === createInfoOrderId) return undefined

    const timer = setTimeout(async () => {
      try {
        const result = await fetchCreateInfo(orderId).unwrap()
        const mapped = mapCreateInfoToForm(result?.order)
        if (!mapped) return

        setCreateInfoOrderId(orderId)
        setCreateForm((prev) => {
          if (String(prev.orderId || '').trim() !== orderId) return prev
          return {
            ...prev,
            ...mapped,
            orderId: prev.orderId,
          }
        })
        toast.success(
          t('factoryDeliveryLogistics.create.orderLoaded', {
            defaultValue: 'Order details loaded.',
            id: orderId,
          }),
        )
      } catch (err) {
        if (String(createForm.orderId || '').trim() !== orderId) return
        setCreateInfoOrderId('')
        toast.error(
          err?.data?.message
          || t('factoryDeliveryLogistics.create.orderNotFound', {
            defaultValue: 'Order not found. Check the Order ID.',
          }),
        )
      }
    }, 450)

    return () => clearTimeout(timer)
  }, [view, createForm.orderId, createInfoOrderId, fetchCreateInfo, t])

  const openDetails = (auction) => {
    setSelectedAuction(auction)
    setView('details')
  }

  const closeView = () => {
    setSelectedAuction(null)
    setCreateForm(DEFAULT_CREATE_AUCTION)
    setCreateInfoOrderId('')
    setView('list')
  }

  const openCreate = () => {
    setCreateForm(DEFAULT_CREATE_AUCTION)
    setCreateInfoOrderId('')
    setView('create')
  }

  const handleCreateChange = (next) => {
    const prevOrderId = String(createForm.orderId || '').trim()
    const nextOrderId = String(next.orderId || '').trim()
    setCreateForm(next)
    if (prevOrderId !== nextOrderId) {
      setCreateInfoOrderId('')
    }
  }

  const handleCreateSubmit = async (form) => {
    const orderId = String(form.orderDbId || form.orderId || '').trim()
    if (!orderId) {
      toast.error(
        t('factoryDeliveryLogistics.create.orderRequired', {
          defaultValue: 'Order ID is required.',
        }),
      )
      return
    }

    try {
      let payloadOrderId = form.orderDbId
      if (!payloadOrderId) {
        const info = await fetchCreateInfo(form.orderId.trim()).unwrap()
        payloadOrderId = info?.order?.dbId || form.orderId.trim()
      }

      await createFactoryAuction({
        orderId: payloadOrderId,
        requiredVehicleType: form.requiredVehicleType || DEFAULT_VEHICLE_TYPE,
      }).unwrap()

      toast.success(
        t('factoryDeliveryLogistics.create.submitSuccess', {
          defaultValue: 'Auction created successfully.',
        }),
      )
      setActivePage(1)
      closeView()
    } catch (err) {
      toast.error(
        err?.data?.message
        || t('factoryDeliveryLogistics.create.submitFailed', {
          defaultValue: 'Failed to create auction. Please try again.',
        }),
      )
    }
  }

  if (view === 'create') {
    return (
      <div className="space-y-4">
        <CreateAuction
          role="factory"
          value={createForm}
          onChange={handleCreateChange}
          onBack={closeView}
          onSubmit={handleCreateSubmit}
        />

        {isCreating ? (
          <p className="text-sm text-[var(--secondary-text)]">Saving…</p>
        ) : null}
      </div>
    )
  }

  if (view === 'details' && selectedAuction) {
    return (
      <AuctionDetailsView
        auctionId={selectedAuction.auctionId || selectedAuction.id}
        listKind={selectedAuction.listKind}
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
          onClick={openCreate}
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

        {isActiveLoading ? (
          <p className="text-sm text-[var(--secondary-text)]">Loading…</p>
        ) : activeAuctions.length === 0 ? (
          <p className="text-sm text-[var(--secondary-text)]">No active auctions.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {activeAuctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                role="factory"
                status="open"
                auction={auction}
                onViewDetails={openDetails}
              />
            ))}
          </div>
        )}

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

        {isAssignedLoading ? (
          <p className="text-sm text-[var(--secondary-text)]">Loading…</p>
        ) : assignedDeliveries.length === 0 ? (
          <p className="text-sm text-[var(--secondary-text)]">No assigned deliveries.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {assignedDeliveries.map((auction) => (
              <AuctionCard
                key={auction.id}
                role="factory"
                status="assigned"
                auction={auction}
                onViewDetails={openDetails}
              />
            ))}
          </div>
        )}

        <Pagination
          page={safeAssignedPage}
          totalPages={assignedTotalPages}
          onPageChange={setAssignedPage}
        />
      </section>
    </div>
  )
}
