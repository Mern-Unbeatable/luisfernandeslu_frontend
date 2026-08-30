export const CUSTOMER_ORDER_STATUS_ALL = "all";

export const CUSTOMER_ORDER_STATUSES = Object.freeze({
  NEW: "NEW",
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  IN_TRANSIT: "IN_TRANSIT",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
});

export const CUSTOMER_ORDER_STATUS_CONFIG = Object.freeze({
  [CUSTOMER_ORDER_STATUSES.NEW]: {
    apiValue: CUSTOMER_ORDER_STATUSES.NEW,
    labelKey: "panel.supplierCustomerOrders.statusNew",
  },
  [CUSTOMER_ORDER_STATUSES.PENDING]: {
    apiValue: CUSTOMER_ORDER_STATUSES.PENDING,
    labelKey: "panel.supplierCustomerOrders.statusPending",
  },
  [CUSTOMER_ORDER_STATUSES.PROCESSING]: {
    apiValue: CUSTOMER_ORDER_STATUSES.PROCESSING,
    labelKey: "panel.supplierCustomerOrders.statusProcessing",
  },
  [CUSTOMER_ORDER_STATUSES.IN_TRANSIT]: {
    apiValue: CUSTOMER_ORDER_STATUSES.IN_TRANSIT,
    labelKey: "panel.supplierCustomerOrders.statusAssigned",
  },
  [CUSTOMER_ORDER_STATUSES.CANCELLED]: {
    apiValue: CUSTOMER_ORDER_STATUSES.CANCELLED,
    labelKey: "panel.supplierCustomerOrders.statusCancel",
  },
  [CUSTOMER_ORDER_STATUSES.COMPLETED]: {
    apiValue: CUSTOMER_ORDER_STATUSES.COMPLETED,
    labelKey: "panel.supplierCustomerOrders.statusCompleted",
  },
});

const CUSTOMER_ORDER_STATUS_ALIASES = Object.freeze({
  new: CUSTOMER_ORDER_STATUSES.NEW,
  pending: CUSTOMER_ORDER_STATUSES.PENDING,
  processing: CUSTOMER_ORDER_STATUSES.PROCESSING,
  assigned: CUSTOMER_ORDER_STATUSES.IN_TRANSIT,
  in_transit: CUSTOMER_ORDER_STATUSES.IN_TRANSIT,
  "in transit": CUSTOMER_ORDER_STATUSES.IN_TRANSIT,
  completed: CUSTOMER_ORDER_STATUSES.COMPLETED,
  complete: CUSTOMER_ORDER_STATUSES.COMPLETED,
  cancelled: CUSTOMER_ORDER_STATUSES.CANCELLED,
  canceled: CUSTOMER_ORDER_STATUSES.CANCELLED,
  cancel: CUSTOMER_ORDER_STATUSES.CANCELLED,
});

export const CUSTOMER_ORDER_FILTER_STATUSES = Object.freeze([
  CUSTOMER_ORDER_STATUSES.NEW,
  CUSTOMER_ORDER_STATUSES.PENDING,
  CUSTOMER_ORDER_STATUSES.PROCESSING,
  CUSTOMER_ORDER_STATUSES.IN_TRANSIT,
  CUSTOMER_ORDER_STATUSES.CANCELLED,
  CUSTOMER_ORDER_STATUSES.COMPLETED,
]);

export const CUSTOMER_ORDER_STATUS_LABEL_KEYS = Object.freeze({
  [CUSTOMER_ORDER_STATUSES.NEW]: "panel.supplierCustomerOrders.statusNew",
  [CUSTOMER_ORDER_STATUSES.PENDING]:
    "panel.supplierCustomerOrders.statusPending",
  [CUSTOMER_ORDER_STATUSES.PROCESSING]:
    "panel.supplierCustomerOrders.statusProcessing",
  [CUSTOMER_ORDER_STATUSES.IN_TRANSIT]:
    "panel.supplierCustomerOrders.statusAssigned",
  [CUSTOMER_ORDER_STATUSES.CANCELLED]:
    "panel.supplierCustomerOrders.statusCancel",
  [CUSTOMER_ORDER_STATUSES.COMPLETED]:
    "panel.supplierCustomerOrders.statusCompleted",
});

export function normalizeCustomerOrderStatus(status) {
  const raw = String(status ?? "").trim();
  if (!raw) return "";

  if (CUSTOMER_ORDER_STATUSES[raw]) {
    return CUSTOMER_ORDER_STATUSES[raw];
  }

  const normalized = raw.toLowerCase();
  return CUSTOMER_ORDER_STATUS_ALIASES[normalized] ?? raw.toUpperCase();
}

export function isCustomerOrderFilterStatus(status) {
  return CUSTOMER_ORDER_FILTER_STATUSES.includes(status);
}
