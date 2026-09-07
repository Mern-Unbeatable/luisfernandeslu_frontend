import { useCallback, useMemo, useState } from "react";
import { FiCalendar, FiDownload, FiEye, FiFileText, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Seo from "@/components/common/Seo/Seo";
import DataTable from "@/components/data-display/DataTable/DataTable";
import StatusCard from "@/components/data-display/StatusCard";
import {
  getApiErrorMessage,
  triggerBlobDownload,
} from "@/features/supplier/apiError";
import {
  useGenerateSupplierDocumentMutation,
  useGetSupplierDocumentByIdQuery,
  useGetSupplierDocumentEligibleOrdersQuery,
  useGetSupplierDocumentStatsQuery,
  useGetSupplierDocumentsQuery,
  useLazyGetSupplierDocumentPdfQuery,
} from "@/features/supplier/documents/documentsApi";
import GenerateDocumentModal from "./GenerateDocumentModal";

const SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE = 7;

const STAT_CARD_CONFIG = [
  {
    id: "totalDocuments",
    labelKey: "panel.supplierFiscalDocuments.totalDocuments",
    valueKey: "totalDocuments",
    variant: "filled",
    tone: "brand",
  },
  {
    id: "thisMonth",
    labelKey: "panel.supplierFiscalDocuments.thisMonth",
    valueKey: "thisMonth",
    variant: "badge",
  },
  {
    id: "invoices",
    labelKey: "panel.supplierFiscalDocuments.invoices",
    valueKey: "invoices",
    variant: "badge",
  },
  {
    id: "totalValue",
    labelKey: "panel.supplierFiscalDocuments.totalValue",
    valueKey: "totalValue",
    variant: "badge",
  },
];

function normalizeCurrencyValue(value) {
  if (value == null || value === "") return "€0";
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    return `€${value.toLocaleString("en-US", {
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return String(value);
}

function formatDocumentPreviewValue(document, fallback = "—") {
  if (!document) return fallback;
  return (
    document.documentId ||
    document.orderId ||
    document.customer ||
    document.amount ||
    document.date ||
    fallback
  );
}

export default function DocumentsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [previewDocumentId, setPreviewDocumentId] = useState(null);
  const [pageError, setPageError] = useState("");

  const {
    data: stats = {},
    isLoading: isStatsLoading,
    error: statsError,
  } = useGetSupplierDocumentStatsQuery();
  const {
    data: documentsResponse,
    isLoading: isDocumentsLoading,
    isFetching: isDocumentsFetching,
    error: documentsError,
  } = useGetSupplierDocumentsQuery({
    page,
    limit: SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE,
    search,
  });
  const {
    data: eligibleOrders = [],
    isLoading: isEligibleOrdersLoading,
    error: eligibleOrdersError,
  } = useGetSupplierDocumentEligibleOrdersQuery();
  const { data: previewDocument, isLoading: isPreviewLoading } =
    useGetSupplierDocumentByIdQuery(previewDocumentId, {
      skip: !previewDocumentId,
    });
  const [generateSupplierDocument, { isLoading: isGeneratingDocument }] =
    useGenerateSupplierDocumentMutation();
  const [downloadDocumentPdf] = useLazyGetSupplierDocumentPdfQuery();

  const documents = useMemo(
    () => documentsResponse?.documents ?? [],
    [documentsResponse],
  );
  const total = documentsResponse?.total ?? documents.length;
  const pageCount = Math.max(
    1,
    documentsResponse?.totalPages ??
      Math.ceil(
        (total || documents.length || 1) / SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE,
      ),
  );
  const safePage = Math.min(page, pageCount);
  const from =
    total === 0 ? 0 : (safePage - 1) * SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE + 1;
  const to =
    total === 0
      ? 0
      : Math.min(safePage * SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE, total);

  const invoiceLabel = t("panel.supplierFiscalDocuments.typeInvoice");

  const apiError =
    (documentsError ? getApiErrorMessage(documentsError, "") : "") ||
    (statsError ? getApiErrorMessage(statsError, "") : "") ||
    (eligibleOrdersError ? getApiErrorMessage(eligibleOrdersError, "") : "") ||
    pageError;

  const statValues = useMemo(
    () => ({
      totalDocuments: stats.totalDocuments ?? stats.total ?? 0,
      thisMonth: stats.thisMonth ?? stats.month ?? 0,
      invoices: stats.invoices ?? stats.invoiceCount ?? 0,
      totalValue: normalizeCurrencyValue(
        stats.totalValue ?? stats.totalAmount ?? stats.value ?? 0,
      ),
    }),
    [stats],
  );

  const invoiceDocuments = useMemo(
    () =>
      documents.map((document) => ({
        ...document,
        typeLabel:
          document.type === "invoice"
            ? invoiceLabel
            : String(document.type || ""),
      })),
    [documents, invoiceLabel],
  );

  const handleGenerateInvoice = useCallback(() => {
    setPageError("");
    setGenerateModalOpen(true);
  }, []);

  const handleGenerateSubmit = useCallback(
    async ({ orderId }) => {
      setPageError("");
      try {
        await generateSupplierDocument({ orderId }).unwrap();
        setGenerateModalOpen(false);
        setPage(1);
      } catch (error) {
        setPageError(
          getApiErrorMessage(
            error,
            t("panel.supplierFiscalDocuments.modalSubmit"),
          ),
        );
        throw error;
      }
    },
    [generateSupplierDocument, t],
  );

  const handleViewDocument = useCallback((row) => {
    setPageError("");
    if (!row?.id) return;
    setPreviewDocumentId(row.id);
  }, []);

  const handleDownloadDocument = useCallback(
    async (row, audience = "SUPPLIER") => {
      setPageError("");
      if (!row?.id) return;

      try {
        const blob = await downloadDocumentPdf({
          documentId: row.id,
          audience: audience === "CUSTOMER" ? "CUSTOMER" : undefined,
        }).unwrap();
        triggerBlobDownload(
          blob,
          audience === "CUSTOMER"
            ? `document-${row.documentId || row.id}-customer.pdf`
            : `document-${row.documentId || row.id}.pdf`,
        );
      } catch (error) {
        setPageError(
          getApiErrorMessage(
            error,
            t("panel.supplierFiscalDocuments.downloadDocument"),
          ),
        );
      }
    },
    [downloadDocumentPdf, t],
  );

  const columns = useMemo(
    () => [
      {
        key: "documentId",
        header: t("panel.supplierFiscalDocuments.colDocumentId"),
        render: (value) => (
          <span className="inline-flex items-center gap-2 font-medium text-[var(--primary-text)]">
            <FiFileText
              className="size-4 shrink-0 text-[var(--secondary-text)]"
              strokeWidth={1.75}
              aria-hidden
            />
            {value}
          </span>
        ),
      },
      {
        key: "type",
        header: t("panel.supplierFiscalDocuments.colType"),
        render: (_, row) => (
          <span className="inline-flex rounded-full border border-[var(--active)] bg-[color-mix(in_srgb,var(--active)_12%,white)] px-3 py-1 text-xs font-medium text-[var(--active)]">
            {row.typeLabel || t("panel.supplierFiscalDocuments.typeInvoice")}
          </span>
        ),
      },
      {
        key: "orderId",
        header: t("panel.supplierFiscalDocuments.colOrderId"),
      },
      {
        key: "customer",
        header: t("panel.supplierFiscalDocuments.colCustomer"),
      },
      {
        key: "amount",
        header: t("panel.supplierFiscalDocuments.colAmount"),
        render: (value) => (
          <span className="font-semibold text-[var(--primary-text)]">
            {value}
          </span>
        ),
      },
      {
        key: "date",
        header: t("panel.supplierFiscalDocuments.colDate"),
        render: (value) => (
          <span className="inline-flex items-center gap-2 text-[var(--primary-text)]">
            <FiCalendar
              className="size-4 shrink-0 text-[var(--secondary-text)]"
              strokeWidth={1.75}
              aria-hidden
            />
            {value}
          </span>
        ),
      },
      {
        key: "actions",
        header: t("panel.supplierFiscalDocuments.colActions"),
        render: (_, row) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleViewDocument(row)}
              className="inline-flex rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
              aria-label={t("panel.supplierFiscalDocuments.viewDocument")}
            >
              <FiEye className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => handleDownloadDocument(row)}
              className="inline-flex rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
              aria-label={t("panel.supplierFiscalDocuments.downloadDocument")}
            >
              <FiDownload className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        ),
      },
    ],
    [t, handleViewDocument, handleDownloadDocument],
  );

  return (
    <>
      <Seo title={t("panel.supplierFiscalDocuments.title")} />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t("panel.supplierFiscalDocuments.title")}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("panel.supplierFiscalDocuments.subtitle")}
          </p>
        </header>

        <button
          type="button"
          onClick={handleGenerateInvoice}
          disabled={isGeneratingDocument}
          className="inline-flex shrink-0 items-center justify-center self-start rounded-md bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-95"
        >
          {t("panel.supplierFiscalDocuments.generateInvoice")}
        </button>
      </div>

      {apiError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARD_CONFIG.map((card) => (
          <StatusCard
            key={card.id}
            variant={card.variant}
            label={t(card.labelKey)}
            value={isStatsLoading ? "—" : statValues[card.valueKey]}
            tone={card.tone}
            className="shadow-sm"
          />
        ))}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <DataTable
          showCard={false}
          columns={columns}
          data={invoiceDocuments}
          getRowKey={(row) => row.id}
          showTabs={false}
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder={t(
            "panel.supplierFiscalDocuments.searchPlaceholder",
          )}
          showFilters={false}
          showActions={false}
          emptyMessage={t("panel.supplierFiscalDocuments.emptyDocuments")}
          loading={isDocumentsLoading || isDocumentsFetching}
          showPagination
          pagination={{
            page: safePage,
            pageSize: SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE,
            total,
            from,
            to,
            hasPrevious: safePage > 1,
            hasNext: safePage < pageCount,
            onPageChange: setPage,
            summaryLabel: t("panel.supplierFiscalDocuments.showingResults", {
              from,
              to,
              total,
            }),
            previousLabel: t("panel.supplierFiscalDocuments.previous"),
            nextLabel: t("panel.supplierFiscalDocuments.next"),
          }}
        />
      </section>

      <GenerateDocumentModal
        key={
          generateModalOpen
            ? "generate-document-open"
            : "generate-document-closed"
        }
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        orderOptions={eligibleOrders}
        onSubmit={handleGenerateSubmit}
        submitting={isGeneratingDocument || isEligibleOrdersLoading}
      />

      {previewDocumentId ? (
        <DocumentPreviewModal
          document={previewDocument}
          loading={isPreviewLoading}
          onClose={() => setPreviewDocumentId(null)}
          onDownloadSupplier={() => handleDownloadDocument(previewDocument)}
          onDownloadCustomer={() =>
            handleDownloadDocument(previewDocument, "CUSTOMER")
          }
        />
      ) : null}
    </>
  );
}

function DocumentPreviewModal({
  document,
  loading,
  onClose,
  onDownloadSupplier,
  onDownloadCustomer,
}) {
  if (!document && !loading) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close document preview"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-start gap-3 border-b border-gray-200 px-5 py-4">
          <span
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--active)_16%,white)] text-[var(--active)]"
            aria-hidden
          >
            <FiFileText className="size-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-[var(--primary-text)]">
              Document Preview
            </h2>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {loading
                ? "Loading document details..."
                : formatDocumentPreviewValue(document)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--secondary-text)] transition-colors hover:bg-gray-100"
          >
            <FiX className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-2">
          <PreviewField label="Document ID" value={document?.documentId} />
          <PreviewField label="Order ID" value={document?.orderId} />
          <PreviewField label="Customer" value={document?.customer} />
          <PreviewField label="Amount" value={document?.amount} />
          <PreviewField label="Date" value={document?.date} />
          <PreviewField label="Type" value={document?.type} />
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDownloadSupplier}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-gray-50"
          >
            Download Supplier PDF
          </button>
          <button
            type="button"
            onClick={onDownloadCustomer}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--active)] px-4 text-sm font-semibold text-white transition-colors hover:brightness-95"
          >
            Download Buyer PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewField({ label, value }) {
  return (
    <div className="rounded-lg bg-[#FAF7F2] px-4 py-3">
      <p className="text-xs font-medium text-[var(--secondary-text)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--primary-text)]">
        {value || "—"}
      </p>
    </div>
  );
}
