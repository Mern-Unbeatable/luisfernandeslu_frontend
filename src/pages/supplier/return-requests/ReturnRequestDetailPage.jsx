import { useCallback, useState } from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import {
  useGetSupplierReturnRequestByIdQuery,
  useUpdateSupplierReturnRequestStatusMutation,
} from "@/features/supplier/return-requests/returnRequestsApi";
import ReturnStatusBadge from "./ReturnStatusBadge";

function EvidenceCarousel({ images = [], t }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(images.length - 1, 0));
  const hasMultiple = images.length > 1;

  const goPrev = () => {
    setActiveIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  if (!images.length) return null;

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <img
          src={images[safeIndex]}
          alt=""
          className="h-64 w-full object-cover sm:h-80"
        />

        {hasMultiple ? (
          <>
            <span className="absolute top-3 right-3 rounded-md bg-black/55 px-2 py-1 text-xs font-medium text-white">
              {safeIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={goPrev}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[var(--primary-text)] shadow-sm hover:bg-white"
              aria-label={t("supplierReturnRequests.detail.prevImage")}
            >
              <FiChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[var(--primary-text)] shadow-sm hover:bg-white"
              aria-label={t("supplierReturnRequests.detail.nextImage")}
            >
              <FiChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <ul className="mt-3 flex gap-2">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "block overflow-hidden rounded-lg border-2",
                  index === safeIndex ? "border-sky-500" : "border-transparent",
                ].join(" ")}
              >
                <img
                  src={src}
                  alt=""
                  className="size-16 object-cover sm:size-20"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function ReturnRequestDetailPage() {
  const { returnId } = useParams();
  const { t } = useTranslation();
  const {
    data: request,
    isLoading,
    error,
  } = useGetSupplierReturnRequestByIdQuery(returnId, {
    skip: !returnId,
  });
  const [updateReturnStatus] = useUpdateSupplierReturnRequestStatusMutation();

  const handleStatusChange = useCallback(
    (status) => {
      if (!returnId) return;
      void updateReturnStatus({ id: returnId, status });
    },
    [returnId, updateReturnStatus],
  );

  const errorMessage = error
    ? getApiErrorMessage(error, t("common.requestFailed"))
    : "";

  if (!returnId) {
    return (
      <div className="py-10 text-center text-sm text-[var(--secondary-text)]">
        {t("supplierReturnRequests.detail.notFound")}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-[var(--secondary-text)]">
        {t("common.loading")}
      </div>
    );
  }

  if (errorMessage || !request) {
    return (
      <div className="py-10 text-center text-sm text-[var(--secondary-text)]">
        {errorMessage || t("supplierReturnRequests.detail.notFound")}
      </div>
    );
  }

  const customer = request.customer || {};
  const initial = customer.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      <Seo
        title={t("supplierReturnRequests.detail.title", {
          id: request.returnId,
        })}
      />
      <div className="space-y-6">
        <Link
          to="/supplier/return-requests"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] hover:text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t("supplierReturnRequests.detail.back")}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--primary-text)]">
              {request.returnId}
            </h1>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {t("supplierReturnRequests.detail.orderReceived", {
                orderId: request.orderId,
                date: request.receivedDate,
              })}
            </p>
          </div>
          <ReturnStatusBadge
            status={request.status}
            label={t(`supplierReturnRequests.status.${request.status}`)}
            className="rounded-full px-3 py-1"
          />
          <div className="flex flex-wrap gap-2">
            {["under_review", "approved", "rejected"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusChange(status)}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--primary-text)] transition hover:border-[var(--active)] hover:text-[var(--active)]"
              >
                {t(`supplierReturnRequests.status.${status}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-[var(--primary-text)]">
                {t("supplierReturnRequests.detail.returnDetails")}
              </h2>

              <span className="mt-4 inline-flex rounded-md bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                {request.reason}
              </span>

              <p className="mt-4 text-sm leading-relaxed text-[var(--primary-text)]">
                {request.description}
              </p>

              <h3 className="mt-6 text-sm font-bold text-[var(--primary-text)]">
                {t("supplierReturnRequests.detail.returnedProducts")}
              </h3>

              <ul className="mt-3 space-y-4">
                {request.products?.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={product.image}
                        alt=""
                        className="size-14 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--primary-text)]">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
                          {t("supplierReturnRequests.detail.productMeta", {
                            sku: product.sku,
                            qty: product.quantity,
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 font-semibold text-[var(--primary-text)]">
                      {product.price}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <p className="text-sm font-medium text-[var(--secondary-text)]">
                  {t("supplierReturnRequests.detail.refundAccount")}
                </p>
                <p className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[var(--primary-text)]">
                  {request.refundAccountNumber}
                </p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--secondary-text)]">
                    {t("supplierReturnRequests.detail.totalRefund")}
                  </span>
                  <span className="text-lg font-bold text-[var(--primary-text)]">
                    {request.refundAmount}
                  </span>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--primary-text)]">
                <FiImage className="size-5 text-[var(--secondary-text)]" />
                {t("supplierReturnRequests.detail.customerEvidence")}
              </h2>
              <div className="mt-4">
                <EvidenceCarousel images={request.evidence} t={t} />
              </div>
            </article>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-[var(--primary-text)]">
                {t("supplierReturnRequests.detail.customerInfo")}
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                  style={{
                    backgroundColor: customer.avatarColor || "#3B82F6",
                  }}
                >
                  {initial}
                </div>
                <div>
                  <p className="font-bold text-[var(--primary-text)]">
                    {customer.name}
                  </p>
                  <p className="text-xs text-[var(--secondary-text)]">
                    {t("supplierReturnRequests.detail.customerId", {
                      id: customer.id,
                    })}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex items-start gap-2 text-[var(--primary-text)]">
                  <FiMail
                    className="mt-0.5 size-4 shrink-0 text-[var(--secondary-text)]"
                    aria-hidden
                  />
                  {customer.email}
                </li>
                <li className="flex items-start gap-2 text-[var(--primary-text)]">
                  <FiPhone
                    className="mt-0.5 size-4 shrink-0 text-[var(--secondary-text)]"
                    aria-hidden
                  />
                  {customer.phone}
                </li>
                <li className="flex items-start gap-2 text-[var(--primary-text)]">
                  <FiMapPin
                    className="mt-0.5 size-4 shrink-0 text-[var(--secondary-text)]"
                    aria-hidden
                  />
                  {customer.address}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-[var(--primary-text)]">
                {t("supplierReturnRequests.detail.orderSummary")}
              </h2>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--secondary-text)]">
                    {t("supplierReturnRequests.detail.orderId")}
                  </dt>
                  <dd className="font-medium text-[var(--primary-text)]">
                    {request.orderSummary?.orderId}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--secondary-text)]">
                    {t("supplierReturnRequests.detail.items")}
                  </dt>
                  <dd className="font-medium text-[var(--primary-text)]">
                    {t("supplierReturnRequests.detail.itemCount", {
                      count: request.orderSummary?.itemCount,
                    })}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--secondary-text)]">
                    {t("supplierReturnRequests.detail.requestDate")}
                  </dt>
                  <dd className="font-medium text-[var(--primary-text)]">
                    {request.orderSummary?.requestDate}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-gray-100 pt-3">
                  <dt className="font-medium text-[var(--primary-text)]">
                    {t("supplierReturnRequests.detail.totalValue")}
                  </dt>
                  <dd className="text-base font-bold text-[var(--primary-text)]">
                    {request.orderSummary?.totalValue}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
