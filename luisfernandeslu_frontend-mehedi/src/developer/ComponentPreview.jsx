import { useEffect, useMemo, useState } from 'react'
import AuctionCard from '../components/data-display/AuctionCard'
import AuctionDetails from '../components/data-display/AuctionDetails'
import OrderDetails from '../components/data-display/OrderDetails'
import BuyerOrderCard from '../components/data-display/BuyerOrderCard/BuyerOrderCard'
import BuyerOrderInformation from '../components/data-display/BuyerOrderInformation/BuyerOrderInformation'
import { DEMO_BUYER_ORDER_DETAIL } from '../pages/customer/orders/data/buyerOrderDetailDemo'
import ProductCard from '../components/data-display/ProductCard/ProductCard'
import ProductListingCard from '../components/data-display/ProductListingCard/ProductListingCard'
import ProductDetails from '../components/data-display/ProductDetails/ProductDetails'
import DataTable from '../components/data-display/DataTable/DataTable'
import StatusBadge from '../components/data-display/DataTable/StatusBadge'
import InstallmentTimeline from '../components/data-display/InstallmentTimeline/InstallmentTimeline'
import StatusCard from '../components/data-display/StatusCard'
import DisputeResolution from '../components/data-display/DisputeResolution'
import DeliveryTimeline from '../components/data-display/DeliveryTimeline'
import CreateAuction from '../components/forms/CreateAuction'
import AddProduct from '../components/forms/AddProduct/AddProduct'
import PanelProfile from '../components/forms/PanelProfile'
import Messenger from '../components/common/messenger/Messenger'
import useMessages from '../components/common/messenger/useMessages'
import Pagination from '../components/common/Pagination/Pagination'
import { CUSTOMER_ORDERS_DEMO } from '../pages/customer/orders/data/customerOrdersDemo'
import {
  ADMIN_PRODUCT,
  DEMO_ADD_PRODUCT,
  DEMO_AUCTION_ASSIGNED,
  DEMO_AUCTION_CREATED,
  DEMO_AUCTION_DETAILS_ACTIVE,
  DEMO_AUCTION_DETAILS_ASSIGNED,
  DEMO_AUCTION_DETAILS_TRANSPORTER,
  DEMO_AUCTION_DETAILS_TRANSPORTER_COMPLETE,
  DEMO_AUCTION_LIVE,
  DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS,
  DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS,
  DEMO_DISPUTE_DASHBOARD,
  DEMO_DISPUTE_PUBLIC,
  DEMO_DELIVERY_TIMELINE_ITEMS,
  DEMO_FACTORY_PRODUCT,
  DEMO_INSTALLMENTS,
  DEMO_ORDER_ASSIGNED,
  DEMO_ORDER_CANCEL,
  DEMO_ORDER_INSTALLMENT_ASSIGNED,
  DEMO_ORDER_INSTALLMENT_NEW,
  DEMO_ORDER_INSTALLMENT_SUPPLIER,
  DEMO_ORDER_NEW,
  DEMO_ORDER_PENDING,
  DEMO_PANEL_PROFILE_ADMIN,
  DEMO_PANEL_PROFILE_AFFILIATE,
  DEMO_PANEL_PROFILE_CUSTOMER,
  DEMO_PANEL_PROFILE_FACTORY,
  DEMO_PANEL_PROFILE_SUPPLIER,
  DEMO_PANEL_PROFILE_TRANSPORTER,
  DEMO_PRODUCT,
  DEMO_STATUS_CARDS,
} from '@/data/demoData'

/* ─── Order Details ─────────────────────────────────────────────── */

const ORDER_VARIANT_ORDERS = {
  'standard-new': DEMO_ORDER_NEW,
  'standard-pending': DEMO_ORDER_PENDING,
  'standard-assigned': DEMO_ORDER_ASSIGNED,
  'standard-cancel': DEMO_ORDER_CANCEL,
  'installment-new': DEMO_ORDER_INSTALLMENT_NEW,
  'installment-assigned': DEMO_ORDER_INSTALLMENT_ASSIGNED,
  'installment-supplier': DEMO_ORDER_INSTALLMENT_SUPPLIER,
}

