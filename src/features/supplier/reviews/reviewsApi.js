import { baseApi } from "../../../services/api/baseApi";

function normalizeSummary(summary = {}) {
  return {
    averageRating: Number(summary.averageRating ?? 0),
    totalReviews: Number(summary.totalReviews ?? 0),
    positivePercent: Number(summary.positivePercent ?? 0),
  };
}

function normalizeDistribution(distribution) {
  return Array.isArray(distribution)
    ? distribution
        .map((item) => ({
          stars: Number(item?.stars ?? 0),
          count: Number(item?.count ?? 0),
          percent: Number(item?.percent ?? 0),
        }))
        .filter((item) => item.stars > 0)
    : [];
}

function normalizeReviews(reviews) {
  return Array.isArray(reviews)
    ? reviews
        .map((item) => ({
          id: String(item?.id ?? ""),
          customerName: String(item?.customerName ?? ""),
          customerType:
            item?.customerType === "company" ? "company" : "regular",
          productName: String(item?.productName ?? ""),
          orderId: String(item?.orderId ?? ""),
          date: String(item?.date ?? ""),
          rating: Number(item?.rating ?? 0),
          comment: String(item?.comment ?? ""),
          avatarColor: String(item?.avatarColor ?? "#14B8A6"),
        }))
        .filter((item) => item.id)
    : [];
}

export const supplierReviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierReviews: builder.query({
      query: () => ({
        url: "/api/supplier/reviews",
        method: "GET",
      }),
      transformResponse: (response) => {
        const source = response ?? {};

        return {
          summary: normalizeSummary(source.summary),
          distribution: normalizeDistribution(source.distribution),
          reviews: normalizeReviews(source.reviews),
        };
      },
    }),
  }),
});

export const { useGetSupplierReviewsQuery } = supplierReviewsApi;
