import { baseApi } from "../../../services/api/baseApi";
import { pickList, pickPage, pickTotal } from "../apiError";

function normalizeAuctionStatus(rawStatus) {
  const value = String(rawStatus ?? "")
    .trim()
    .toLowerCase();
  if (!value) return "open";

  if (
    ["assigned", "accepted", "picked_up", "in_transit", "delivered"].includes(
      value,
    )
  ) {
    return "assigned";
  }

  if (["complete", "completed", "done", "closed"].includes(value)) {
    return "completed";
  }

  if (["open", "active", "pending", "new"].includes(value)) {
    return "open";
  }

  return value;
}

function parseNumericValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const cleaned = String(value ?? "")
    .replace(/[^0-9.-]+/g, "")
    .trim();
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapAuctionItem(item) {
  if (!item || typeof item !== "object") return null;

  const id = item.id ?? item._id ?? item.auctionId ?? item.uuid ?? "";
  const orderId =
    item.orderId ??
    item.orderNumber ??
    item.reference ??
    item.order?.id ??
    item.order?.orderId ??
    item.orderNumber ??
    item.id ??
    "";

  const status = normalizeAuctionStatus(
    item.status ?? item.state ?? item.auctionStatus ?? item.deliveryStatus,
  );

  const customerName =
    item.customerName ??
    item.customer?.name ??
    item.customer?.fullName ??
    item.company?.name ??
    item.companyName ??
    "";

  const productName =
    item.productName ??
    item.product?.name ??
    item.product?.title ??
    item.title ??
    item.name ??
    "";

  const pickupLocation =
    item.pickupLocation ??
    item.shipping?.pickupLocation ??
    item.origin?.location ??
    item.from?.location ??
    item.pickupAddress ??
    "";

  const deliveryLocation =
    item.deliveryLocation ??
    item.shipping?.deliveryLocation ??
    item.destination?.location ??
    item.to?.location ??
    item.deliveryAddress ??
    "";

  const assignedTransporter =
    item.assignedTransporter ??
    item.transporter?.name ??
    item.transporterName ??
    item.driver?.name ??
    "";

  const bidPrice =
    item.bidPrice ??
    item.price ??
    item.amount ??
    item.total ??
    item.winningBid ??
    item.assignedPrice ??
    item.transportFee ??
    0;

  return {
    id,
    auctionId: item.auctionId ?? item.id ?? id,
    orderId,
    pickupLocation,
    customerName,
    deliveryLocation,
    productName,
    assignedTransporter,
    bidPrice: parseNumericValue(bidPrice),
    status,
    raw: item,
  };
}

function mapAuctionListPayload(payload, fallbackPage = 1) {
  const list = pickList(payload, ["auctions", "items", "data"])
    .map(mapAuctionItem)
    .filter(Boolean);

  const total = pickTotal(payload, list.length);
  const page = pickPage(payload, fallbackPage);
  const limitValue =
    payload?.limit ??
    payload?.pagination?.limit ??
    payload?.meta?.limit ??
    (list.length || 20);
  const limit = Number(limitValue || 1) || list.length || 20;

  return {
    auctions: list,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil((total || list.length) / limit || 1)),
  };
}

function mapAuctionDetailPayload(payload) {
  const auction = payload?.auction ?? payload?.data ?? payload ?? {};
  const mapped = mapAuctionItem(auction) || {
    id: auction.id ?? "",
    auctionId: auction.auctionId ?? auction.id ?? "",
    orderId: auction.orderId ?? "",
    status: normalizeAuctionStatus(auction.status),
    pickupLocation: auction.pickupLocation ?? "",
    customerName: auction.customerName ?? "",
    deliveryLocation: auction.deliveryLocation ?? "",
    productName: auction.productName ?? "",
    assignedTransporter: auction.assignedTransporter ?? "",
    bidPrice: parseNumericValue(auction.bidPrice ?? 0),
    raw: auction,
  };

  return {
    ...mapped,
    customer: auction.customer ?? {},
    product: auction.product ?? {},
    shipping: auction.shipping ?? {},
    transporter: auction.transporter ?? {},
    bids: Array.isArray(auction.bids) ? auction.bids : [],
    steps: Array.isArray(auction.steps) ? auction.steps : [],
  };
}

export const supplierAuctionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierActiveAuctions: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: "/api/supplier/auctions/active",
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response, _meta, arg) =>
        mapAuctionListPayload(response, arg?.page ?? 1),
    }),
    getSupplierAssignedAuctions: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: "/api/supplier/auctions/assigned",
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response, _meta, arg) =>
        mapAuctionListPayload(response, arg?.page ?? 1),
    }),
    getSupplierActiveAuctionById: builder.query({
      query: (auctionId) => ({
        url: `/api/supplier/auctions/active/${auctionId}`,
        method: "GET",
      }),
      transformResponse: mapAuctionDetailPayload,
    }),
    getSupplierAssignedAuctionById: builder.query({
      query: (auctionId) => ({
        url: `/api/supplier/auctions/assigned/${auctionId}`,
        method: "GET",
      }),
      transformResponse: mapAuctionDetailPayload,
    }),
    createSupplierAuction: builder.mutation({
      query: ({ orderId, requiredVehicleType = "HEAVY_TRUCK" }) => ({
        url: "/api/supplier/auctions",
        method: "POST",
        data: {
          orderId,
          requiredVehicleType,
        },
      }),
    }),
  }),
});

export const {
  useGetSupplierActiveAuctionsQuery,
  useGetSupplierAssignedAuctionsQuery,
  useGetSupplierActiveAuctionByIdQuery,
  useGetSupplierAssignedAuctionByIdQuery,
  useCreateSupplierAuctionMutation,
} = supplierAuctionsApi;