function OrderDetailsPreview({ variantId }) {
  const order = ORDER_VARIANT_ORDERS[variantId] ?? DEMO_ORDER_NEW
  const showPay =
    variantId === 'installment-new' || variantId === 'installment-assigned'

  return (
    <OrderDetails
      order={order}
      hasInstallment={Boolean(order.hasInstallment)}
      status={order.status}
      className="px-3 sm:px-0"
      showPay={showPay}
      onBack={() => {}}
      onAccept={() => {}}
      onDownloadInvoice={() => {}}
      onChat={() => {}}
      onPayNow={() => {}}
      onCancelInstallment={() => {}}
    />
  )
}

/* ─── Auction Card ──────────────────────────────────────────────── */

const AUCTION_CARD_VARIANTS = {
  'supplier-created': {
    role: 'supplier',
    status: 'open',
    auction: DEMO_AUCTION_CREATED,
  },
  'factory-assigned': {
    role: 'factory',
    status: 'assigned',
    auction: DEMO_AUCTION_ASSIGNED,
  },
  'transporter-live': {
    role: 'transporter',
    auction: DEMO_AUCTION_LIVE,
  },
  'admin-bids': {
    role: 'admin',
    auction: DEMO_AUCTION_LIVE,
  },
}

function AuctionCardPreview({ variantId }) {
  const cfg =
    AUCTION_CARD_VARIANTS[variantId] ?? AUCTION_CARD_VARIANTS['supplier-created']
  return (
    <div className="max-w-md">
      <AuctionCard
        {...cfg}
        onViewDetails={() => {}}
        onPlaceBid={() => {}}
      />
    </div>
  )
}

/* ─── Auction Details ───────────────────────────────────────────── */

const AUCTION_DETAILS_VARIANTS = {
  'supplier-active': {
    role: 'supplier',
    status: 'active',
    auction: DEMO_AUCTION_DETAILS_ACTIVE,
  },
  'supplier-assigned': {
    role: 'supplier',
    status: 'assigned',
    auction: DEMO_AUCTION_DETAILS_ASSIGNED,
  },
  'factory-active': {
    role: 'factory',
    status: 'active',
    auction: DEMO_AUCTION_DETAILS_ACTIVE,
  },
  'factory-assigned': {
    role: 'factory',
    status: 'assigned',
    auction: DEMO_AUCTION_DETAILS_ASSIGNED,
  },
  'transporter-assigned': {
    role: 'transporter',
    status: 'assigned',
    auction: DEMO_AUCTION_DETAILS_TRANSPORTER,
  },
  'transporter-complete': {
    role: 'transporter',
    status: 'complete',
    auction: DEMO_AUCTION_DETAILS_TRANSPORTER_COMPLETE,
  },
}

function AuctionDetailsPreview({ variantId }) {
  const cfg =
    AUCTION_DETAILS_VARIANTS[variantId] ??
    AUCTION_DETAILS_VARIANTS['supplier-active']
  return <AuctionDetails {...cfg} onBack={() => {}} />
}

/* ─── Buyer order card ──────────────────────────────────────────── */

function BuyerOrderCardPreview({ variantId }) {
  const order =
    CUSTOMER_ORDERS_DEMO.find((item) => item.status === variantId)
    ?? CUSTOMER_ORDERS_DEMO[0]
  return (
    <div className="max-w-2xl">
      <BuyerOrderCard order={order} onAction={() => {}} />
    </div>
  )
}

function BuyerOrderInformationPreview() {
  return (
    <div className="max-w-5xl">
      <BuyerOrderInformation order={DEMO_BUYER_ORDER_DETAIL} onChatDriver={() => {}} />
    </div>
  )
}

