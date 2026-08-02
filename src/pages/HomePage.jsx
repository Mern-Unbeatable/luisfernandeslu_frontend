import ProductCard from '../components/data-display/ProductCard/ProductCard'
import Messenger from '../components/common/messenger/Messenger'
import useMessages from '../components/common/messenger/useMessages'

const IMG =
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'

const baseProduct = {
  image: IMG,
  title: 'Portland Cement',
  description:
    'High-strength building cement suitable for construction and masonry work.',
  price: '$115',
  priceText: 'Price: $115 per bag (50 kg)',
  companyPrice: '$98',
  companyPriceText: 'Company: $98 per bag (50 kg)',
  unit: 'bag (50 kg)',
}

const sponsoredProduct = {
  image: IMG,
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

const featuredProduct = {
  ...baseProduct,
  title: 'Portland Cement Quick Set',
  description: 'Fast-setting cement for rapid construction work.',
  priceText: 'Price: $130 per bag (50 kg)',
  expiryDate: '5/4/2026',
}

const promoCodeProduct = {
  ...baseProduct,
  title: 'Portland Cement Quick Set',
  description: 'Fast-setting cement for rapid construction work.',
  priceText: 'Price: $130 per bag (50 kg)',
  bulkOptionLabel: 'Bulk option Open',
  promoLabel: '25% Off',
}

const VARIANTS = [
  {
    name: 'Sponsored (customer)',
    props: {
      type: 'sponsored',
      role: 'customer',
      tag: 'sponsored',
      product: sponsoredProduct,
    },
  },
  {
    name: 'Sponsored (company) — dual price',
    props: {
      type: 'sponsored',
      role: 'company',
      tag: 'sponsored',
      product: {
        ...sponsoredProduct,
        priceText: 'Price: $150 /units',
      },
    },
  },
  {
    name: 'Normal (customer)',
    props: {
      type: 'normal',
      role: 'customer',
      product: baseProduct,
    },
  },
  {
    name: 'Normal (company) — dual price',
    props: {
      type: 'normal',
      role: 'company',
      product: baseProduct,
    },
  },
  {
    name: 'Normal + quantity / Add to Cart',
    props: {
      type: 'normal',
      role: 'customer',
      showQuantity: true,
      product: {
        ...baseProduct,
        title: 'Portland Cement Quick Set',
        description: 'Fast-setting cement for rapid construction work.',
        priceText: 'Price: $130 per bag (50 kg)',
        bulkOptionLabel: 'Bulk option Open',
      },
    },
  },
  {
    name: 'Supplier dashboard — Regular',
    props: {
      type: 'dashboard',
      role: 'supplier',
      tag: 'regular',
      product: baseProduct,
    },
  },
  {
    name: 'Supplier dashboard — Bulk Order',
    props: {
      type: 'dashboard',
      role: 'supplier',
      tag: 'bulk_order',
      product: {
        ...baseProduct,
        priceText: 'Price: $135 per bag (50 kg)',
      },
    },
  },
  {
    name: 'Supplier dashboard — Pending',
    props: {
      type: 'dashboard',
      role: 'supplier',
      status: 'pending',
      product: baseProduct,
    },
  },
  {
    name: 'Supplier dashboard — Rejected',
    props: {
      type: 'dashboard',
      role: 'supplier',
      status: 'rejected',
      product: {
        ...baseProduct,
        title: 'Portland Cement Standard',
        description: 'Reliable cement for all your everyday construction needs.',
      },
    },
  },
  {
    name: 'Featured',
    props: {
      type: 'featured',
      tag: 'featured',
      product: featuredProduct,
    },
  },
  {
    name: 'Promo code product',
    props: {
      type: 'dashboard',
      context: 'promo_code',
      role: 'supplier',
      product: promoCodeProduct,
    },
  },
  {
    name: 'Supplier — Buy from factory',
    props: {
      type: 'normal',
      role: 'supplier',
      product: {
        ...baseProduct,
        title: 'Portland Cement Quick Set',
        description: 'Fast-setting cement for rapid construction work.',
        priceText: 'Price: $130 per bag (50 kg)',
      },
    },
  },
  {
    name: 'Factory dashboard — Active',
    props: {
      type: 'dashboard',
      role: 'factory',
      status: 'active',
      product: baseProduct,
    },
  },
  {
    name: 'Factory dashboard — Pending',
    props: {
      type: 'dashboard',
      role: 'factory',
      status: 'pending',
      product: baseProduct,
    },
  },
  {
    name: 'Factory dashboard — Rejected',
    props: {
      type: 'dashboard',
      role: 'factory',
      status: 'rejected',
      product: baseProduct,
    },
  },
  {
    name: 'Admin approval — Pending',
    props: {
      type: 'dashboard',
      role: 'admin',
      context: 'approval',
      status: 'pending',
      product: baseProduct,
    },
  },
  {
    name: 'Admin approval — Accepted (active)',
    props: {
      type: 'dashboard',
      role: 'admin',
      context: 'approval',
      status: 'active',
      product: baseProduct,
    },
  },
  {
    name: 'Admin approval — Rejected',
    props: {
      type: 'dashboard',
      role: 'admin',
      context: 'approval',
      status: 'rejected',
      product: baseProduct,
    },
  },
  {
    name: 'Admin promotion — Pending',
    props: {
      type: 'dashboard',
      role: 'admin',
      context: 'promotion',
      status: 'pending',
      product: baseProduct,
    },
  },
  {
    name: 'Admin promotion — Active',
    props: {
      type: 'dashboard',
      role: 'admin',
      context: 'promotion',
      status: 'active',
      product: baseProduct,
    },
  },
  {
    name: 'Admin promotion — Featured (accepted)',
    props: {
      type: 'dashboard',
      role: 'admin',
      context: 'promotion',
      status: 'featured',
      product: {
        ...baseProduct,
        timeLeft: '5 days left',
      },
    },
  },
  {
    name: 'Admin promotion — Completed',
    props: {
      type: 'dashboard',
      role: 'admin',
      context: 'promotion',
      status: 'completed',
      product: baseProduct,
    },
  },
]

export default function HomePage() {
  const {
    chats,
    messages,
    activePartnerId,
    activeChat,
    selectChat,
    sendMessage,
    editMessage,
    deleteMessage,
    handleTyping,
    stopTyping,
    isPartnerTyping,
    isSending,
    actionMessageId,
    isLoading,
    sharedInbox,
  } = useMessages()

  return (
    <section className="w-full bg-gray-100 px-4 py-8 sm:px-6 lg:px-10 xl:px-24">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            ProductCard variants
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            Same common component — different type / role / context / status /
            tag props.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {VARIANTS.map((variant) => (
            <div key={variant.name} className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-[var(--primary-text)]">
                {variant.name}
              </h2>
              <ProductCard
                {...variant.props}
                onAction={(actionId, product) => {
                  console.log(variant.name, actionId, product?.title)
                }}
              />
            </div>
          ))}
        </div>

        <header className="mt-12 mb-6">
          <h2 className="text-2xl font-bold text-[var(--primary-text)]">
            Messenger
          </h2>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            Common chat UI — sidebar + conversation (project colors).
          </p>
        </header>

        <div className="h-[min(70vh,720px)] min-h-[480px] w-full">
          <Messenger
            chats={chats}
            messages={messages}
            activePartnerId={activePartnerId}
            activeChat={activeChat}
            onSelectChat={selectChat}
            onSend={sendMessage}
            onEditMessage={editMessage}
            onDeleteMessage={deleteMessage}
            onTyping={handleTyping}
            onStopTyping={stopTyping}
            onCreateOffer={() => console.log('Create offer')}
            onPayNow={(message) => console.log('Pay now', message)}
            onNegotiate={(message) => console.log('Negotiate', message)}
            isPartnerTyping={isPartnerTyping}
            isSending={isSending}
            isLoading={isLoading}
            actionMessageId={actionMessageId}
            sharedInbox={sharedInbox}
            sidebarTitle="Recent Messages"
          />
        </div>
      </div>
    </section>
  )
}
