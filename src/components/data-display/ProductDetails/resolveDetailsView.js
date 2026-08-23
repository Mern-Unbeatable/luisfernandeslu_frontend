/**
 * Role-driven product details layout config.
 * customer | company | supplier | factory | admin
 */
export function resolveDetailsView(role = 'customer', context = 'default') {
  const normalized = role === 'factory' ? 'supplier' : role

  const baseTabs = [
    { id: 'description', label: 'DESCRIPTION' },
    { id: 'additional', label: 'ADDITIONAL INFORMATION' },
    { id: 'specification', label: 'SPECIFICATION' },
  ]

  if (normalized === 'supplier' && context === 'buy_from_factory') {
    return {
      showRating: true,
      showWarehouse: false,
      showInlineDescription: true,
      splitPrice: true,
      showMinOrder: false,
      showQuantity: false,
      showSeller: true,
      sellerVariant: 'store',
      actions: [
        { id: 'send_message', label: 'SEND MESSAGE', variant: 'primary' },
      ],
      tabs: [
        { id: 'additional', label: 'ADDITIONAL INFORMATION' },
        { id: 'specification', label: 'SPECIFICATION' },
        { id: 'review', label: 'REVIEW' },
      ],
      defaultTab: 'additional',
    }
  }

  switch (normalized) {
    case 'company':
      return {
        showRating: true,
        showWarehouse: false,
        showMinOrder: true,
        showQuantity: true,
        showSeller: true,
        sellerVariant: 'store',
        actions: [
          { id: 'add_to_cart', label: 'ADD TO CART', variant: 'primary', icon: 'cart' },
          { id: 'buy_now', label: 'BUY NOW', variant: 'outline' },
          { id: 'send_quote', label: 'SEND QUOTE', variant: 'outline' },
        ],
        tabs: [...baseTabs, { id: 'review', label: 'REVIEW' }],
      }

    case 'supplier':
      return {
        showRating: true,
        showWarehouse: true,
        showMinOrder: false,
        showQuantity: false,
        showSeller: false,
        sellerVariant: null,
        actions: [],
        tabs: [...baseTabs, { id: 'review', label: 'REVIEW' }],
      }

    case 'admin':
      return {
        showRating: false,
        showWarehouse: false,
        showMinOrder: false,
        showQuantity: false,
        showSeller: true,
        sellerVariant: 'supplier',
        actions: [
          { id: 'accept', label: 'Accept', variant: 'primary', icon: 'check' },
          { id: 'reject', label: 'Reject', variant: 'danger', icon: 'ban' },
        ],
        tabs: [...baseTabs, { id: 'supplier', label: 'SUPPLIER DETAILS' }],
      }

    case 'customer':
    default:
      return {
        showRating: true,
        showWarehouse: false,
        showMinOrder: false,
        showQuantity: true,
        showSeller: true,
        sellerVariant: 'store',
        actions: [
          { id: 'add_to_cart', label: 'ADD TO CART', variant: 'primary', icon: 'cart' },
          { id: 'buy_now', label: 'BUY NOW', variant: 'outline' },
        ],
        tabs: [...baseTabs, { id: 'review', label: 'REVIEW' }],
      }
  }
}