/* ─── Product Card ──────────────────────────────────────────────── */

const CARD_IMG =
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'

const BASE_CARD_PRODUCT = {
  image: CARD_IMG,
  title: 'Portland Cement',
  description:
    'High-strength building cement suitable for construction and masonry work.',
  price: '$115',
  priceText: 'Price: $115 per bag (50 kg)',
  companyPrice: '$98',
  companyPriceText: 'Company: $98 per bag (50 kg)',
  unit: 'bag (50 kg)',
}

const SPONSORED_CARD_PRODUCT = {
  image: CARD_IMG,
  title: 'Industrial Steel Beams',
  description: 'High-quality steel beams for construction. Grade A certified.',
  price: '$150',
  unit: 'units',
  minOrder: '10 units',
  company: 'SteelWorks Inc',
  rating: 4.8,
  companyPrice: '$135',
  companyPriceText: 'Company: $135 /units',
}

const PRODUCT_CARD_VARIANTS = {
  'sponsored-customer': {
    type: 'sponsored',
    role: 'customer',
    tag: 'sponsored',
    product: SPONSORED_CARD_PRODUCT,
  },
  'sponsored-company': {
    type: 'sponsored',
    role: 'company',
    tag: 'sponsored',
    product: {
      ...SPONSORED_CARD_PRODUCT,
      priceText: 'Price: $150 /units',
    },
  },
  'normal-customer': {
    type: 'normal',
    role: 'customer',
    product: BASE_CARD_PRODUCT,
  },
  'normal-company': {
    type: 'normal',
    role: 'company',
    product: BASE_CARD_PRODUCT,
  },
  'normal-qty': {
    type: 'normal',
    role: 'customer',
    showQuantity: true,
    product: {
      ...BASE_CARD_PRODUCT,
      title: 'Portland Cement Quick Set',
      description: 'Fast-setting cement for rapid construction work.',
      priceText: 'Price: $130 per bag (50 kg)',
      bulkOptionLabel: 'Bulk option Open',
    },
  },
  'supplier-regular': {
    type: 'dashboard',
    role: 'supplier',
    tag: 'regular',
    product: BASE_CARD_PRODUCT,
  },
  'supplier-bulk': {
    type: 'dashboard',
    role: 'supplier',
    tag: 'bulk_order',
    product: {
      ...BASE_CARD_PRODUCT,
      priceText: 'Price: $135 per bag (50 kg)',
    },
  },
  'supplier-pending': {
    type: 'dashboard',
    role: 'supplier',
    status: 'pending',
    product: BASE_CARD_PRODUCT,
  },
  'supplier-rejected': {
    type: 'dashboard',
    role: 'supplier',
    status: 'rejected',
    product: {
      ...BASE_CARD_PRODUCT,
      title: 'Portland Cement Standard',
      description: 'Reliable cement for all your everyday construction needs.',
    },
  },
  featured: {
    type: 'featured',
    tag: 'featured',
    product: {
      ...BASE_CARD_PRODUCT,
      title: 'Portland Cement Quick Set',
      description: 'Fast-setting cement for rapid construction work.',
      priceText: 'Price: $130 per bag (50 kg)',
      expiryDate: '5/4/2026',
    },
  },
  'promo-code': {
    type: 'dashboard',
    context: 'promo_code',
    role: 'supplier',
    product: {
      ...BASE_CARD_PRODUCT,
      title: 'Portland Cement Quick Set',
      description: 'Fast-setting cement for rapid construction work.',
      priceText: 'Price: $130 per bag (50 kg)',
      bulkOptionLabel: 'Bulk option Open',
      promoLabel: '25% Off',
    },
  },
  'supplier-buy-factory': {
    type: 'normal',
    role: 'supplier',
    product: {
      ...BASE_CARD_PRODUCT,
      title: 'Portland Cement Quick Set',
      description: 'Fast-setting cement for rapid construction work.',
      priceText: 'Price: $130 per bag (50 kg)',
    },
  },
  'factory-active': {
    type: 'dashboard',
    role: 'factory',
    status: 'active',
    product: BASE_CARD_PRODUCT,
  },
  'factory-pending': {
    type: 'dashboard',
    role: 'factory',
    status: 'pending',
    product: BASE_CARD_PRODUCT,
  },
  'factory-rejected': {
    type: 'dashboard',
    role: 'factory',
    status: 'rejected',
    product: BASE_CARD_PRODUCT,
  },
  'admin-approval-pending': {
    type: 'dashboard',
    role: 'admin',
    context: 'approval',
    status: 'pending',
    product: BASE_CARD_PRODUCT,
  },
  'admin-approval-active': {
    type: 'dashboard',
    role: 'admin',
    context: 'approval',
    status: 'active',
    product: BASE_CARD_PRODUCT,
  },
  'admin-approval-rejected': {
    type: 'dashboard',
    role: 'admin',
    context: 'approval',
    status: 'rejected',
    product: BASE_CARD_PRODUCT,
  },
  'admin-promo-pending': {
    type: 'dashboard',
    role: 'admin',
    context: 'promotion',
    status: 'pending',
    product: BASE_CARD_PRODUCT,
  },
  'admin-promo-active': {
    type: 'dashboard',
    role: 'admin',
    context: 'promotion',
    status: 'active',
    product: BASE_CARD_PRODUCT,
  },
  'admin-promo-featured': {
    type: 'dashboard',
    role: 'admin',
    context: 'promotion',
    status: 'featured',
    product: {
      ...BASE_CARD_PRODUCT,
      timeLeft: '5 days left',
    },
  },
  'admin-promo-completed': {
    type: 'dashboard',
    role: 'admin',
    context: 'promotion',
    status: 'completed',
    product: BASE_CARD_PRODUCT,
  },
}

