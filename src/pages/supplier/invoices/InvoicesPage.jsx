import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCalendar, FiDownload, FiEye, FiFileText } from "react-icons/fi";
import Seo from "@/components/common/Seo/Seo";
import DataTable from "@/components/data-display/DataTable/DataTable";
import { SUPPLIER_INVOICES_PAGE_SIZE } from "@/data/demoData";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import {
  useGetSupplierCommissionInvoiceByIdQuery,
  useGetSupplierCommissionInvoicesQuery,
  useLazyGetSupplierCommissionInvoicePdfQuery,
} from "@/features/supplier/commission-invoices/commissionInvoicesApi";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function InvoiceDetailModal({ invoice, open, loading, error, onClose, t }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("supplierInvoices.closeOverlay", {
          defaultValue: "Close overlay",
        })}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        {loading ? (
          <div className="text-sm text-[var(--secondary-text)]">
            {t("common.loading")}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error && invoice ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--primary-text)]">
                  {invoice.invoiceId}
                </h2>
                <p className="mt-1 text-sm text-[var(--secondary-text)]">
                  {invoice.orderId} · {invoice.customer}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-[var(--secondary-text)] hover:bg-gray-200"
              >
                {t("supplierInvoices.pagination.previous", {
                  defaultValue: "Close",
                })}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-[var(--secondary-text)]">
                  {t("supplierInvoices.download.invoiceId")}
                </p>
                <p className="mt-1 font-semibold text-[var(--primary-text)]">
                  {invoice.invoiceId}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-[var(--secondary-text)]">
                  {t("supplierInvoices.download.orderId")}
                </p>
                <p className="mt-1 font-semibold text-[var(--primary-text)]">
                  {invoice.orderId}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-[var(--secondary-text)]">
                  {t("supplierInvoices.download.customer")}
                </p>
                <p className="mt-1 font-semibold text-[var(--primary-text)]">
                  {invoice.customer}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-[var(--secondary-text)]">
                  {t("supplierInvoices.download.amount")}
                </p>
                <p className="mt-1 font-semibold text-[var(--primary-text)]">
                  {invoice.amount}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[var(--primary-text)] hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const pageSize = SUPPLIER_INVOICES_PAGE_SIZE;
  const { data, isLoading, isFetching, error } =
    useGetSupplierCommissionInvoicesQuery({
      page,
      limit: pageSize,
      search,
    });
  const [loadInvoicePdf] = useLazyGetSupplierCommissionInvoicePdfQuery();

  const {
    data: selectedInvoice,
    isLoading: isDetailLoading,
    error: detailError,
  } = useGetSupplierCommissionInvoiceByIdQuery(selectedInvoiceId, {
    skip: !selectedInvoiceId,
  });

  const invoices = useMemo(() => data?.invoices || [], [data]);
  const total = data?.total ?? invoices.length;
  const pageCount = Math.max(1, Number(data?.totalPages || 1));
  const safePage = Math.min(page, pageCount);
  const paged = invoices;

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total);

  const errorMessage = error
    ? getApiErrorMessage(error, t("common.requestFailed"))
    : "";

  const downloadInvoice = useCallback(
    async (row) => {
      if (!row?.invoiceId) return;
      try {
        const blob = await loadInvoicePdf(row.invoiceId).unwrap();
        downloadBlob(blob, `${row.invoiceId}.pdf`);
      } catch (downloadError) {
        console.error(downloadError);
      }
    },
    [loadInvoicePdf],
  );

  const columns = useMemo(
    () => [
      {
        key: "invoiceId",
        header: t("supplierInvoices.columns.invoiceId"),
        render: (value) => (
          <span className="inline-flex items-center gap-2 font-medium text-[var(--primary-text)]">
            <FiFileText
              className="size-4 shrink-0 text-[var(--secondary-text)]"
              aria-hidden
            />
            {value}
          </span>
        ),
      },
      {
        key: "type",
        header: t("supplierInvoices.columns.type"),
        render: (value) => (
          <span className="inline-flex rounded-md border border-[color-mix(in_srgb,var(--active)_45%,white)] bg-[color-mix(in_srgb,var(--active)_12%,white)] px-2.5 py-1 text-xs font-medium text-[var(--active)]">
            {value === "Invoice" ? t("supplierInvoices.typeInvoice") : value}
          </span>
        ),
      },
      {
        key: "orderId",
        header: t("supplierInvoices.columns.orderId"),
      },
      {
        key: "customer",
        header: t("supplierInvoices.columns.customer"),
      },
      {
        key: "amount",
        header: t("supplierInvoices.columns.amount"),
        render: (value) => (
          <span className="font-bold text-[var(--primary-text)]">{value}</span>
        ),
      },
      {
        key: "date",
        header: t("supplierInvoices.columns.date"),
        render: (value) => (
          <span className="inline-flex items-center gap-2 text-[var(--primary-text)]">
            <FiCalendar
              className="size-4 shrink-0 text-[var(--secondary-text)]"
              aria-hidden
            />
            {value}
          </span>
        ),
      },
      {
        key: "actions",
        header: t("supplierInvoices.columns.actions"),
        render: (_value, row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={t("supplierInvoices.viewAria", {
                id: row.invoiceId || row.id,
              })}
              onClick={() => setSelectedInvoiceId(row.invoiceId || row.id)}
              className="rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
            >
              <FiEye className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t("supplierInvoices.downloadAria", {
                id: row.invoiceId || row.id,
              })}
              onClick={() => downloadInvoice(row)}
              className="rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
            >
              <FiDownload className="size-4" />
            </button>
          </div>
        ),
      },
    ],
    [downloadInvoice, t],
  );

  return (
    <>
      <Seo
        title={t("supplierInvoices.title")}
        description={t("supplierInvoices.subtitle")}
      />
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            {t("supplierInvoices.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t("supplierInvoices.subtitle")}
          </p>
        </header>

        <DataTable
          columns={columns}
          data={paged}
          loading={isLoading || isFetching}
          getRowKey={(row) => row.invoiceId || row.id}
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder={t("supplierInvoices.searchPlaceholder")}
          showPagination
          pagination={{
            page: safePage,
            pageSize,
            total,
            from,
            to,
            hasPrevious: safePage > 1,
            hasNext: safePage < pageCount,
            onPageChange: setPage,
            summaryLabel: t("supplierInvoices.pagination.summary", {
              from,
              to,
              total,
            }),
            previousLabel: t("supplierInvoices.pagination.previous"),
            nextLabel: t("supplierInvoices.pagination.next"),
          }}
        />

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <InvoiceDetailModal
          open={Boolean(selectedInvoiceId)}
          invoice={selectedInvoice}
          loading={isDetailLoading}
          error={
            detailError
              ? getApiErrorMessage(detailError, t("common.requestFailed"))
              : ""
          }
          onClose={() => setSelectedInvoiceId(null)}
          t={t}
        />
      </div>
    </>
  );
}
