import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import Pagination from "@/components/common/Pagination/Pagination";
import AuctionCard from "@/components/data-display/AuctionCard";
import AuctionDetails from "@/components/data-display/AuctionDetails";
import CreateAuction from "@/components/forms/CreateAuction";
import { DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS } from "@/data/demoData";
import {
  useCreateSupplierAuctionMutation,
  useGetSupplierActiveAuctionByIdQuery,
  useGetSupplierActiveAuctionsQuery,
  useGetSupplierAssignedAuctionByIdQuery,
  useGetSupplierAssignedAuctionsQuery,
} from "@/features/supplier/auctions/auctionsApi";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import { toast } from "react-hot-toast";

const PAGE_SIZE = 4;

function toDisplayText(value) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (typeof value === "object") {
    return (
      value.name ||
      value.fullName ||
      value.title ||
      value.label ||
      value.email ||
      value.phone ||
      ""
    );
  }
  return String(value);
}

function normalizeAuctionForCard(auction) {
  if (!auction) return null;

  const status = String(auction.status || "open").toLowerCase();
  const isAssigned = status === "assigned";

  return {
    id: auction.id ?? auction.auctionId ?? "",
    auctionId: auction.auctionId ?? auction.id ?? "",
    orderId: auction.orderId ?? "",
    pickupLocation:
      auction.pickupLocation || auction.shipping?.pickupLocation || "",
    customerName: auction.customerName || auction.customer?.name || "",
    deliveryLocation:
      auction.deliveryLocation || auction.shipping?.deliveryLocation || "",
    productName:
      auction.productName || auction.product?.name || auction.title || "",
    assignedTransporter: toDisplayText(
      auction.assignedTransporter || auction.transporter,
    ),
    bidPrice: auction.bidPrice ?? auction.price ?? auction.amount ?? 0,
    status: isAssigned ? "assigned" : "open",
  };
}

function buildDetailsAuction(auction) {
  if (!auction) return null;

  const status = String(auction.status || "open").toLowerCase();
  const isAssigned = status === "assigned";

  return {
    id: auction.id ?? auction.auctionId ?? "",
    orderId: auction.orderId ?? "",
    status,
    pickupLocation:
      auction.pickupLocation || auction.shipping?.pickupLocation || "",
    deliveryLocation:
      auction.deliveryLocation || auction.shipping?.deliveryLocation || "",
    customer: {
      name: auction.customerName || auction.customer?.name || "",
      phone: auction.customer?.phone || "",
      email: auction.customer?.email || "",
      deliveryAddress:
        auction.deliveryLocation || auction.shipping?.deliveryLocation || "",
    },
    product: {
      name: auction.productName || auction.product?.name || auction.title || "",
      sku: auction.product?.sku || "",
      weight: auction.product?.weight || "",
      price: auction.product?.price || auction.bidPrice || "",
    },
    shipping: {
      pickupLocation:
        auction.pickupLocation || auction.shipping?.pickupLocation || "",
      unloadingInstructions: auction.shipping?.unloadingInstructions || "",
      accessCondition: auction.shipping?.accessCondition || "",
      additionalNotes: auction.shipping?.additionalNotes || "",
    },
    transporter: {
      name: toDisplayText(auction.assignedTransporter || auction.transporter),
      phone: toDisplayText(auction.transporter?.phone),
      vehicleType: toDisplayText(auction.transporter?.vehicleType),
      bidAmount:
        auction.bidPrice != null
          ? `€${Number(auction.bidPrice).toLocaleString()}`
          : "",
      assignedAt: toDisplayText(auction.transporter?.assignedAt),
    },
    bids: Array.isArray(auction.bids) ? auction.bids : [],
  };
}