function ProductCardPreview({ variantId }) {
  const cfg =
    PRODUCT_CARD_VARIANTS[variantId] ?? PRODUCT_CARD_VARIANTS['normal-customer']
  return (
    <div className="max-w-xs">
      <ProductCard {...cfg} onAction={() => {}} />
    </div>
  )
}

const LISTING_CARD_DEMO_PRODUCT = {
  image: CARD_IMG,
  title: 'Portland Cement Standard',
  description: 'Reliable cement for all your everyday construction needs.',
  bulkOptionLabel: 'Bulk option Open',
  priceText: 'Price: $115 per bag (50 kg)',
  companyPriceText: 'Company: $98 per bag (50 kg)',
}

const COMPANY_LISTING_DEMO_PRODUCT = {
  image:
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
  title: 'Gypsum Board',
  description: 'Lightweight panels for interior walls.',
  minOrderLabel: 'Min ord 10 pcs',
  priceText: 'Price: $10 per sheet',
}

function ProductListingCardPreview({ variantId }) {
  const withActions = variantId === 'with-actions'
  const isCompany = variantId === 'default'
  const role = isCompany ? 'company' : 'customer'
  const product = isCompany ? COMPANY_LISTING_DEMO_PRODUCT : LISTING_CARD_DEMO_PRODUCT
  return (
    <div className="max-w-xs">
      <ProductListingCard
        product={product}
        role={role}
        showQuantity={withActions ? false : undefined}
        actions={
          withActions
            ? [
                {
                  id: 'view_details',
                  kind: 'full',
                  label: 'View Details',
                  variant: 'primary',
                },
              ]
            : []
        }
        onAction={() => {}}
      />
    </div>
  )
}

/* ─── Product Details ───────────────────────────────────────────── */

const PRODUCT_DETAILS_VARIANTS = {
  customer: { role: 'customer', product: DEMO_PRODUCT },
  company: { role: 'company', product: DEMO_PRODUCT },
  supplier: { role: 'supplier', product: DEMO_PRODUCT },
  admin: { role: 'admin', product: ADMIN_PRODUCT },
}

