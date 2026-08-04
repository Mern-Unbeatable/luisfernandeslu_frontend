/**
 * Component documentation catalog for /developer.
 * Keep in sync when adding shared UI used across panels.
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
    importPath: "import OrderDetails from '@/components/data-display/OrderDetails'",
    importExample:
      "import OrderDetails from '../components/data-display/OrderDetails'",
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
        name: 'onPayNow',
        type: '(installment) => void',
        required: false,
        description: 'Installment timeline Pay Now.',
      },
      {
        name: 'onCancelInstallment',
        type: '(installment) => void',
        required: false,
        description: 'Installment timeline Cancel.',
      },
      {
        name: 'className',
        type: 'string',
        required: false,
        defaultValue: "''",
        description: 'Wrapper className.',
      },
    ],
    requiredExample: `<OrderDetails
  order={order}
  onBack={() => navigate(-1)}
/>`,
    optionalExample: `<OrderDetails
  order={order}
  hasInstallment={false}
  status="new"
  onBack={() => navigate(-1)}
  onAccept={(order) => acceptOrder(order.id)}
  onDownloadInvoice={(order) => download(order.id)}
/>`,
    previewId: 'order-details',
    variants: [
      {
        id: 'standard-new',
        name: 'Standard · New',
        description: 'hasInstallment=false, status=new → Accept button; no transporter.',
        example: `<OrderDetails
  order={order}
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
  order={order}
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
  order={order}
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
  order={order}
  hasInstallment={false}
  status="cancel"
  onBack={() => navigate(-1)}
/>`,
      },
      {
        id: 'installment-new',
        name: 'Installment · New',
        description: 'Installment timeline + payment summary; no transporter card.',
        example: `<OrderDetails
  order={order}
  hasInstallment
  status="new"
  onBack={() => navigate(-1)}
  onPayNow={(row) => pay(row.id)}
  onCancelInstallment={(row) => cancel(row.id)}
/>`,
      },
      {
        id: 'installment-assigned',
        name: 'Installment · Assigned',
        description: 'Transporter banner + Chat; installment timeline.',
        example: `<OrderDetails
  order={order}
  hasInstallment
  status="assigned"
  onBack={() => navigate(-1)}
  onChat={(t) => openChat(t)}
  onPayNow={(row) => pay(row.id)}
  onCancelInstallment={(row) => cancel(row.id)}
/>`,
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
      "import AuctionCard from '../components/data-display/AuctionCard'",
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
      'Auction details for supplier/factory. Shipping for supplier only; active → bids, assigned → transporter.',
    path: 'src/components/data-display/AuctionDetails/',
    importExample:
      "import AuctionDetails from '../components/data-display/AuctionDetails'",
    props: [
      {
        name: 'auction',
        type: 'object',
        required: true,
        description: 'Auction detail payload.',
      },
      {
        name: 'role',
        type: "'supplier' | 'factory'",
        required: false,
        defaultValue: "'supplier'",
        description: 'supplier shows Shipping Details; factory hides it.',
      },
      {
        name: 'status',
        type: "'active' | 'assigned'",
        required: false,
        description: 'active → Competing Bids; assigned → Transporter Information.',
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
  role="factory"
  status="assigned"
  auction={DEMO_AUCTION_DETAILS_ASSIGNED}
  onBack={() => navigate('/factory/auction')}
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
      "import ProductCard from '../components/data-display/ProductCard/ProductCard'",
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
    id: 'product-details',
    name: 'ProductDetails',
    category: 'data-display',
    summary:
      'Full product details page. Role drives actions, seller card, tabs, warehouse fields.',
    path: 'src/components/data-display/ProductDetails/',
    importExample:
      "import ProductDetails from '../components/data-display/ProductDetails/ProductDetails'",
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
    id: 'data-table',
    name: 'DataTable',
    category: 'data-display',
    summary:
      'Prop-driven table toolkit: tabs, search, filters, actions, pagination, loading.',
    path: 'src/components/data-display/DataTable/',
    importExample:
      "import DataTable from '../components/data-display/DataTable/DataTable'",
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
      "import InstallmentTimeline from '../components/data-display/InstallmentTimeline/InstallmentTimeline'",
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
        name: 'onPayNow',
        type: '(item) => void',
        required: false,
        description: 'Pending installment Pay Now.',
      },
      {
        name: 'onCancel',
        type: '(item) => void',
        required: false,
        description: 'Pending installment Cancel.',
      },
    ],
    requiredExample: `<InstallmentTimeline items={DEMO_INSTALLMENTS} />`,
    optionalExample: `<InstallmentTimeline
  items={DEMO_INSTALLMENTS}
  onPayNow={(item) => pay(item.id)}
  onCancel={(item) => cancel(item.id)}
/>`,
    previewId: 'installment-timeline',
    variants: [
      {
        id: 'mixed',
        name: 'Mixed',
        description: 'Completed + pending items (default demo).',
        example: `<InstallmentTimeline
  items={DEMO_INSTALLMENTS}
  onPayNow={(item) => pay(item.id)}
  onCancel={(item) => cancel(item.id)}
/>`,
      },
      {
        id: 'all-pending',
        name: 'All pending',
        description: 'Every row shows Pay Now / Cancel.',
        example: `<InstallmentTimeline items={items.map((i) => ({ ...i, status: 'pending' }))} />`,
      },
      {
        id: 'all-completed',
        name: 'All completed',
        description: 'Every row shows Paid / completed state.',
        example: `<InstallmentTimeline items={items.map((i) => ({ ...i, status: 'completed' }))} />`,
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
      "import CreateAuction from '../components/forms/CreateAuction'",
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
      "import AddProduct from '../components/forms/AddProduct/AddProduct'",
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
    id: 'messenger',
    name: 'Messenger',
    category: 'common',
    summary:
      'Chat shell: sidebar inbox + conversation. Pass state from useMessages() or your API layer.',
    path: 'src/components/common/messenger/',
    importExample:
      "import Messenger from '../components/common/messenger/Messenger'\nimport useMessages from '../components/common/messenger/useMessages'",
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
