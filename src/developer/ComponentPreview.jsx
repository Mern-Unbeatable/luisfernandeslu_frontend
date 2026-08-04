import { useEffect, useMemo, useState } from 'react'
import AuctionCard, {
  DEMO_AUCTION_CREATED,
  DEMO_AUCTION_ASSIGNED,
  DEMO_AUCTION_LIVE,
} from '../components/data-display/AuctionCard'
import AuctionDetails, {
  DEMO_AUCTION_DETAILS_ACTIVE,
  DEMO_AUCTION_DETAILS_ASSIGNED,
} from '../components/data-display/AuctionDetails'
import OrderDetails, {
  DEMO_ORDER_NEW,
  DEMO_ORDER_PENDING,
  DEMO_ORDER_ASSIGNED,
  DEMO_ORDER_CANCEL,
  DEMO_ORDER_INSTALLMENT_NEW,
  DEMO_ORDER_INSTALLMENT_ASSIGNED,
} from '../components/data-display/OrderDetails'
import ProductCard from '../components/data-display/ProductCard/ProductCard'
import ProductDetails from '../components/data-display/ProductDetails/ProductDetails'
import {
  DEMO_PRODUCT,
  ADMIN_PRODUCT,
} from '../components/data-display/ProductDetails/demoProduct'
import DataTable from '../components/data-display/DataTable/DataTable'
import StatusBadge from '../components/data-display/DataTable/StatusBadge'
import InstallmentTimeline, {
  DEMO_INSTALLMENTS,
} from '../components/data-display/InstallmentTimeline/InstallmentTimeline'
import CreateAuction, {
  DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS,
  DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS,
} from '../components/forms/CreateAuction'
import AddProduct from '../components/forms/AddProduct/AddProduct'
import {
  DEMO_ADD_PRODUCT,
  DEMO_FACTORY_PRODUCT,
} from '../components/forms/AddProduct/defaults'
import Messenger from '../components/common/messenger/Messenger'
import useMessages from '../components/common/messenger/useMessages'

/* ─── Order Details ─────────────────────────────────────────────── */

const ORDER_VARIANT_ORDERS = {
  'standard-new': DEMO_ORDER_NEW,
  'standard-pending': DEMO_ORDER_PENDING,
  'standard-assigned': DEMO_ORDER_ASSIGNED,
  'standard-cancel': DEMO_ORDER_CANCEL,
  'installment-new': DEMO_ORDER_INSTALLMENT_NEW,
  'installment-assigned': DEMO_ORDER_INSTALLMENT_ASSIGNED,
}

function OrderDetailsPreview({ variantId }) {
  const order = ORDER_VARIANT_ORDERS[variantId] ?? DEMO_ORDER_NEW
  return (
    <OrderDetails
      order={order}
      hasInstallment={Boolean(order.hasInstallment)}
      status={order.status}
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
}

function AuctionDetailsPreview({ variantId }) {
  const cfg =
    AUCTION_DETAILS_VARIANTS[variantId] ??
    AUCTION_DETAILS_VARIANTS['supplier-active']
  return <AuctionDetails {...cfg} onBack={() => {}} />
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

  return (
    <InstallmentTimeline
      items={items}
      onPayNow={() => {}}
      onCancel={() => {}}
    />
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

/* ─── Messenger ─────────────────────────────────────────────────── */

function MessengerPreview({ variantId }) {
  const state = useMessages()

  useEffect(() => {
    if (variantId === 'conversation') state.selectChat('c1')
    else if (variantId === 'with-offer') state.selectChat('c2')
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

/* ─── Router ────────────────────────────────────────────────────── */

/** Live preview for a catalog component id (+ optional variantId) */
export default function ComponentPreview({ previewId, variantId }) {
  switch (previewId) {
    case 'order-details':
      return (
        <OrderDetailsPreview variantId={variantId || 'standard-new'} />
      )
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
    case 'create-auction':
      return <CreateAuctionPreview variantId={variantId || 'supplier'} />
    case 'add-product':
      return <AddProductPreview variantId={variantId || 'supplier'} />
    case 'messenger':
      return <MessengerPreview variantId={variantId || 'inbox'} />
    default:
      return (
        <p className="text-sm text-[var(--secondary-text)]">
          No preview available.
        </p>
      )
  }
}