function ProductDetailsPreview({ variantId }) {
  const cfg =
    PRODUCT_DETAILS_VARIANTS[variantId] ?? PRODUCT_DETAILS_VARIANTS.customer
  return <ProductDetails {...cfg} onAction={() => {}} />
}

/* ─── Data Table ────────────────────────────────────────────────── */

const DT_COLUMNS = [
  { key: 'poNumber', header: 'PO Number' },
  { key: 'factoryName', header: 'Factory Name' },
  { key: 'total', header: 'Total' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <StatusBadge status={value} />,
  },
  { key: 'date', header: 'Date' },
]

const DT_ROWS = [
  {
    id: 1,
    poNumber: 'PO-2001',
    factoryName: 'ABC Corp',
    total: '$4,500,000',
    status: 'Produced',
    date: '12/01/2026',
  },
  {
    id: 2,
    poNumber: 'PO-2002',
    factoryName: 'XYZ Ltd',
    total: '$2,100,000',
    status: 'In Production',
    date: '18/01/2026',
  },
  {
    id: 3,
    poNumber: 'PO-2003',
    factoryName: 'ABC Corp',
    total: '$980,000',
    status: 'Ready',
    date: '22/01/2026',
  },
]

const DT_TABS = [
  { id: 'orders', label: 'Orders' },
  { id: 'transport', label: 'Transport Request' },
]

const DT_MENU_ACTIONS = [
  { id: 'view', label: 'View', onClick: () => {} },
  { id: 'edit', label: 'Edit', onClick: () => {} },
  { id: 'delete', label: 'Delete', variant: 'danger', onClick: () => {} },
]

const DT_BUTTON_ACTIONS = [
  { id: 'view', label: 'View', onClick: () => {} },
  { id: 'delete', label: 'Delete', variant: 'danger', onClick: () => {} },
]

function DataTableFullPreview() {
  const [activeTab, setActiveTab] = useState('orders')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 3

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return DT_ROWS
    return DT_ROWS.filter(
      (row) =>
        row.poNumber.toLowerCase().includes(q) ||
        row.factoryName.toLowerCase().includes(q),
    )
  }, [search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <DataTable
      showTabs
      tabs={DT_TABS}
      activeTab={activeTab}
      onTabChange={(id) => {
        setActiveTab(id)
        setPage(1)
      }}
      showSearch
      searchValue={search}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      searchPlaceholder="Search PO, factory..."
      showFilters
      filterLabel="Sort By:"
      filters={[
        {
          id: 'status',
          value: 'all',
          onChange: () => {},
          options: [
            { value: 'all', label: 'All status' },
            { value: 'Produced', label: 'Produced' },
            { value: 'Ready', label: 'Ready' },
          ],
        },
      ]}
      columns={DT_COLUMNS}
      data={paged}
      showActions
      actionType="menu"
      actions={DT_MENU_ACTIONS}
      showPagination
      pagination={{
        page: safePage,
        pageSize,
        total: filtered.length,
        onPageChange: setPage,
      }}
    />
  )
}

