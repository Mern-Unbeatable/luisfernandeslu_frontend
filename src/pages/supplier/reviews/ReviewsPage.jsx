import { FiMessageCircle, FiStar, FiThumbsUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import { DEMO_SUPPLIER_REVIEWS } from "@/data/demoData";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import { useGetSupplierReviewsQuery } from "@/features/supplier/reviews/reviewsApi";

const shellClass =
  "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6";

function StarRating({ rating, size = "sm" }) {
  const iconSize = size === "lg" ? "size-6" : "size-3.5";
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < fullStars;
        const half = index === fullStars && hasHalf;

        return (
          <span key={index} className="relative inline-flex">
            <FiStar
              className={`${iconSize} ${
                filled ? "fill-amber-400 text-amber-400" : "text-gray-300"
              }`}
              strokeWidth={1.5}
              aria-hidden
            />
            {half ? (
              <FiStar
                className={`${iconSize} absolute inset-0 fill-amber-400 text-amber-400`}
                strokeWidth={1.5}
                style={{ clipPath: "inset(0 50% 0 0)" }}
                aria-hidden
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

function CustomerTypeBadge({ type, t }) {
  const isCompany = type === "company";
  return (
    <span
      className={[
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
        isCompany
          ? "bg-emerald-100 text-emerald-700"
          : "bg-sky-100 text-sky-700",
      ].join(" ")}
    >
      {isCompany
        ? t("supplierReviews.customerType.company")
        : t("supplierReviews.customerType.regular")}
    </span>
  );
}

function AverageRatingCard({ summary, t }) {
  return (
    <div className={shellClass}>
      <h2 className="text-base font-bold text-[var(--primary-text)]">
        {t("supplierReviews.averageRating")}
      </h2>

      <div className="mt-5 flex items-center gap-3">
        <span className="text-4xl font-bold tracking-tight text-[var(--primary-text)] sm:text-5xl">
          {summary.averageRating}
        </span>
        <FiStar
          className="size-8 fill-amber-400 text-amber-400 sm:size-10"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>

      <p className="mt-3 text-sm text-[var(--secondary-text)]">
        {t("supplierReviews.basedOnReviews", { count: summary.totalReviews })}
      </p>

      <div className="mt-4">
        <StarRating rating={summary.averageRating} size="lg" />
      </div>
    </div>
  );
}

function RatingDistributionCard({ distribution, t }) {
  return (
    <div className={shellClass}>
      <h2 className="text-base font-bold text-[var(--primary-text)]">
        {t("supplierReviews.ratingDistribution")}
      </h2>

      <ul className="mt-5 space-y-3">
        {distribution.map((row) => (
          <li key={row.stars} className="flex items-center gap-3">
            <span className="w-10 shrink-0 text-sm font-medium text-[var(--primary-text)]">
              {row.stars}{" "}
              <FiStar
                className="inline size-3 fill-amber-400 text-amber-400"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>

            <div className="h-2.5 min-w-0 flex-1 rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${row.percent}%` }}
              />
            </div>

            <span className="shrink-0 text-sm text-[var(--secondary-text)]">
              {row.count} ({row.percent}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MiniStatCard({
  label,
  value,
  description,
  icon: Icon,
  valueClass = "",
  iconClass = "text-sky-500",
}) {
  return (
    <div className={shellClass}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--secondary-text)]">
          {label}
        </p>
        {Icon ? (
          <Icon
            className={`size-5 shrink-0 ${iconClass}`}
            strokeWidth={1.75}
            aria-hidden
          />
        ) : null}
      </div>
      <p
        className={`mt-3 text-3xl font-bold tracking-tight text-[var(--primary-text)] ${valueClass}`}
      >
        {value}
      </p>
      {description ? (
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ReviewCard({ review, t }) {
  const initial = review.customerName?.charAt(0)?.toUpperCase() || "?";

  return (
    <article className={shellClass}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
          style={{ backgroundColor: review.avatarColor || "#14B8A6" }}
          aria-hidden
        >
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-[var(--primary-text)]">
                  {review.customerName}
                </h3>
                <CustomerTypeBadge type={review.customerType} t={t} />
              </div>
              <p className="mt-1 text-sm text-[var(--secondary-text)]">
                {review.productName} • {t("supplierReviews.orderLabel")}{" "}
                {review.orderId}
              </p>
            </div>

            <time
              className="shrink-0 text-sm text-[var(--secondary-text)]"
              dateTime={review.date}
            >
              {review.date}
            </time>
          </div>

          <div className="mt-3">
            <StarRating rating={review.rating} />
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[var(--primary-text)]">
            {review.comment}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function ReviewsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, error } = useGetSupplierReviewsQuery();
  const reviewsData = data ?? DEMO_SUPPLIER_REVIEWS;
  const { summary, distribution, reviews } = reviewsData;
  const errorMessage = error
    ? getApiErrorMessage(error, t("common.requestFailed"))
    : "";

  return (
    <>
      <Seo title={t("supplierReviews.title")} />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t("supplierReviews.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t("supplierReviews.subtitle")}
          </p>
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {isLoading || isFetching ? (
          <div className="text-sm text-[var(--secondary-text)]">
            {t("common.loading")}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AverageRatingCard summary={summary} t={t} />
          <RatingDistributionCard distribution={distribution} t={t} />
          <MiniStatCard
            label={t("supplierReviews.totalReviews")}
            value={summary.totalReviews}
            icon={FiMessageCircle}
          />
          <MiniStatCard
            label={t("supplierReviews.positiveReviews")}
            value={`${summary.positivePercent}%`}
            description={t("supplierReviews.positiveReviewsDesc")}
            icon={FiThumbsUp}
            iconClass="text-emerald-500"
            valueClass="text-emerald-600"
          />
        </div>

        <section className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} t={t} />
          ))}
        </section>
      </div>
    </>
  );
}
