import { useCallback, useMemo, useState } from 'react';
import {
  FiCalendar,
  FiDownload,
  FiEye,
  FiFileText,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusCard from '@/components/data-display/StatusCard';
import {
  DEMO_SUPPLIER_FISCAL_DOCUMENTS,
  DEMO_SUPPLIER_FISCAL_DOCUMENT_ORDER_OPTIONS,
  DEMO_SUPPLIER_FISCAL_DOCUMENT_STAT_CARDS,
  SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE,
} from '@/data/demoData';
import GenerateDocumentModal from './GenerateDocumentModal';

export default function DocumentsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  // TODO: replace DEMO_* with supplier fiscal documents API fetch
  const { stats, documents } = DEMO_SUPPLIER_FISCAL_DOCUMENTS;

  const invoiceLabel = t('panel.supplierFiscalDocuments.typeInvoice');

  const filteredDocuments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return documents;

    return documents.filter((row) => {
      const typeLabel =
        row.type === 'invoice' ? invoiceLabel : String(row.type || '');
      return (
        String(row.documentId).toLowerCase().includes(q) ||
        String(row.orderId).toLowerCase().includes(q) ||
        String(row.customer).toLowerCase().includes(q) ||
        String(row.amount).toLowerCase().includes(q) ||
        String(row.date).toLowerCase().includes(q) ||
        typeLabel.toLowerCase().includes(q)
      );
    });
  }, [documents, search, invoiceLabel]);

  const total = filteredDocuments.length;
  const pageCount = Math.max(
    1,
    Math.ceil(total / SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);

  const pagedDocuments = useMemo(() => {
    const start = (safePage - 1) * SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE;
    return filteredDocuments.slice(
      start,
      start + SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE,
    );
  }, [filteredDocuments, safePage]);

  const from =
    total === 0 ? 0 : (safePage - 1) * SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE + 1;
  const to =
    total === 0
      ? 0
      : Math.min(safePage * SUPPLIER_FISCAL_DOCUMENTS_PAGE_SIZE, total);

  const handleGenerateInvoice = useCallback(() => {
    setGenerateModalOpen(true);
  }, []);

  const handleGenerateSubmit = useCallback((payload) => {
    // TODO: wire fiscal document generation API
    void payload;
  }, []);
  const handleViewDocument = useCallback((row) => {
    // TODO: navigate to document detail or open preview
    void row;
  }, []);

  const handleDownloadDocument = useCallback((row) => {
    // TODO: wire document download API
    void row;
  }, []);

  const columns = useMemo(
    () => [
      {
        key: 'documentId',
        header: t('panel.supplierFiscalDocuments.colDocumentId'),
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
        key: 'type',
        header: t('panel.supplierFiscalDocuments.colType'),
        render: () => (
          <span
            className="inline-flex rounded-full border border-[var(--active)] bg-[color-mix(in_srgb,var(--active)_12%,white)] px-3 py-1 text-xs font-medium text-[var(--active)]"
          >
            {t('panel.supplierFiscalDocuments.typeInvoice')}
          </span>
        ),
      },
      {
        key: 'orderId',
        header: t('panel.supplierFiscalDocuments.colOrderId'),
      },
      {
        key: 'customer',
        header: t('panel.supplierFiscalDocuments.colCustomer'),
      },
      {
        key: 'amount',
        header: t('panel.supplierFiscalDocuments.colAmount'),
        render: (value) => (
          <span className="font-semibold text-[var(--primary-text)]">{value}</span>
        ),
      },
      {
        key: 'date',
        header: t('panel.supplierFiscalDocuments.colDate'),
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
        key: 'actions',
        header: t('panel.supplierFiscalDocuments.colActions'),
        render: (_, row) => (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleViewDocument(row)}
              className="inline-flex rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
              aria-label={t('panel.supplierFiscalDocuments.viewDocument')}
            >
              <FiEye className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => handleDownloadDocument(row)}
              className="inline-flex rounded-md p-1.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
              aria-label={t('panel.supplierFiscalDocuments.downloadDocument')}
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
      <Seo title={t('panel.supplierFiscalDocuments.title')} />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t('panel.supplierFiscalDocuments.title')}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t('panel.supplierFiscalDocuments.subtitle')}
          </p>
        </header>

        <button
          type="button"
          onClick={handleGenerateInvoice}
          className="inline-flex shrink-0 items-center justify-center self-start rounded-md bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-95"
        >
          {t('panel.supplierFiscalDocuments.generateInvoice')}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_SUPPLIER_FISCAL_DOCUMENT_STAT_CARDS.map((card) => (
          <StatusCard
            key={card.id}
            variant={card.variant}
            label={t(card.labelKey)}
            value={stats[card.valueKey]}
            tone={card.tone}
            className="shadow-sm"
          />
        ))}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <DataTable
          showCard={false}
          columns={columns}
          data={pagedDocuments}
          getRowKey={(row) => row.id}
          showTabs={false}
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder={t(
            'panel.supplierFiscalDocuments.searchPlaceholder',
          )}
          showFilters={false}
          showActions={false}
          emptyMessage={t('panel.supplierFiscalDocuments.emptyDocuments')}
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
            summaryLabel: t('panel.supplierFiscalDocuments.showingResults', {
              from,
              to,
              total,
            }),
            previousLabel: t('panel.supplierFiscalDocuments.previous'),
            nextLabel: t('panel.supplierFiscalDocuments.next'),
          }}
        />
      </section>

      <GenerateDocumentModal
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        orderOptions={DEMO_SUPPLIER_FISCAL_DOCUMENT_ORDER_OPTIONS}
        onSubmit={handleGenerateSubmit}
      />
    </>
  );
}