function DataTablePreview({ variantId }) {
  switch (variantId) {
    case 'action-buttons':
      return (
        <DataTable
          columns={DT_COLUMNS}
          data={DT_ROWS}
          showActions
          actionType="buttons"
          actions={DT_BUTTON_ACTIONS}
          bgClassName="bg-white"
        />
      )
    case 'table-only':
      return (
        <DataTable
          columns={DT_COLUMNS}
          data={DT_ROWS}
          bgClassName="bg-white"
        />
      )
    case 'tabs-table':
      return (
        <DataTable
          columns={DT_COLUMNS}
          data={DT_ROWS}
          showTabs
          tabs={DT_TABS}
          activeTab="orders"
          onTabChange={() => {}}
          bgClassName="bg-white"
        />
      )
    case 'search-filters':
      return (
        <DataTable
          columns={DT_COLUMNS}
          data={DT_ROWS}
          showSearch
          searchValue=""
          onSearchChange={() => {}}
          showFilters
          filters={[
            {
              id: 'status',
              value: 'all',
              onChange: () => {},
              options: [
                { value: 'all', label: 'All status' },
                { value: 'Ready', label: 'Ready' },
              ],
            },
          ]}
          bgClassName="bg-white"
        />
      )
    case 'loading':
      return (
        <DataTable
          columns={DT_COLUMNS}
          data={[]}
          loading
          skeletonRows={4}
          showActions
          actions={DT_MENU_ACTIONS}
          bgClassName="bg-white"
        />
      )
    case 'empty':
      return (
        <DataTable
          columns={DT_COLUMNS}
          data={[]}
          emptyMessage="No orders match your filters."
          showSearch
          searchValue=""
          onSearchChange={() => {}}
          bgClassName="bg-white"
        />
      )
    case 'no-card':
      return (
        <DataTable
          showCard={false}
          columns={DT_COLUMNS}
          data={DT_ROWS}
        />
      )
    case 'full':
    default:
      return <DataTableFullPreview />
  }
}

/* ─── Installment Timeline ──────────────────────────────────────── */

function InstallmentTimelinePreview({ variantId }) {
  let items = DEMO_INSTALLMENTS.slice(0, 4)
  if (variantId === 'all-pending') {
    items = items.map((item) => ({ ...item, status: 'pending' }))
  } else if (variantId === 'all-completed') {
    items = items.map((item) => ({ ...item, status: 'completed' }))
  }

  const showPay = variantId !== 'no-pay' && variantId !== 'payee'

  return (
    <InstallmentTimeline
      items={items}
      showPay={showPay}
      onPayNow={() => {}}
      onCancel={() => {}}
    />
  )
}

const STATUS_CARD_VARIANT_MAP = {
  'active-suppliers': DEMO_STATUS_CARDS.activeSuppliers,
  'total-users': DEMO_STATUS_CARDS.totalUsers,
  'referred-clients': DEMO_STATUS_CARDS.referredClients,
  'inline-referred': DEMO_STATUS_CARDS.totalReferredInline,
  'available-balance': DEMO_STATUS_CARDS.availableBalance,
  'total-earnings': DEMO_STATUS_CARDS.totalEarnings,
  'admin-commission': DEMO_STATUS_CARDS.adminCommission,
  'payment-overdue': DEMO_STATUS_CARDS.paymentOverdue,
  'pending-badge': DEMO_STATUS_CARDS.pendingBadge,
  'total-documents': DEMO_STATUS_CARDS.totalDocuments,
  'total-products': DEMO_STATUS_CARDS.totalProducts,
  'low-stock': DEMO_STATUS_CARDS.lowStock,
  'out-of-stock': DEMO_STATUS_CARDS.outOfStock,
}

function StatusCardPreview({ variantId }) {
  const props =
    STATUS_CARD_VARIANT_MAP[variantId] || DEMO_STATUS_CARDS.activeSuppliers
  return (
    <div className="max-w-sm">
      <StatusCard {...props} onAction={() => {}} />
    </div>
  )
}

/* ─── Create Auction / Add Product ──────────────────────────────── */

function CreateAuctionPreview({ variantId }) {
  const isFactory = variantId === 'factory'
  return (
    <CreateAuction
      role={isFactory ? 'factory' : 'supplier'}
      placeholders={
        isFactory
          ? DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS
          : DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS
      }
      onBack={() => {}}
      onSubmit={() => {}}
    />
  )
}

function AddProductPreview({ variantId }) {
  const isFactory = variantId === 'factory'
  return (
    <AddProduct
      role={isFactory ? 'factory' : 'supplier'}
      defaultValue={isFactory ? DEMO_FACTORY_PRODUCT : DEMO_ADD_PRODUCT}
      onBack={() => {}}
      onSubmit={() => {}}
    />
  )
}