export default function DeliveryLogisticsPage() {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState(1);
  const [assignedPage, setAssignedPage] = useState(1);
  const [view, setView] = useState("list");
  const [selectedAuction, setSelectedAuction] = useState(null);

  const {
    data: activeData,
    isLoading: isActiveLoading,
    error: activeError,
  } = useGetSupplierActiveAuctionsQuery({ page: activePage, limit: PAGE_SIZE });
  const {
    data: assignedData,
    isLoading: isAssignedLoading,
    error: assignedError,
  } = useGetSupplierAssignedAuctionsQuery({
    page: assignedPage,
    limit: PAGE_SIZE,
  });
  const [createAuction, { isLoading: isCreating }] =
    useCreateSupplierAuctionMutation();

  const activeAuctions = useMemo(
    () =>
      (activeData?.auctions || []).map(normalizeAuctionForCard).filter(Boolean),
    [activeData],
  );
  const assignedDeliveries = useMemo(
    () =>
      (assignedData?.auctions || [])
        .map(normalizeAuctionForCard)
        .filter(Boolean),
    [assignedData],
  );

  const activeTotalPages = Math.max(1, Number(activeData?.totalPages || 1));
  const assignedTotalPages = Math.max(1, Number(assignedData?.totalPages || 1));
  const safeActivePage = Math.min(activePage, activeTotalPages);
  const safeAssignedPage = Math.min(assignedPage, assignedTotalPages);

  const openDetails = useCallback((auction) => {
    setSelectedAuction(auction);
    setView("details");
  }, []);

  const { data: selectedActiveDetails } = useGetSupplierActiveAuctionByIdQuery(
    selectedAuction?.id || selectedAuction?.auctionId,
    { skip: !selectedAuction || selectedAuction.status !== "open" },
  );
  const { data: selectedAssignedDetails } =
    useGetSupplierAssignedAuctionByIdQuery(
      selectedAuction?.id || selectedAuction?.auctionId,
      { skip: !selectedAuction || selectedAuction.status === "open" },
    );

  const selectedDetailsAuction = useMemo(() => {
    const payload =
      selectedAuction?.status === "assigned"
        ? selectedAssignedDetails
        : selectedActiveDetails;
    if (payload) return buildDetailsAuction({ ...selectedAuction, ...payload });
    if (selectedAuction) return buildDetailsAuction(selectedAuction);
    return null;
  }, [selectedActiveDetails, selectedAssignedDetails, selectedAuction]);

  const activeErrorMessage = activeError
    ? getApiErrorMessage(activeError, t("common.requestFailed"))
    : "";
  const assignedErrorMessage = assignedError
    ? getApiErrorMessage(assignedError, t("common.requestFailed"))
    : "";

  const closeView = () => {
    setSelectedAuction(null);
    setView("list");
  };

  const handleCreateSubmit = async (form) => {
    try {
      const payload = {
        orderId: form.orderId,
        requiredVehicleType: "HEAVY_TRUCK",
      };

      await createAuction(payload).unwrap();
      setActivePage(1);
      setView("list");
      toast.success(t("supplierDeliveryLogistics.auctionCreated"));
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("common.requestFailed")));
    }
  };

  if (view === "create") {
    return (
      <>
        <Seo title={t("supplierDeliveryLogistics.startAuctionTitle")} />
        <CreateAuction
          role="supplier"
          placeholders={DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS}
          onBack={closeView}
          onSubmit={handleCreateSubmit}
        />
      </>
    );
  }

  if (view === "details" && selectedAuction) {
    const isAssigned = selectedAuction.status === "assigned";

    return (
      <>
        <Seo
          title={
            isAssigned
              ? t("supplierDeliveryLogistics.assignedDetailTitle")
              : t("supplierDeliveryLogistics.activeDetailTitle")
          }
        />
        <AuctionDetails
          role="supplier"
          status={isAssigned ? "assigned" : "active"}
          auction={
            selectedDetailsAuction || buildDetailsAuction(selectedAuction)
          }
          onBack={closeView}
        />
      </>
    );
  }

  return (
    <>
      <Seo title={t("supplierDeliveryLogistics.title")} />
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--primary-text)]">
              {t("supplierDeliveryLogistics.title")}
            </h1>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {t("supplierDeliveryLogistics.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setView("create")}
            className="inline-flex items-center justify-center rounded-full bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
          >
            {t("supplierDeliveryLogistics.startAuction")}
          </button>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-text)]">
              {t("supplierDeliveryLogistics.activeAuctions.title")}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {t("supplierDeliveryLogistics.activeAuctions.subtitle")}
            </p>
          </div>

          {activeErrorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {activeErrorMessage}
            </div>
          ) : null}

          {isActiveLoading ? (
            <div className="text-sm text-[var(--secondary-text)]">
              {t("common.loading")}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {!isActiveLoading && activeAuctions.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-[var(--secondary-text)]">
                {t("common.noData")}
              </div>
            ) : null}

            {activeAuctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                role="supplier"
                status="open"
                auction={auction}
                onViewDetails={openDetails}
              />
            ))}
          </div>

          <Pagination
            className="mt-2"
            page={safeActivePage}
            totalPages={activeTotalPages}
            onPageChange={setActivePage}
          />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-text)]">
              {t("supplierDeliveryLogistics.assignedDeliveries.title")}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {t("supplierDeliveryLogistics.assignedDeliveries.subtitle")}
            </p>
          </div>

          {assignedErrorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {assignedErrorMessage}
            </div>
          ) : null}

          {isAssignedLoading ? (
            <div className="text-sm text-[var(--secondary-text)]">
              {t("common.loading")}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {!isAssignedLoading && assignedDeliveries.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-[var(--secondary-text)]">
                {t("common.noData")}
              </div>
            ) : null}

            {assignedDeliveries.map((auction) => (
              <AuctionCard
                key={auction.id}
                role="supplier"
                status="assigned"
                auction={auction}
                onViewDetails={openDetails}
              />
            ))}
          </div>

          <Pagination
            className="mt-2"
            page={safeAssignedPage}
            totalPages={assignedTotalPages}
            onPageChange={setAssignedPage}
          />
        </section>
      </div>
    </>
  );
}
