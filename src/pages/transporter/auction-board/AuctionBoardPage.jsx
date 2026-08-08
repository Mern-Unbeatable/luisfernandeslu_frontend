import { useState } from "react";
import { DEMO_AUCTION_LIVE } from "../../../data/demoData";
import AuctionCard from "../../../components/data-display/AuctionCard";

export default function AuctionBoardPage() {
  const [filter, setFilter] = useState("All");

  // Generate 6 mock active auctions based on the live demo data
  const initialAuctions = [
    {
      ...DEMO_AUCTION_LIVE,
      id: "auc-001",
      auctionId: "AUC-001",
      remainingLabel: "4m 11s",
    },
    {
      ...DEMO_AUCTION_LIVE,
      id: "auc-002",
      auctionId: "AUC-002",
      remainingLabel: "4m 11s",
      title: "Premium Portland Cement (Batch B)",
    },
    {
      ...DEMO_AUCTION_LIVE,
      id: "auc-003",
      auctionId: "AUC-003",
      remainingLabel: "3m 11s",
    },
    {
      ...DEMO_AUCTION_LIVE,
      id: "auc-004",
      auctionId: "AUC-004",
      remainingLabel: "3m 0s",
      title: "Premium Portland Cement (Batch C)",
    },
    {
      ...DEMO_AUCTION_LIVE,
      id: "auc-005",
      auctionId: "AUC-005",
      remainingLabel: "2m 15s",
    },
    {
      ...DEMO_AUCTION_LIVE,
      id: "auc-006",
      auctionId: "AUC-006",
      remainingLabel: "1m 45s",
      title: "Premium Portland Cement (Batch D)",
    },
  ];

  const [auctions, setAuctions] = useState(initialAuctions);

  const handlePlaceBid = (bidAmount, auction) => {
    if (!bidAmount) return;
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id === auction.id) {
          const newBid = {
            id: `b-${Date.now()}`,
            amount: Number(bidAmount),
            label: "Just now",
            transporterName: "You (Transporter)",
          };
          return {
            ...auc,
            bids: [newBid, ...auc.bids],
          };
        }
        return auc;
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Auction Board
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {auctions.length} active auctions in your service area
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-sm font-medium text-gray-500">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500"
          >
            <option>All</option>
            <option>Ending Soon</option>
            <option>Nearest First</option>
            <option>Ended</option>
          </select>
        </div>
      </div>

      {/* Grid of Auction Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {auctions.map((auction) => (
          <AuctionCard
            key={auction.id}
            role="transporter"
            auction={auction}
            onPlaceBid={handlePlaceBid}
          />
        ))}
      </div>
    </div>
  );
}