function PanelProfilePreview({ variantId }) {
  const role = [
    'admin',
    'affiliate',
    'transporter',
    'factory',
    'supplier',
    'customer',
  ].includes(variantId)
    ? variantId
    : 'admin'

  const demos = {
    admin: DEMO_PANEL_PROFILE_ADMIN,
    affiliate: DEMO_PANEL_PROFILE_AFFILIATE,
    transporter: DEMO_PANEL_PROFILE_TRANSPORTER,
    factory: DEMO_PANEL_PROFILE_FACTORY,
    supplier: DEMO_PANEL_PROFILE_SUPPLIER,
    customer: DEMO_PANEL_PROFILE_CUSTOMER,
  }

  return (
    <div className="rounded-xl bg-[#F5F6F8] p-2 sm:p-4">
      <PanelProfile role={role} defaultValue={demos[role]} />
    </div>
  )
}

function DisputeResolutionPreview({ variantId }) {
  const isDashboard = variantId === 'dashboard'
  const [dispute, setDispute] = useState(
    isDashboard ? DEMO_DISPUTE_DASHBOARD : DEMO_DISPUTE_PUBLIC,
  )

  useEffect(() => {
    setDispute(isDashboard ? DEMO_DISPUTE_DASHBOARD : DEMO_DISPUTE_PUBLIC)
  }, [isDashboard])

  return (
    <DisputeResolution
      key={isDashboard ? 'dashboard' : 'public'}
      variant={isDashboard ? 'dashboard' : 'public'}
      dispute={dispute}
      currentUserRole={isDashboard ? 'admin' : 'buyer'}
      onStatusChange={(status) =>
        setDispute((prev) => ({ ...prev, status }))
      }
      onSendMessage={(text) => {
        setDispute((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: `local-${Date.now()}`,
              author: isDashboard ? 'Support' : 'You',
              roleLabel: isDashboard ? 'Admin' : 'Buyer',
              role: isDashboard ? 'admin' : 'buyer',
              align: isDashboard ? 'left' : 'right',
              at: new Date().toLocaleString(),
              text,
            },
          ],
        }))
      }}
    />
  )
}

function DeliveryTimelinePreview({ variantId }) {
  let items = DEMO_DELIVERY_TIMELINE_ITEMS
  if (variantId === 'assigned') {
    items = DEMO_DELIVERY_TIMELINE_ITEMS.filter((x) => x.status === 'assigned')
  } else if (variantId === 'picked-up') {
    items = DEMO_DELIVERY_TIMELINE_ITEMS.filter((x) => x.status === 'picked_up')
  } else if (variantId === 'in-transit') {
    items = DEMO_DELIVERY_TIMELINE_ITEMS.filter((x) => x.status === 'in_transit')
  } else if (variantId === 'delivered') {
    items = DEMO_DELIVERY_TIMELINE_ITEMS.filter((x) => x.status === 'delivered')
  }

  
  return (
    <DeliveryTimeline
      items={items}
      onStartTrip={() => {}}
      onMarkPickedUp={() => {}}
      onNavigateToDelivery={() => {}}
      onVerifyDelivery={() => {}}
      onSeeDetails={() => {}}
    />
  )
}

/* ─── Messenger ─────────────────────────────────────────────────── */

