/**
 * Component documentation catalog for /developer.
 * Keep in sync when adding shared UI used across panels.
 *
 * Demo / mock payloads live in `src/data/demoData.js`.
 * Import: `import { DEMO_* } from '@/data/demoData'`
 * (Do not import from old per-component demo files — they were removed.)
 */

export const DOC_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'data-display', label: 'Data Display' },
  { id: 'forms', label: 'Forms' },
  { id: 'common', label: 'Common' },
]

/**
 * @typedef {object} PropDoc
 * @property {string} name
 * @property {string} type
 * @property {boolean} required
 * @property {string} [defaultValue]
 * @property {string} description
 */

/** @type {Array<object>} */
export const COMPONENT_DOCS = [
  {
    id: 'order-details',
    name: 'OrderDetails',
    category: 'data-display',
    summary:
      'Order details page driven by hasInstallment + status (new / pending / assigned / cancel).',
    path: 'src/components/data-display/OrderDetails/',
    importExample:
      "import OrderDetails from '@/components/data-display/OrderDetails'\nimport {\n  DEMO_ORDER_NEW,\n  DEMO_ORDER_PENDING,\n  DEMO_ORDER_ASSIGNED,\n  DEMO_ORDER_CANCEL,\n  DEMO_ORDER_INSTALLMENT_NEW,\n  DEMO_ORDER_INSTALLMENT_ASSIGNED,\n  DEMO_ORDER_INSTALLMENT_SUPPLIER,\n} from '@/data/demoData'",
    props: [
      {
        name: 'order',
        type: 'object',
        required: true,
        description: 'Order payload (id, company, products, totals, transporter, …).',
      },
      {
        name: 'hasInstallment',
        type: 'boolean',
        required: false,
        defaultValue: 'order.hasInstallment ?? false',
        description: 'false → standard UI; true → installment UI + timeline.',
      },
      {
        name: 'status',
        type: "'new' | 'pending' | 'assigned' | 'cancel' | 'processing' | 'paid'",
        required: false,
        description: 'Overrides order.status. new → Accept button.',
      },
      {
        name: 'onBack',
        type: '() => void',
        required: false,
        description:
          'Runs when user clicks ← Back. Pass parent handler e.g. () => navigate(-1). Component never navigates itself — omit to hide the button.',
      },
      {
        name: 'onAccept',
        type: '(order) => void',
        required: false,
        description: 'Fired when status is new and Accept is clicked.',
      },
      {
        name: 'onDownloadInvoice',
        type: '(order) => void',
        required: false,
        description: 'Download Invoice (non-new, non-installment).',
      },
      {
        name: 'onChat',
        type: '(transporter) => void',
        required: false,
        description: 'Installment + assigned transporter Chat button.',
      },
      {
        name: 'showPay',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description:
          'true → show Pay Now / Cancel / Not Due on installment timeline. false → hide pay actions.',
      },
      {
        name: 'onPayNow',
        type: '(installment) => void',
        required: false,
        description: 'Called when Pay Now is clicked (only if showPay).',
      },
      {
        name: 'onCancelInstallment',
        type: '(installment) => void',
        required: false,
        description: 'Called when Cancel is clicked (only if showPay).',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description:
          "Wrapper className. Use for layout/padding control, e.g. 'px-3 sm:px-0' on mobile.",
      },
    ],
    requiredExample: `<OrderDetails
  order={DEMO_ORDER_NEW}
  onBack={() => navigate(-1)}
/>`,
    optionalExample: `<OrderDetails
  order={DEMO_ORDER_INSTALLMENT_NEW}
  hasInstallment
  className="px-3 sm:px-0"
  showPay
  onBack={() => navigate(-1)}
  onPayNow={(row) => payInstallment(row.id)}
  onCancelInstallment={(row) => cancelInstallment(row.id)}
/>`,
    previewId: 'order-details',
    variants: [
      {
        id: 'standard-new',
        name: 'Standard · New',
        description: 'hasInstallment=false, status=new → Accept button; no transporter.',
        example: `<OrderDetails
  order={DEMO_ORDER_NEW}
  hasInstallment={false}
  status="new"
  onBack={() => navigate(-1)}
  onAccept={(order) => acceptOrder(order.id)}
/>`,
      },
      {
        id: 'standard-pending',
        name: 'Standard · Pending',
        description: 'Download Invoice; no transporter banner.',
        example: `<OrderDetails
  order={DEMO_ORDER_PENDING}
  hasInstallment={false}
  status="pending"
  onBack={() => navigate(-1)}
  onDownloadInvoice={(order) => download(order.id)}
/>`,
      },
      {
        id: 'standard-assigned',
        name: 'Standard · Assigned',
        description: 'Shows transporter info + Download Invoice.',
        example: `<OrderDetails
  order={DEMO_ORDER_ASSIGNED}
  hasInstallment={false}
  status="assigned"
  onBack={() => navigate(-1)}
  onDownloadInvoice={(order) => download(order.id)}
/>`,
      },
      {
        id: 'standard-cancel',
        name: 'Standard · Cancel',
        description: 'Cancel reason banner; transporter retained if assigned before cancel.',
        example: `<OrderDetails
  order={DEMO_ORDER_CANCEL}
  hasInstallment={false}
  status="cancel"
  onBack={() => navigate(-1)}
/>`,
      },
      {
        id: 'installment-new',
        name: 'Installment · New (with Pay)',
        description: 'showPay + onPayNow — Pay Now when due.',
        example: `<OrderDetails
  order={DEMO_ORDER_INSTALLMENT_NEW}
  hasInstallment
  showPay
  status="new"
  onBack={() => navigate(-1)}
  onPayNow={(row) => pay(row.id)}
  onCancelInstallment={(row) => cancel(row.id)}
/>`,
      },
      {
        id: 'installment-assigned',
        name: 'Installment · Assigned (with Pay)',
        description: 'Transporter banner + Chat; showPay + onPayNow.',
        example: `<OrderDetails
  order={DEMO_ORDER_INSTALLMENT_ASSIGNED}
  hasInstallment
  showPay
  status="assigned"
  onBack={() => navigate(-1)}
  onChat={(t) => openChat(t)}
  onPayNow={(row) => pay(row.id)}
  onCancelInstallment={(row) => cancel(row.id)}
/>`,
      },
      {
        id: 'installment-supplier',
        name: 'Installment · No Pay',
        description: 'Same installment UI without Pay — omit showPay (or showPay={false}).',
        example: `<OrderDetails
  order={DEMO_ORDER_INSTALLMENT_SUPPLIER}
  hasInstallment
  status="assigned"
  onBack={() => navigate(-1)}
  onChat={(t) => openChat(t)}
/>`,
      },
    ],
  },
  {
    id: 'buyer-order-card',
    name: 'BuyerOrderCard',
    category: 'data-display',
    summary:
      'Order row for customer/company account dashboards (/customer/orders). Status badge + primary action.',
    path: 'src/components/data-display/BuyerOrderCard/',
    importExample:
      "import BuyerOrderCard from '@/components/data-display/BuyerOrderCard/BuyerOrderCard'",
    props: [
      {
        name: 'order',
        type: 'object',
        required: true,
        description:
          'id, status (shipped|processing|delivered), image, title, description, priceDisplay, optional action override.',
      },
      {
        name: 'onAction',
        type: '(actionId, order) => void',
        required: false,
        description: 'track | cancel | review from status-driven button.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Extra classes on the card root.',
      },
    ],
    requiredExample: `<BuyerOrderCard order={order} onAction={(id, o) => handle(id, o)} />`,
    optionalExample: `<BuyerOrderCard
  order={{
    ...order,
    action: { id: 'track', labelKey: 'buyerOrders.trackOrder', variant: 'primary' },
  }}
/>`,
    previewId: 'buyer-order-card',
    variants: [
      {
        id: 'shipped',
        name: 'Shipped',
        description: 'Track Order (orange).',
        example: `<BuyerOrderCard order={shippedOrder} />`,
      },
      {
        id: 'processing',
        name: 'Processing',
        description: 'Cancel Order (red).',
        example: `<BuyerOrderCard order={processingOrder} />`,
      },
      {
        id: 'delivered',
        name: 'Delivered',
        description: 'Write a Review (red).',
        example: `<BuyerOrderCard order={deliveredOrder} />`,
      },
    ],
  },
  {
    id: 'buyer-order-information',
    name: 'BuyerOrderInformation',
    category: 'data-display',
    summary:
      'Customer/company order detail: shipping, line items, driver chat, delivery progress.',
    path: 'src/components/data-display/BuyerOrderInformation/',
    importExample:
      "import BuyerOrderInformation from '@/components/data-display/BuyerOrderInformation/BuyerOrderInformation'",
    props: [
      {
        name: 'order',
        type: 'object',
        required: true,
        description: 'orderNumber, status, shippingAddress, lineItems, totalDisplay, driver, progressSteps.',
      },
      {
        name: 'onChatDriver',
        type: '(driver) => void',
        required: false,
        description: 'Chat button on driver card.',
      },
    ],
    requiredExample: `<BuyerOrderInformation order={order} onChatDriver={() => navigate('/messages')} />`,
    previewId: 'buyer-order-information',
    variants: [
      {
        id: 'processing',
        name: 'Processing',
        description: 'Demo CP-992841 layout.',
        example: `<BuyerOrderInformation order={DEMO_BUYER_ORDER_DETAIL} />`,
      },
    ],
  },
  {
    id: 'auction-card',
    name: 'AuctionCard',
    category: 'data-display',
    summary:
      'Role + status driven auction card (supplier/factory created/assigned, transporter bid, admin bids).',
    path: 'src/components/data-display/AuctionCard/',
    importExample:
      "import AuctionCard from '@/components/data-display/AuctionCard'\nimport {\n  DEMO_AUCTION_CREATED,\n  DEMO_AUCTION_ASSIGNED,\n  DEMO_AUCTION_LIVE,\n} from '@/data/demoData'",
    props: [
      {
        name: 'auction',
        type: 'object',
        required: true,
        description: 'Auction / order payload for the card.',
      },
      {
        name: 'role',
        type: "'supplier' | 'factory' | 'transporter' | 'admin'",
        required: false,
        defaultValue: "'supplier'",
        description: 'Controls which card layout to render.',
      },
      {
        name: 'status',
        type: "'open' | 'assigned' | string",
        required: false,
        description: 'supplier/factory: open → created card; assigned → assigned card.',
      },
      {
        name: 'onViewDetails',
        type: '(auction) => void',
        required: false,
        description: 'View Details button callback.',
      },
      {
        name: 'onPlaceBid',
        type: '(bid, auction) => void',
        required: false,
        description: 'Transporter Place Bid callback.',
      },
      {
        name: 'bidValue',
        type: 'string | number',
        required: false,
        description: 'Controlled bid input value.',
      },
      {
        name: 'onBidChange',
        type: '(value) => void',
        required: false,
        description: 'Controlled bid input change.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Optional wrapper class.',
      },
    ],
    requiredExample: `<AuctionCard
  role="supplier"
  status="open"
  auction={DEMO_AUCTION_CREATED}
/>`,
    optionalExample: `<AuctionCard
  role="transporter"
  auction={DEMO_AUCTION_LIVE}
  onPlaceBid={(bid, auction) => placeBid(auction.id, bid)}
/>`,
    previewId: 'auction-card',
    variants: [
      {
        id: 'supplier-created',
        name: 'Supplier · Created',
        description: 'role=supplier, status=open → created order card.',
        example: `<AuctionCard
  role="supplier"
  status="open"
  auction={DEMO_AUCTION_CREATED}
  onViewDetails={(a) => open(a.id)}
/>`,
      },
      {
        id: 'factory-assigned',
        name: 'Factory · Assigned',
        description: 'role=factory, status=assigned → assigned transporter card.',
        example: `<AuctionCard
  role="factory"
  status="assigned"
  auction={DEMO_AUCTION_ASSIGNED}
  onViewDetails={(a) => open(a.id)}
/>`,
      },
      {
        id: 'transporter-live',
        name: 'Transporter · Live bid',
        description: 'Bid input + Place Bid.',
        example: `<AuctionCard
  role="transporter"
  auction={DEMO_AUCTION_LIVE}
  onPlaceBid={(bid, a) => placeBid(a.id, bid)}
/>`,
      },
      {
        id: 'admin-bids',
        name: 'Admin · Competing bids',
        description: 'Lists competing transporter bids.',
        example: `<AuctionCard
  role="admin"
  auction={DEMO_AUCTION_LIVE}
  onViewDetails={(a) => open(a.id)}
/>`,
      },
    ],
  },
  {
    id: 'auction-details',
    name: 'AuctionDetails',
    category: 'data-display',
    summary:
      'Auction details for supplier / factory / transporter. Shipping for supplier & transporter; active → bids; assigned → transporter info (panel roles) or job view (transporter).',
    path: 'src/components/data-display/AuctionDetails/',
    importExample:
      "import AuctionDetails from '@/components/data-display/AuctionDetails'\nimport {\n  DEMO_AUCTION_DETAILS_ACTIVE,\n  DEMO_AUCTION_DETAILS_ASSIGNED,\n  DEMO_AUCTION_DETAILS_TRANSPORTER,\n  DEMO_AUCTION_DETAILS_TRANSPORTER_COMPLETE,\n} from '@/data/demoData'",
    props: [
      {
        name: 'auction',
        type: 'object',
        required: true,
        description: 'Auction detail payload.',
      },
      {
        name: 'role',
        type: "'supplier' | 'factory' | 'transporter'",
        required: false,
        defaultValue: "'supplier'",
        description:
          'supplier/transporter show Shipping; factory hides it. transporter sees Delivery Charge + job layout.',
      },
      {
        name: 'status',
        type: "'active' | 'assigned' | 'complete'",
        required: false,
        description:
          'supplier/factory: active → Competing Bids; assigned/complete → Transporter Info. transporter: assigned/complete → shipping job view.',
      },
      {
        name: 'onBack',
        type: '() => void',
        required: false,
        description:
          'Runs when user clicks ← Back / Back to Dashboard. Pass parent handler e.g. () => navigate(-1) or () => navigate(\'/supplier/auction\'). Omit to hide — no built-in navigation.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Wrapper className.',
      },
    ],
    requiredExample: `<AuctionDetails
  role="supplier"
  status="active"
  auction={DEMO_AUCTION_DETAILS_ACTIVE}
/>`,
    optionalExample: `<AuctionDetails
  role="transporter"
  status="assigned"
  auction={DEMO_AUCTION_DETAILS_TRANSPORTER}
  onBack={() => navigate('/transporter/auction-board')}
/>`,
    previewId: 'auction-details',
    variants: [
      {
        id: 'supplier-active',
        name: 'Supplier · Active',
        description: 'Shipping Details + Competing Bids.',
        example: `<AuctionDetails
  role="supplier"
  status="active"
  auction={DEMO_AUCTION_DETAILS_ACTIVE}
  onBack={() => navigate(-1)}
/>`,
      },
      {
        id: 'supplier-assigned',
        name: 'Supplier · Assigned',
        description: 'Shipping Details + Transporter Information.',
        example: `<AuctionDetails
  role="supplier"
  status="assigned"
  auction={DEMO_AUCTION_DETAILS_ASSIGNED}
  onBack={() => navigate(-1)}
/>`,
      },
      {
        id: 'factory-active',
        name: 'Factory · Active',
        description: 'No shipping card; Competing Bids.',
        example: `<AuctionDetails
  role="factory"
  status="active"
  auction={DEMO_AUCTION_DETAILS_ACTIVE}
  onBack={() => navigate(-1)}
/>`,
      },
      {
        id: 'factory-assigned',
        name: 'Factory · Assigned',
        description: 'No shipping card; Transporter Information.',
        example: `<AuctionDetails
  role="factory"
  status="assigned"
  auction={DEMO_AUCTION_DETAILS_ASSIGNED}
  onBack={() => navigate(-1)}
/>`,
      },
      {
        id: 'transporter-assigned',
        name: 'Transporter · Assigned',
        description:
          'Job view: Auction ID, Delivery Charge, Customer + Shipping, Product with quantity.',
        example: `<AuctionDetails
  role="transporter"
  status="assigned"
  auction={DEMO_AUCTION_DETAILS_TRANSPORTER}
  onBack={() => navigate(-1)}
/>`,
      },
      {
        id: 'transporter-complete',
        name: 'Transporter · Complete',
        description: 'Same transporter job layout for completed auctions.',
        example: `<AuctionDetails
  role="transporter"
  status="complete"
  auction={DEMO_AUCTION_DETAILS_TRANSPORTER_COMPLETE}
  onBack={() => navigate(-1)}
/>`,
      },
    ],
  },
  {
    id: 'product-card',
    name: 'ProductCard',
    category: 'data-display',
    summary:
      'Listing / dashboard product card. Layout from type + role + context + status + tag.',
    path: 'src/components/data-display/ProductCard/',
    importExample:
      "import ProductCard from '@/components/data-display/ProductCard/ProductCard'",
    props: [
      {
        name: 'product',
        type: 'object',
        required: true,
        description: 'Product fields (image, title, price, …).',
      },
      {
        name: 'type',
        type: "'normal' | 'sponsored' | 'dashboard' | 'featured'",
        required: false,
        defaultValue: "'normal'",
        description: 'Card layout family.',
      },
      {
        name: 'role',
        type: 'string',
        required: false,
        defaultValue: "'none'",
        description: 'customer | company | supplier | factory | admin.',
      },
      {
        name: 'context',
        type: 'string',
        required: false,
        defaultValue: "'listing'",
        description: 'e.g. listing | approval | promotion | promo_code.',
      },
      {
        name: 'status',
        type: 'string | null',
        required: false,
        defaultValue: 'null',
        description: 'pending | rejected | active | featured | …',
      },
      {
        name: 'tag',
        type: 'string | null',
        required: false,
        description: 'sponsored | featured | regular | bulk_order.',
      },
      {
        name: 'showQuantity',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Show quantity stepper.',
      },
      {
        name: 'onAction',
        type: '(actionId, product) => void',
        required: false,
        description: 'Action button handler.',
      },
    ],
    requiredExample: `<ProductCard
  product={product}
  type="normal"
  role="customer"
/>`,
    optionalExample: `<ProductCard
  type="dashboard"
  role="supplier"
  status="pending"
  product={product}
  onAction={(id, product) => handle(id, product)}
/>`,
    previewId: 'product-card',
    variants: [
      {
        id: 'sponsored-customer',
        name: 'Sponsored · Customer',
        description: 'Sponsored listing for customer.',
        example: `<ProductCard type="sponsored" role="customer" tag="sponsored" product={product} />`,
      },
      {
        id: 'sponsored-company',
        name: 'Sponsored · Company',
        description: 'Dual price (retail + company).',
        example: `<ProductCard type="sponsored" role="company" tag="sponsored" product={product} />`,
      },
      {
        id: 'normal-customer',
        name: 'Normal · Customer',
        description: 'Standard listing card.',
        example: `<ProductCard type="normal" role="customer" product={product} />`,
      },
      {
        id: 'normal-company',
        name: 'Normal · Company',
        description: 'Dual price for company buyers.',
        example: `<ProductCard type="normal" role="company" product={product} />`,
      },
      {
        id: 'normal-qty',
        name: 'Normal · Qty + cart',
        description: 'Quantity stepper + Add to Cart.',
        example: `<ProductCard type="normal" role="customer" showQuantity product={product} />`,
      },
      {
        id: 'supplier-regular',
        name: 'Supplier · Regular',
        description: 'Dashboard card, Regular tag.',
        example: `<ProductCard type="dashboard" role="supplier" tag="regular" product={product} />`,
      },
      {
        id: 'supplier-bulk',
        name: 'Supplier · Bulk Order',
        description: 'Dashboard card, Bulk Order tag.',
        example: `<ProductCard type="dashboard" role="supplier" tag="bulk_order" product={product} />`,
      },
      {
        id: 'supplier-pending',
        name: 'Supplier · Pending',
        description: 'Awaiting approval.',
        example: `<ProductCard type="dashboard" role="supplier" status="pending" product={product} />`,
      },
      {
        id: 'supplier-rejected',
        name: 'Supplier · Rejected',
        description: 'Rejected product state.',
        example: `<ProductCard type="dashboard" role="supplier" status="rejected" product={product} />`,
      },
      {
        id: 'featured',
        name: 'Featured',
        description: 'Featured marketing card.',
        example: `<ProductCard type="featured" tag="featured" product={product} />`,
      },
      {
        id: 'promo-code',
        name: 'Promo code',
        description: 'context=promo_code with promo label.',
        example: `<ProductCard type="dashboard" context="promo_code" role="supplier" product={product} />`,
      },
      {
        id: 'supplier-buy-factory',
        name: 'Supplier · Buy from factory',
        description: 'Supplier buying from factory (normal layout).',
        example: `<ProductCard type="normal" role="supplier" product={product} />`,
      },
      {
        id: 'factory-active',
        name: 'Factory · Active',
        description: 'Factory dashboard active product.',
        example: `<ProductCard type="dashboard" role="factory" status="active" product={product} />`,
      },
      {
        id: 'factory-pending',
        name: 'Factory · Pending',
        description: 'Factory dashboard pending.',
        example: `<ProductCard type="dashboard" role="factory" status="pending" product={product} />`,
      },
      {
        id: 'factory-rejected',
        name: 'Factory · Rejected',
        description: 'Factory dashboard rejected.',
        example: `<ProductCard type="dashboard" role="factory" status="rejected" product={product} />`,
      },
      {
        id: 'admin-approval-pending',
        name: 'Admin approval · Pending',
        description: 'context=approval, status=pending.',
        example: `<ProductCard type="dashboard" role="admin" context="approval" status="pending" product={product} />`,
      },
      {
        id: 'admin-approval-active',
        name: 'Admin approval · Active',
        description: 'context=approval, status=active.',
        example: `<ProductCard type="dashboard" role="admin" context="approval" status="active" product={product} />`,
      },
      {
        id: 'admin-approval-rejected',
        name: 'Admin approval · Rejected',
        description: 'context=approval, status=rejected.',
        example: `<ProductCard type="dashboard" role="admin" context="approval" status="rejected" product={product} />`,
      },
      {
        id: 'admin-promo-pending',
        name: 'Admin promo · Pending',
        description: 'context=promotion, status=pending.',
        example: `<ProductCard type="dashboard" role="admin" context="promotion" status="pending" product={product} />`,
      },
      {
        id: 'admin-promo-active',
        name: 'Admin promo · Active',
        description: 'context=promotion, status=active.',
        example: `<ProductCard type="dashboard" role="admin" context="promotion" status="active" product={product} />`,
      },
      {
        id: 'admin-promo-featured',
        name: 'Admin promo · Featured',
        description: 'context=promotion, status=featured.',
        example: `<ProductCard type="dashboard" role="admin" context="promotion" status="featured" product={product} />`,
      },
      {
        id: 'admin-promo-completed',
        name: 'Admin promo · Completed',
        description: 'context=promotion, status=completed.',
        example: `<ProductCard type="dashboard" role="admin" context="promotion" status="completed" product={product} />`,
      },
    ],
  },
  {
    id: 'product-listing-card',
    name: 'ProductListingCard',
    category: 'data-display',
    summary:
      'Public /products grid: customer/guest → Bulk option + qty + Add to Cart; company → Min ord + price (link to PDP).',
    path: 'src/components/data-display/ProductListingCard/',
    importExample:
      "import ProductListingCard from '@/components/data-display/ProductListingCard/ProductListingCard'",
    props: [
      {
        name: 'product',
        type: 'object',
        required: true,
        description: 'image, title, description, priceText, bulkOptionLabel, companyPriceText, …',
      },
      {
        name: 'role',
        type: 'string',
        required: false,
        defaultValue: "'customer'",
        description:
          'customer (guest/retail) or company — use resolveStorefrontBuyerRole(auth user) on /products.',
      },
      {
        name: 'showQuantity',
        type: 'boolean',
        required: false,
        defaultValue: '(auto)',
        description:
          'Omitted: false for company, true for customer/guest. Set explicitly to override.',
      },
      {
        name: 'actions',
        type: 'array',
        required: false,
        defaultValue: '[]',
        description: 'Optional footer actions (e.g. View Details when showQuantity is false).',
      },
      {
        name: 'onAction',
        type: '(actionId, product) => void',
        required: false,
        description: 'Action handler when actions are shown.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        description: 'Extra classes on the card root.',
      },
    ],
    requiredExample: `<ProductListingCard product={product} />`,
    optionalExample: `<ProductListingCard
  product={product}
  actions={[{ id: 'view_details', kind: 'full', label: 'View Details', variant: 'primary' }]}
  onAction={(id) => navigate(\`/products/\${product.slug}\`)}
/>`,
    previewId: 'product-listing-card',
    variants: [
      {
        id: 'customer',
        name: 'Catalog · Customer (guest)',
        description: 'Default /products layout with qty + Add to Cart.',
        example: `<ProductListingCard product={product} role="customer" onAction={handle} />`,
      },
      {
        id: 'default',
        name: 'Catalog · Company',
        description: 'Min ord + price; no qty/cart (logged-in company).',
        example: `<ProductListingCard product={product} role="company" />`,
      },
      {
        id: 'with-actions',
        name: 'With View Details',
        description: 'Same card with a primary footer action.',
        example: `<ProductListingCard product={product} actions={viewDetailsAction} onAction={onAction} />`,
      },
    ],
  },
  {
    id: 'product-details',
    name: 'ProductDetails',
    category: 'data-display',
    summary:
      'Full product details page. Role drives actions, seller card, tabs, warehouse fields.',
    path: 'src/components/data-display/ProductDetails/',
    importExample:
      "import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails'\nimport { DEMO_PRODUCT, ADMIN_PRODUCT } from '@/data/demoData'",
    props: [
      {
        name: 'product',
        type: 'object',
        required: true,
        description: 'Product detail payload.',
      },
      {
        name: 'role',
        type: "'customer' | 'company' | 'supplier' | 'factory' | 'admin'",
        required: false,
        defaultValue: "'customer'",
        description: 'Resolves actions / tabs via resolveDetailsView.',
      },
      {
        name: 'quantity',
        type: 'number',
        required: false,
        description: 'Controlled quantity.',
      },
      {
        name: 'onQuantityChange',
        type: '(n) => void',
        required: false,
        description: 'Quantity change callback.',
      },
      {
        name: 'onAction',
        type: '(actionId, product, qty) => void',
        required: false,
        description: 'Add to cart / buy now / accept / reject.',
      },
    ],
    requiredExample: `<ProductDetails
  role="customer"
  product={DEMO_PRODUCT}
/>`,
    optionalExample: `<ProductDetails
  role="company"
  product={DEMO_PRODUCT}
  onAction={(actionId, product, qty) => handle(actionId, qty)}
/>`,
    previewId: 'product-details',
    variants: [
      {
        id: 'customer',
        name: 'Customer',
        description: 'Qty, Add to cart / Buy now, store seller, REVIEW tab.',
        example: `<ProductDetails role="customer" product={DEMO_PRODUCT} onAction={handle} />`,
      },
      {
        id: 'company',
        name: 'Company',
        description: 'Same as customer + Send quote + min order.',
        example: `<ProductDetails role="company" product={DEMO_PRODUCT} onAction={handle} />`,
      },
      {
        id: 'supplier',
        name: 'Supplier / Factory',
        description: 'Warehouse fields; no cart actions; REVIEW tab.',
        example: `<ProductDetails role="supplier" product={DEMO_PRODUCT} />`,
      },
      {
        id: 'admin',
        name: 'Admin',
        description: 'Accept / Reject; supplier seller; SUPPLIER DETAILS tab.',
        example: `<ProductDetails role="admin" product={ADMIN_PRODUCT} onAction={handle} />`,
      },
    ],
  },
  {
    id: 'status-card',
    name: 'StatusCard',
    category: 'data-display',
    summary:
      'Dashboard metric / status card. One component covers all layouts via variant + tone props.',
    path: 'src/components/data-display/StatusCard/',
    importExample:
      "import StatusCard from '@/components/data-display/StatusCard'\nimport { DEMO_STATUS_CARDS } from '@/data/demoData'",
    props: [
      {
        name: 'variant',
        type: "'default' | 'inline' | 'action' | 'filled' | 'status' | 'badge' | 'summary'",
        required: false,
        defaultValue: "'default'",
        description: 'Layout family for the card.',
      },
      {
        name: 'label',
        type: 'string',
        required: false,
        description: 'Title / metric name.',
      },
      {
        name: 'value',
        type: 'string | number',
        required: true,
        description: 'Primary metric value.',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Subtitle / footer text (also used as filled subLabel).',
      },
      {
        name: 'icon',
        type: 'ComponentType',
        required: false,
        description: 'react-icons (or any) icon component.',
      },
      {
        name: 'iconTone',
        type: "'brand' | 'purple' | 'teal' | 'red' | 'warning' | 'gray'",
        required: false,
        defaultValue: "'brand'",
        description: 'Icon + tinted icon-box colors.',
      },
      {
        name: 'tone',
        type: "'default' | 'brand' | 'warning' | 'danger' | 'success'",
        required: false,
        defaultValue: "'default'",
        description: 'Colors value/footer/badge/filled background.',
      },
      {
        name: 'badge',
        type: 'string | number',
        required: false,
        description: 'Count chip (badge variant).',
      },
      {
        name: 'actionLabel',
        type: 'string',
        required: false,
        description: 'CTA button label (action variant).',
      },
      {
        name: 'onAction',
        type: '() => void',
        required: false,
        description: 'CTA click handler (action variant).',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Wrapper className.',
      },
    ],
    requiredExample: `<StatusCard label="Total Users" value="12,453" />`,
    optionalExample: `<StatusCard
  variant="default"
  label="Active Suppliers"
  value="342"
  icon={FiBriefcase}
  iconTone="brand"
/>`,
    previewId: 'status-card',
    variants: [
      {
        id: 'active-suppliers',
        name: 'Default · Icon + label + value',
        description: 'Active Suppliers style.',
        example: `<StatusCard
  variant="default"
  label="Active Suppliers"
  value="342"
  icon={FiBriefcase}
  iconTone="brand"
/>`,
      },
      {
        id: 'total-users',
        name: 'Default · Label + value',
        description: 'Total Users — no icon.',
        example: `<StatusCard label="Total Users" value="12,453" />`,
      },
      {
        id: 'referred-clients',
        name: 'Default · With description',
        description: 'Referred Clients + subtitle.',
        example: `<StatusCard
  label="Referred Clients"
  value="18"
  description="Active paying subscriptions"
  icon={FiShoppingBag}
/>`,
      },
      {
        id: 'inline-referred',
        name: 'Inline · Icon right',
        description: 'TOTAL REFERRED CLIENT with purple icon box.',
        example: `<StatusCard
  variant="inline"
  label="Total Referred Client"
  value="13"
  icon={FiUser}
  iconTone="purple"
/>`,
      },
      {
        id: 'available-balance',
        name: 'Action · Withdraw CTA',
        description: 'Available Balance + Withdraw Funds button.',
        example: `<StatusCard
  variant="action"
  label="Available Balance"
  value="€67,400.00"
  icon={FiDollarSign}
  actionLabel="Withdraw Funds"
  onAction={withdraw}
/>`,
      },
      {
        id: 'total-earnings',
        name: 'Filled · Earnings',
        description: 'Solid brand card with icon + All time.',
        example: `<StatusCard
  variant="filled"
  label="Total Earnings"
  value="€580K"
  description="All time"
  icon={FiDollarSign}
  tone="brand"
/>`,
      },
      {
        id: 'admin-commission',
        name: 'Default · Emphasis text',
        description: 'Admin Commission — title / % / per-order note.',
        example: `<StatusCard
  label="Admin Comission"
  value="20%"
  description="20% per order"
/>`,
      },
      {
        id: 'payment-overdue',
        name: 'Status · Danger',
        description: 'Payment Overdue with alert icon.',
        example: `<StatusCard
  variant="status"
  label="Payment Overdue"
  value="€12,400"
  description="3 orders"
  tone="danger"
/>`,
      },
      {
        id: 'pending-badge',
        name: 'Badge · Count chip',
        description: 'Pending with circular badge.',
        example: `<StatusCard
  variant="badge"
  label="Pending"
  value="18"
  badge={18}
  tone="brand"
/>`,
      },
      {
        id: 'total-documents',
        name: 'Filled · Documents',
        description: 'Solid brand — label + value only.',
        example: `<StatusCard
  variant="filled"
  label="Total Documents"
  value="4"
  tone="brand"
/>`,
      },
      {
        id: 'total-products',
        name: 'Summary · Icon top-right',
        description: 'Total Products + Active SKUs.',
        example: `<StatusCard
  variant="summary"
  label="Total Products"
  value="42"
  description="Active SKU'S"
  icon={FiHome}
  iconTone="teal"
/>`,
      },
      {
        id: 'low-stock',
        name: 'Status · Warning',
        description: 'Low Stock Items.',
        example: `<StatusCard
  variant="status"
  label="Low Stock Items"
  value="5"
  description="Need Reorder"
  tone="warning"
/>`,
      },
      {
        id: 'out-of-stock',
        name: 'Status · Critical',
        description: 'Out Of Stock.',
        example: `<StatusCard
  variant="status"
  label="Out Of Stock"
  value="2"
  description="Urgent action needed"
  tone="danger"
/>`,
      },
    ],
  },
  {
    id: 'data-table',
    name: 'DataTable',
    category: 'data-display',
    summary:
      'Prop-driven table toolkit: tabs, search, filters, actions, pagination, loading.',
    path: 'src/components/data-display/DataTable/',
    importExample:
      "import DataTable from '@/components/data-display/DataTable/DataTable'",
    props: [
      {
        name: 'columns',
        type: 'Array<{ key, header, render?, className? }>',
        required: true,
        description: 'Column definitions.',
      },
      {
        name: 'data',
        type: 'array',
        required: true,
        description: 'Row data.',
      },
      {
        name: 'showTable',
        type: 'boolean',
        required: false,
        defaultValue: 'true',
        description: 'Toggle table body.',
      },
      {
        name: 'showSearch',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Show search input.',
      },
      {
        name: 'showFilters',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Show filter selects.',
      },
      {
        name: 'showTabs',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Show tabs bar.',
      },
      {
        name: 'showActions',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Row action menu/buttons.',
      },
      {
        name: 'showPagination',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Pagination footer.',
      },
      {
        name: 'loading',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Skeleton rows.',
      },
      {
        name: 'showCard',
        type: 'boolean',
        required: false,
        defaultValue: 'true',
        description: 'Card chrome around table.',
      },
      {
        name: 'bgClassName',
        type: 'string',
        required: false,
        defaultValue: "'bg-white'",
        description: 'Card background class.',
      },
    ],
    requiredExample: `<DataTable
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' },
  ]}
  data={rows}
/>`,
    optionalExample: `<DataTable
  columns={columns}
  data={rows}
  showSearch
  searchValue={q}
  onSearchChange={setQ}
  showActions
  actions={[{ id: 'edit', label: 'Edit' }]}
  showPagination
  pagination={pagination}
/>`,
    previewId: 'data-table',
    variants: [
      {
        id: 'full',
        name: 'Full featured',
        description: 'Tabs + search + filters + menu actions + pagination.',
        example: `<DataTable
  columns={columns}
  data={rows}
  showTabs
  tabs={tabs}
  showSearch
  showFilters
  showActions
  actionType="menu"
  actions={actions}
  showPagination
  pagination={pagination}
/>`,
      },
      {
        id: 'action-buttons',
        name: 'Action buttons',
        description: 'Inline row action buttons.',
        example: `<DataTable
  columns={columns}
  data={rows}
  showActions
  actionType="buttons"
  actions={buttonActions}
/>`,
      },
      {
        id: 'table-only',
        name: 'Table only',
        description: 'Bare table — no chrome.',
        example: `<DataTable columns={columns} data={rows} />`,
      },
      {
        id: 'tabs-table',
        name: 'Tabs + table',
        description: 'Tabs bar without search/filters.',
        example: `<DataTable columns={columns} data={rows} showTabs tabs={tabs} activeTab={tab} onTabChange={setTab} />`,
      },
      {
        id: 'search-filters',
        name: 'Search + filters',
        description: 'Search and filter controls, no tabs.',
        example: `<DataTable columns={columns} data={rows} showSearch showFilters filters={filters} />`,
      },
      {
        id: 'loading',
        name: 'Loading skeleton',
        description: 'loading=true skeleton rows.',
        example: `<DataTable columns={columns} data={[]} loading skeletonRows={5} />`,
      },
      {
        id: 'empty',
        name: 'Empty state',
        description: 'No rows + emptyMessage.',
        example: `<DataTable columns={columns} data={[]} emptyMessage="No orders match your filters." showSearch />`,
      },
      {
        id: 'no-card',
        name: 'No card shell',
        description: 'showCard=false for embedding in custom layout.',
        example: `<DataTable showCard={false} columns={columns} data={rows} />`,
      },
    ],
  },
  {
    id: 'installment-timeline',
    name: 'InstallmentTimeline',
    category: 'data-display',
    summary: 'Vertical timeline of completed / pending installments with Pay Now.',
    path: 'src/components/data-display/InstallmentTimeline/',
    importExample:
      "import InstallmentTimeline from '@/components/data-display/InstallmentTimeline/InstallmentTimeline'\nimport { DEMO_INSTALLMENTS } from '@/data/demoData'",
    props: [
      {
        name: 'items',
        type: 'Array<{ id, title, status, dueDate, amount, quantity? }>',
        required: true,
        description: 'Installment list. status: completed | pending.',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        defaultValue: "'Installment Timeline'",
        description: 'Section heading.',
      },
      {
        name: 'showPay',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'true → show Pay Now / Cancel / Not Due. false → timeline only.',
      },
      {
        name: 'onPayNow',
        type: '(item) => void',
        required: false,
        description: 'Called when Pay Now is clicked (only if showPay).',
      },
      {
        name: 'onCancel',
        type: '(item) => void',
        required: false,
        description: 'Called when Cancel is clicked (only if showPay).',
      },
    ],
    requiredExample: `<InstallmentTimeline items={DEMO_INSTALLMENTS} />`,
    optionalExample: `<InstallmentTimeline
  items={DEMO_INSTALLMENTS}
  showPay
  onPayNow={(item) => pay(item.id)}
  onCancel={(item) => cancel(item.id)}
/>`,
    previewId: 'installment-timeline',
    variants: [
      {
        id: 'mixed',
        name: 'Mixed (with Pay)',
        description: 'Completed + pending; showPay on.',
        example: `<InstallmentTimeline
  items={DEMO_INSTALLMENTS}
  showPay
  onPayNow={(item) => pay(item.id)}
  onCancel={(item) => cancel(item.id)}
/>`,
      },
      {
        id: 'all-pending',
        name: 'All pending (with Pay)',
        description: 'Every row shows Pay Now / Cancel when due.',
        example: `<InstallmentTimeline
  items={items.map((i) => ({ ...i, status: 'pending' }))}
  showPay
  onPayNow={pay}
/>`,
      },
      {
        id: 'all-completed',
        name: 'All completed',
        description: 'Every row shows Paid.',
        example: `<InstallmentTimeline items={items.map((i) => ({ ...i, status: 'completed' }))} />`,
      },
      {
        id: 'no-pay',
        name: 'No Pay',
        description: 'showPay={false} — timeline only, no Pay/Cancel.',
        example: `<InstallmentTimeline items={DEMO_INSTALLMENTS} />`,
      },
    ],
  },
  {
    id: 'create-auction',
    name: 'CreateAuction',
    category: 'forms',
    summary:
      'Shipment Information form. Supplier includes shipping/unloading; factory omits that section.',
    path: 'src/components/forms/CreateAuction/',
    importExample:
      "import CreateAuction from '@/components/forms/CreateAuction'\nimport {\n  DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS,\n  DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS,\n} from '@/data/demoData'",
    props: [
      {
        name: 'role',
        type: "'supplier' | 'factory'",
        required: false,
        defaultValue: "'supplier'",
        description: 'supplier → shipping section; factory → without it.',
      },
      {
        name: 'onSubmit',
        type: '(form) => void',
        required: false,
        description: 'Submit Auction handler.',
      },
      {
        name: 'onBack',
        type: '() => void',
        required: false,
        description:
          'Runs when user clicks ← Back to Dashboard. Pass parent handler e.g. () => navigate(-1). Omit to hide — component does not navigate itself.',
      },
      {
        name: 'placeholders',
        type: 'object',
        required: false,
        description: 'Per-field placeholder overrides.',
      },
      {
        name: 'defaultValue',
        type: 'object',
        required: false,
        description: 'Initial form values.',
      },
      {
        name: 'value',
        type: 'object',
        required: false,
        description: 'Controlled form value.',
      },
      {
        name: 'onChange',
        type: '(form) => void',
        required: false,
        description: 'Controlled change handler.',
      },
    ],
    requiredExample: `<CreateAuction role="supplier" onSubmit={handleSubmit} />`,
    optionalExample: `<CreateAuction
  role="factory"
  placeholders={DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS}
  onBack={() => navigate('/factory')}
  onSubmit={(payload) => createAuction(payload)}
/>`,
    previewId: 'create-auction',
    variants: [
      {
        id: 'supplier',
        name: 'Supplier · With shipping',
        description: 'Includes Shipping / unloading section.',
        example: `<CreateAuction
  role="supplier"
  placeholders={DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS}
  onBack={() => navigate(-1)}
  onSubmit={handleSubmit}
/>`,
      },
      {
        id: 'factory',
        name: 'Factory · No shipping',
        description: 'Same form without shipping/unloading section.',
        example: `<CreateAuction
  role="factory"
  placeholders={DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS}
  onBack={() => navigate(-1)}
  onSubmit={handleSubmit}
/>`,
      },
    ],
  },
  {
    id: 'add-product',
    name: 'AddProduct',
    category: 'forms',
    summary: 'Add Product form. role=supplier (full) | factory (simplified).',
    path: 'src/components/forms/AddProduct/',
    importExample:
      "import AddProduct from '@/components/forms/AddProduct/AddProduct'\nimport { DEMO_ADD_PRODUCT, DEMO_FACTORY_PRODUCT } from '@/data/demoData'",
    props: [
      {
        name: 'role',
        type: "'supplier' | 'factory'",
        required: false,
        defaultValue: "'supplier'",
        description: 'Form field set.',
      },
      {
        name: 'defaultValue',
        type: 'object',
        required: false,
        description: 'Initial product fields.',
      },
      {
        name: 'onSubmit',
        type: '(payload) => void',
        required: false,
        description: 'Submit handler.',
      },
      {
        name: 'onBack',
        type: '() => void',
        required: false,
        description:
          'Runs when user clicks ← Back. Pass parent handler e.g. () => navigate(-1). Omit to hide — component does not navigate itself.',
      },
      {
        name: 'onAiAssist',
        type: '(section, form) => Promise<string>',
        required: false,
        description: 'AI assist for description/feature sections.',
      },
    ],
    requiredExample: `<AddProduct role="supplier" onSubmit={handleSubmit} />`,
    optionalExample: `<AddProduct
  role="factory"
  defaultValue={DEMO_FACTORY_PRODUCT}
  onBack={() => navigate(-1)}
  onSubmit={(payload) => save(payload)}
/>`,
    previewId: 'add-product',
    variants: [
      {
        id: 'supplier',
        name: 'Supplier · Full form',
        description: 'Category/SKU, bulk tiers, AI sections, images.',
        example: `<AddProduct
  role="supplier"
  defaultValue={DEMO_ADD_PRODUCT}
  onBack={() => navigate(-1)}
  onSubmit={handleSubmit}
/>`,
      },
      {
        id: 'factory',
        name: 'Factory · Simplified',
        description: 'Reduced field set for factory products.',
        example: `<AddProduct
  role="factory"
  defaultValue={DEMO_FACTORY_PRODUCT}
  onBack={() => navigate(-1)}
  onSubmit={handleSubmit}
/>`,
      },
    ],
  },
  {
    id: 'dispute-resolution',
    name: 'DisputeResolution',
    category: 'data-display',
    summary:
      'Dispute & returns detail. variant=public (status meta) | dashboard (header + status pills).',
    path: 'src/components/data-display/DisputeResolution/',
    importExample:
      "import DisputeResolution from '@/components/data-display/DisputeResolution'\nimport { DEMO_DISPUTE_PUBLIC, DEMO_DISPUTE_DASHBOARD } from '@/data/demoData'",
    props: [
      {
        name: 'variant',
        type: "'public' | 'dashboard'",
        required: false,
        defaultValue: "'public'",
        description:
          'public → status/created on description card; dashboard → page header + Resolved/Under Review pills.',
      },
      {
        name: 'dispute',
        type: 'object',
        required: false,
        description:
          '{ items, description, evidence, messages, status, createdAt }',
      },
      {
        name: 'currentUserRole',
        type: 'string',
        required: false,
        defaultValue: "'buyer'",
        description: 'Aligns own messages to the right when role matches.',
      },
      {
        name: 'onSendMessage',
        type: '(text) => void',
        required: false,
        description: 'Composer submit handler.',
      },
      {
        name: 'onStatusChange',
        type: "(status: 'resolved' | 'under_review') => void",
        required: false,
        description: 'Dashboard status pills only.',
      },
      {
        name: 'onAttach',
        type: '(files) => void',
        required: false,
        description: 'Paperclip file picker.',
      },
    ],
    requiredExample: `<DisputeResolution variant="public" dispute={DEMO_DISPUTE_PUBLIC} />`,
    optionalExample: `<DisputeResolution
  variant="dashboard"
  dispute={DEMO_DISPUTE_DASHBOARD}
  currentUserRole="admin"
  onStatusChange={setStatus}
  onSendMessage={send}
/>`,
    previewId: 'dispute-resolution',
    variants: [
      {
        id: 'public',
        name: 'Public end',
        description: 'Status + created meta; no page header; no status pills.',
        example: `<DisputeResolution
  variant="public"
  dispute={DEMO_DISPUTE_PUBLIC}
  currentUserRole="buyer"
  onSendMessage={send}
/>`,
      },
      {
        id: 'dashboard',
        name: 'Dashboard',
        description:
          'Disputes & Returns Center header; Resolved / Under Review pills.',
        example: `<DisputeResolution
  variant="dashboard"
  dispute={DEMO_DISPUTE_DASHBOARD}
  currentUserRole="admin"
  onStatusChange={setStatus}
  onSendMessage={send}
/>`,
      },
    ],
  },
  {
    id: 'delivery-timeline',
    name: 'DeliveryTimeline',
    category: 'data-display',
    summary:
      'Delivery progress card(s) with actions by status: assigned, picked_up, in_transit, delivered.',
    path: 'src/components/data-display/DeliveryTimeline/',
    importExample:
      "import DeliveryTimeline from '@/components/data-display/DeliveryTimeline'\nimport { DEMO_DELIVERY_TIMELINE_ITEMS } from '@/data/demoData'",
    props: [
      {
        name: 'items',
        type: 'Array<DeliveryItem>',
        required: true,
        description:
          '{ id, title, orderLabel, price, distance, status, pickup, delivery }',
      },
      {
        name: 'onStartTrip',
        type: '(item) => void',
        required: false,
        description: 'Primary action when status=assigned.',
      },
      {
        name: 'onMarkPickedUp',
        type: '(item) => void',
        required: false,
        description: 'Secondary action when status=assigned.',
      },
      {
        name: 'onNavigateToDelivery',
        type: '(item) => void',
        required: false,
        description: 'Primary action when status=picked_up.',
      },
      {
        name: 'onVerifyDelivery',
        type: '(item) => void',
        required: false,
        description: 'Primary action when status=in_transit.',
      },
      {
        name: 'onSeeDetails',
        type: '(item) => void',
        required: false,
        description: 'See Details action for every status.',
      },
    ],
    requiredExample: `<DeliveryTimeline items={DEMO_DELIVERY_TIMELINE_ITEMS} />`,
    optionalExample: `<DeliveryTimeline
  items={DEMO_DELIVERY_TIMELINE_ITEMS}
  onStartTrip={(item) => startTrip(item.id)}
  onMarkPickedUp={(item) => markPicked(item.id)}
  onNavigateToDelivery={(item) => openMap(item.id)}
  onVerifyDelivery={(item) => verify(item.id)}
  onSeeDetails={(item) => navigate(item.id)}
/>`,
    previewId: 'delivery-timeline',
    variants: [
      {
        id: 'mixed',
        name: 'Mixed statuses',
        description: 'List containing assigned, picked_up, in_transit and delivered.',
        example: `<DeliveryTimeline items={DEMO_DELIVERY_TIMELINE_ITEMS} />`,
      },
      {
        id: 'assigned',
        name: 'Assigned',
        description: 'Before pickup: Start Trip + Mark Picked Up.',
        example: `<DeliveryTimeline items={items.filter((x) => x.status === 'assigned')} />`,
      },
      {
        id: 'picked-up',
        name: 'Picked Up',
        description: 'After pickup: Navigate to Delivery action.',
        example: `<DeliveryTimeline items={items.filter((x) => x.status === 'picked_up')} />`,
      },
      {
        id: 'in-transit',
        name: 'In Transit',
        description: 'In route: Verify Delivery action.',
        example: `<DeliveryTimeline items={items.filter((x) => x.status === 'in_transit')} />`,
      },
      {
        id: 'delivered',
        name: 'Delivered',
        description: 'Completed: only See Details.',
        example: `<DeliveryTimeline items={items.filter((x) => x.status === 'delivered')} />`,
      },
    ],
  },
  {
    id: 'panel-profile',
    name: 'PanelProfile',
    category: 'forms',
    summary:
      'Shared My Profile for panel roles. Mockups: admin, affiliate, transporter (split cards), factory, supplier.',
    path: 'src/components/forms/PanelProfile/',
    importExample:
      "import PanelProfile from '@/components/forms/PanelProfile'\nimport {\n  DEMO_PANEL_PROFILE_ADMIN,\n  DEMO_PANEL_PROFILE_AFFILIATE,\n  DEMO_PANEL_PROFILE_CUSTOMER,\n  DEMO_PANEL_PROFILE_TRANSPORTER,\n  DEMO_PANEL_PROFILE_FACTORY,\n  DEMO_PANEL_PROFILE_SUPPLIER,\n} from '@/data/demoData'",
    props: [
      {
        name: 'role',
        type: "'admin' | 'affiliate' | 'transporter' | 'factory' | 'supplier'",
        required: false,
        defaultValue: "'supplier'",
        description:
          'Drives layout + sections from the design map (see roleConfig.js).',
      },
      {
        name: 'defaultValue',
        type: 'object',
        required: false,
        description:
          '{ displayName, displayEmail, name, email, phone, warehouses, iban, ibanPhone, … }',
      },
      {
        name: 'layout',
        type: "'combined' | 'split'",
        required: false,
        description:
          'combined = one main card; split = avatar/info + password as separate cards (transporter).',
      },
      {
        name: 'showWarehouses',
        type: 'boolean',
        required: false,
        description: 'Override role default for warehouse section.',
      },
      {
        name: 'showAccountPhone',
        type: 'boolean',
        required: false,
        description: 'Override whether phone shows under account fields.',
      },
      {
        name: 'passwordMode',
        type: "'full' | 'simple'",
        required: false,
        description:
          "full → Current + New + Confirm; simple → New + Confirm only.",
      },
      {
        name: 'showIban',
        type: 'boolean',
        required: false,
        description: 'Show/hide the IBAN card.',
      },
      {
        name: 'showAvatarActions',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'true → Upload New / Remove (transporter layout).',
      },
      {
        name: 'onUpdateProfile',
        type: '(payload) => void',
        required: false,
        description: 'Account Information save.',
      },
      {
        name: 'onSaveWarehouses',
        type: '(warehouses) => void',
        required: false,
        description: 'Warehouse list save.',
      },
      {
        name: 'onChangePassword',
        type: '(payload) => void',
        required: false,
        description: 'Password change submit.',
      },
      {
        name: 'onSaveIban',
        type: '(payload) => void',
        required: false,
        description: 'IBAN + payment phone save.',
      },
    ],
    requiredExample: `<PanelProfile
  role="admin"
  defaultValue={DEMO_PANEL_PROFILE_ADMIN}
/>`,
    optionalExample: `<PanelProfile
  role="transporter"
  onUpdateProfile={(data) => saveProfile(data)}
  onChangePassword={(data) => changePassword(data)}
  onSaveIban={(data) => saveIban(data)}
/>`,
    previewId: 'panel-profile',
    variants: [
      {
        id: 'admin',
        name: '1 · Admin',
        description: 'Name + Email only; full password (3 fields); IBAN.',
        example: `<PanelProfile role="admin" defaultValue={DEMO_PANEL_PROFILE_ADMIN} />`,
      },
      {
        id: 'affiliate',
        name: '2 · Affiliate',
        description: 'Name + Email + Phone; simple password; IBAN (E-pagar).',
        example: `<PanelProfile role="affiliate" defaultValue={DEMO_PANEL_PROFILE_AFFILIATE} />`,
      },
      {
        id: 'transporter',
        name: '3 · Transporter',
        description:
          'Split cards; avatar upload/remove; Personal Information; stacked password; IBAN.',
        example: `<PanelProfile role="transporter" defaultValue={DEMO_PANEL_PROFILE_TRANSPORTER} />`,
      },
      {
        id: 'factory',
        name: '4 · Factory',
        description: 'Phone + warehouses; simple password; IBAN.',
        example: `<PanelProfile role="factory" defaultValue={DEMO_PANEL_PROFILE_FACTORY} />`,
      },
      {
        id: 'supplier',
        name: '5 · Supplier',
        description: 'Phone + warehouses; full password (3 fields); IBAN.',
        example: `<PanelProfile role="supplier" defaultValue={DEMO_PANEL_PROFILE_SUPPLIER} />`,
      },
      {
        id: 'customer',
        name: '6 · Customer (buyer account)',
        description:
          'Account setting, password, IBAN, billing & shipping address cards.',
        example: `<PanelProfile role="customer" defaultValue={DEMO_PANEL_PROFILE_CUSTOMER} />`,
      },
    ],
  },
  {
    id: 'messenger',
    name: 'Messenger',
    category: 'common',
    summary:
      'Chat shell: sidebar inbox + conversation. Pass state from useMessages() or your API layer.',
    path: 'src/components/common/messenger/',
    importExample:
      "import Messenger from '@/components/common/messenger/Messenger'\nimport useMessages from '@/components/common/messenger/useMessages'\n// useMessages() seeds from DEMO_MESSENGER_* in '@/data/demoData'",
    props: [
      {
        name: 'chats',
        type: 'array',
        required: true,
        description: 'Inbox conversation list.',
      },
      {
        name: 'messages',
        type: 'array',
        required: true,
        description: 'Messages for active chat.',
      },
      {
        name: 'activePartnerId',
        type: 'string | null',
        required: false,
        defaultValue: 'null',
        description: 'Selected chat id. null → list on mobile.',
      },
      {
        name: 'activeChat',
        type: 'object | null',
        required: false,
        description: 'Active chat metadata.',
      },
      {
        name: 'onSelectChat',
        type: '(id | null) => void',
        required: false,
        description:
          'Select a chat with id. Conversation ← Back calls onSelectChat(null). Wire from useMessages().selectChat or your own state setter.',
      },
      {
        name: 'onSend',
        type: '(text) => void',
        required: false,
        description: 'Send message.',
      },
      {
        name: 'onCreateOffer',
        type: '(form) => void',
        required: false,
        description:
          'Supplier/seller only. Pass this to show Create Offer. Buyer pages should omit it.',
      },
      {
        name: 'onPayNow',
        type: '(message) => void',
        required: false,
        description:
          'Runs on Pay Now — only shown on offers you received (sender=them), never on offers you sent.',
      },
      {
        name: 'onNegotiate',
        type: '(message) => void',
        required: false,
        description:
          'Runs on Negotiate — only on received offers. Hidden for offers you created.',
      },
      {
        name: 'sidebarTitle',
        type: 'string',
        required: false,
        defaultValue: "'Recent Messages'",
        description: 'Sidebar heading.',
      },
    ],
    requiredExample: `const state = useMessages()

<Messenger
  chats={state.chats}
  messages={state.messages}
  activePartnerId={state.activePartnerId}
  activeChat={state.activeChat}
  onSelectChat={state.selectChat}
  onSend={state.sendMessage}
/>`,
    optionalExample: `/* Supplier: create offers */
<Messenger {...state} onCreateOffer={(form) => createOffer(form)} />

/* Buyer: respond to offers */
<Messenger
  {...state}
  onPayNow={(msg) => pay(msg)}
  onNegotiate={(msg) => negotiate(msg)}
/>`,
    previewId: 'messenger',
    variants: [
      {
        id: 'inbox',
        name: 'Inbox',
        description: 'No chat selected (activePartnerId=null).',
        example: `<Messenger
  chats={chats}
  messages={[]}
  activePartnerId={null}
  onSelectChat={selectChat}
/>`,
      },
      {
        id: 'conversation',
        name: 'Active conversation',
        description: 'Text thread with a selected partner.',
        example: `<Messenger
  chats={chats}
  messages={messages}
  activePartnerId={chatId}
  activeChat={chat}
  onSelectChat={selectChat}
  onSend={sendMessage}
/>`,
      },
      {
        id: 'offer-sent',
        name: 'Offer sent (creator)',
        description:
          'You created the offer → Create Offer available; no Pay/Negotiate on your own card.',
        example: `<Messenger
  {...state}
  onCreateOffer={(form) => createOffer(form)}
/>`,
      },
      {
        id: 'offer-received',
        name: 'Offer received (buyer)',
        description:
          'Partner sent the offer → Pay Now / Negotiate shown; no Create Offer.',
        example: `<Messenger
  {...state}
  onPayNow={(msg) => pay(msg)}
  onNegotiate={(msg) => negotiate(msg)}
/>`,
      },
    ],
  },
  {
    id: 'pagination',
    name: 'Pagination',
    category: 'common',
    summary:
      'Page navigation with first/prev/numbered/next/last controls. Hides when totalPages ≤ 1. Ellipsis for long ranges.',
    path: 'src/components/common/Pagination/',
    importExample:
      "import Pagination from '@/components/common/Pagination/Pagination'",
    props: [
      {
        name: 'page',
        type: 'number',
        required: false,
        defaultValue: '1',
        description: 'Current page (clamped to 1…totalPages).',
      },
      {
        name: 'totalPages',
        type: 'number',
        required: false,
        defaultValue: '1',
        description: 'Total page count. Renders nothing when ≤ 1.',
      },
      {
        name: 'onPageChange',
        type: '(page: number) => void',
        required: false,
        description: 'Called when the user selects a valid page.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Extra classes on the nav wrapper.',
      },
    ],
    requiredExample: `const [page, setPage] = useState(1)

<Pagination
  page={page}
  totalPages={12}
  onPageChange={setPage}
/>`,
    optionalExample: `<Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
  className="mt-8"
/>`,
    previewId: 'pagination',
    variants: [
      {
        id: 'middle',
        name: 'Many pages · middle',
        description: 'Ellipsis on both sides (page 5 of 28).',
        example: `<Pagination page={5} totalPages={28} onPageChange={setPage} />`,
      },
      {
        id: 'start',
        name: 'Many pages · start',
        description: 'Leading pages without left ellipsis (page 2 of 28).',
        example: `<Pagination page={2} totalPages={28} onPageChange={setPage} />`,
      },
      {
        id: 'end',
        name: 'Many pages · end',
        description: 'Trailing pages (page 27 of 28).',
        example: `<Pagination page={27} totalPages={28} onPageChange={setPage} />`,
      },
      {
        id: 'few',
        name: 'Few pages',
        description: 'All page numbers shown (no ellipsis).',
        example: `<Pagination page={2} totalPages={4} onPageChange={setPage} />`,
      },
    ],
  },
]

export function getComponentDoc(id) {
  return COMPONENT_DOCS.find((doc) => doc.id === id) || null
}

export function filterComponentDocs({ category = 'all', query = '' } = {}) {
  const q = query.trim().toLowerCase()
  return COMPONENT_DOCS.filter((doc) => {
    const catOk = category === 'all' || doc.category === category
    if (!catOk) return false
    if (!q) return true
    const hay = [
      doc.name,
      doc.summary,
      doc.path,
      doc.category,
      ...doc.props.map((p) => `${p.name} ${p.description}`),
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
}