function MessengerPreview({ variantId }) {
  const state = useMessages()
  const isCreator = variantId === 'offer-sent'
  const isRecipient = variantId === 'offer-received'

  useEffect(() => {
    if (variantId === 'conversation') state.selectChat('c1')
    else if (variantId === 'offer-sent') state.selectChat('c2')
    else if (variantId === 'offer-received') state.selectChat('c4')
    else state.selectChat(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync on variant change
  }, [variantId])

  return (
    <div className="h-[420px] w-full">
      <Messenger
        chats={state.chats}
        messages={state.messages}
        activePartnerId={state.activePartnerId}
        activeChat={state.activeChat}
        onSelectChat={state.selectChat}
        onSend={state.sendMessage}
        onEditMessage={state.editMessage}
        onDeleteMessage={state.deleteMessage}
        onTyping={state.handleTyping}
        onStopTyping={state.stopTyping}
        onCreateOffer={isCreator ? () => {} : undefined}
        onPayNow={isRecipient ? () => {} : undefined}
        onNegotiate={isRecipient ? () => {} : undefined}
        isPartnerTyping={state.isPartnerTyping}
        isSending={state.isSending}
        isLoading={state.isLoading}
        actionMessageId={state.actionMessageId}
        sharedInbox={state.sharedInbox}
        sidebarTitle="Recent Messages"
      />
    </div>
  )
}

/* ─── Pagination ────────────────────────────────────────────────── */

function PaginationPreview({ variantId }) {
  const config = useMemo(() => {
    switch (variantId) {
      case 'start':
        return { page: 2, totalPages: 28 }
      case 'end':
        return { page: 27, totalPages: 28 }
      case 'few':
        return { page: 2, totalPages: 4 }
      case 'middle':
      default:
        return { page: 5, totalPages: 28 }
    }
  }, [variantId])

  const [page, setPage] = useState(config.page)

  useEffect(() => {
    setPage(config.page)
  }, [config.page])

  return (
    <div className="flex w-full justify-center py-8">
      <Pagination
        page={page}
        totalPages={config.totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}

/* ─── Router ────────────────────────────────────────────────────── */

/** Live preview for a catalog component id (+ optional variantId) */
export default function ComponentPreview({ previewId, variantId }) {
  switch (previewId) {
    case 'order-details':
      return (
        <OrderDetailsPreview variantId={variantId || 'standard-new'} />
      )
    case 'buyer-order-card':
      return (
        <BuyerOrderCardPreview variantId={variantId || 'shipped'} />
      )
    case 'buyer-order-information':
      return <BuyerOrderInformationPreview />
    case 'auction-card':
      return (
        <AuctionCardPreview variantId={variantId || 'supplier-created'} />
      )
    case 'auction-details':
      return (
        <AuctionDetailsPreview variantId={variantId || 'supplier-active'} />
      )
    case 'product-card':
      return (
        <ProductCardPreview variantId={variantId || 'normal-customer'} />
      )
    case 'product-listing-card':
      return (
        <ProductListingCardPreview variantId={variantId || 'customer'} />
      )
    case 'product-details':
      return (
        <ProductDetailsPreview variantId={variantId || 'customer'} />
      )
    case 'data-table':
      return <DataTablePreview variantId={variantId || 'full'} />
    case 'installment-timeline':
      return (
        <InstallmentTimelinePreview variantId={variantId || 'mixed'} />
      )
    case 'status-card':
      return (
        <StatusCardPreview variantId={variantId || 'active-suppliers'} />
      )
    case 'create-auction':
      return <CreateAuctionPreview variantId={variantId || 'supplier'} />
    case 'add-product':
      return <AddProductPreview variantId={variantId || 'supplier'} />
    case 'panel-profile':
      return <PanelProfilePreview variantId={variantId || 'admin'} />
    case 'dispute-resolution':
      return (
        <DisputeResolutionPreview variantId={variantId || 'public'} />
      )
    case 'delivery-timeline':
      return (
        <DeliveryTimelinePreview variantId={variantId || 'mixed'} />
      )
    case 'messenger':
      return <MessengerPreview variantId={variantId || 'inbox'} />
    case 'pagination':
      return <PaginationPreview variantId={variantId || 'middle'} />
    default:
      return (
        <p className="text-sm text-[var(--secondary-text)]">
          No preview available.
        </p>
      )
  }
}
