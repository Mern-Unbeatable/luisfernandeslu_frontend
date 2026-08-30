import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { FiDownload, FiUploadCloud, FiX } from "react-icons/fi";
import {
  getApiErrorMessage,
  triggerBlobDownload,
} from "@/features/supplier/apiError";
import {
  downloadSupplierProductCsvGuide,
  downloadSupplierProductCsvTemplate,
} from "@/features/supplier/products/productApi";
import { isCsvFile } from "./csvUpload";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export default function UploadCsvModal({
  open,
  onClose,
  onImported,
  uploadCsv,
}) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [queueing, setQueueing] = useState(false);
  useEffect(() => {
    if (!open) return undefined;

    setFile(null);
    setError("");
    setDragging(false);
    setQueueing(false);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape" && !queueing) onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, queueing]);

  if (!open) return null;

  const acceptFile = (nextFile) => {
    if (!nextFile) return;

    if (!isCsvFile(nextFile)) {
      setError(t("panel.supplierProducts.csv.hint"));
      setFile(null);
      return;
    }

    if (nextFile.size > MAX_UPLOAD_BYTES) {
      setError(t("panel.supplierProducts.csv.hint"));
      setFile(null);
      return;
    }

    setError("");
    setFile(nextFile);
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadSupplierProductCsvTemplate();
      triggerBlobDownload(blob, "supplier-products-template.csv");
    } catch (apiError) {
      setError(
        getApiErrorMessage(
          apiError,
          t("panel.supplierProducts.csv.uploadFailed"),
        ),
      );
    }
  };

  const handleDownloadGuide = async () => {
    try {
      const blob = await downloadSupplierProductCsvGuide();
      triggerBlobDownload(blob, "supplier-products-category-guide.pdf");
    } catch (apiError) {
      setError(
        getApiErrorMessage(
          apiError,
          t("panel.supplierProducts.csv.uploadFailed"),
        ),
      );
    }
  };

  const handleQueueImport = async () => {
    if (!file || queueing || typeof uploadCsv !== "function") return;

    setError("");
    setQueueing(true);

    try {
      await uploadCsv(file).unwrap();
      onImported?.();
      onClose?.();
    } catch (apiError) {
      setError(
        getApiErrorMessage(
          apiError,
          t("panel.supplierProducts.csv.uploadFailed"),
        ),
      );
    } finally {
      setQueueing(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("panel.supplierProducts.csv.closeOverlay")}
        className="absolute inset-0 bg-black/45"
        onClick={() => {
          if (!queueing) onClose?.();
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-csv-title"
        className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="upload-csv-title"
              className="text-lg font-bold text-[var(--primary-text)]"
            >
              {t("panel.supplierProducts.csv.title")}
            </h2>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {t("panel.supplierProducts.csv.hint")}
            </p>
          </div>
          <button
            type="button"
            aria-label={t("panel.supplierProducts.csv.close")}
            onClick={onClose}
            disabled={queueing}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[var(--secondary-text)] hover:bg-gray-200 disabled:opacity-50"
          >
            <FiX className="size-4" />
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          aria-label={t("panel.supplierProducts.csv.browseAria")}
          onChange={(event) => {
            acceptFile(event.target.files?.[0] || null);
            event.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={queueing}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            acceptFile(event.dataTransfer.files?.[0] || null);
          }}
          className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition disabled:opacity-60 ${
            dragging
              ? "border-[var(--active)] bg-[#FFF8F0]"
              : "border-gray-200 bg-[#F8FAFC] hover:border-[var(--active)] hover:bg-[#FFFBF5]"
          }`}
        >
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-white text-[var(--active)] shadow-sm ring-1 ring-gray-100">
            <FiUploadCloud className="size-6" aria-hidden />
          </span>
          <p className="mt-4 text-sm font-semibold text-[var(--primary-text)]">
            {t("panel.supplierProducts.csv.dropTitle")}
          </p>
          <p className="mt-1 max-w-sm text-xs text-[var(--secondary-text)]">
            {t("panel.supplierProducts.csv.dropNote")}
          </p>
          {file ? (
            <p className="mt-3 text-xs font-medium text-[var(--active)]">
              {t("panel.supplierProducts.csv.selected", { name: file.name })}
            </p>
          ) : null}
          {error ? (
            <p className="mt-3 text-xs font-medium text-red-600">{error}</p>
          ) : null}
        </button>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={queueing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[var(--primary-text)] transition hover:bg-gray-50 disabled:opacity-50"
            >
              <FiDownload className="size-4" aria-hidden />
              {t("panel.supplierProducts.csv.downloadExample")}
            </button>
            <button
              type="button"
              onClick={handleDownloadGuide}
              disabled={queueing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[var(--primary-text)] transition hover:bg-gray-50 disabled:opacity-50"
            >
              <FiDownload className="size-4" aria-hidden />
              {t("panel.supplierProducts.csv.downloadGuide", {
                defaultValue: "Category guide",
              })}
            </button>
          </div>
          <button
            type="button"
            onClick={handleQueueImport}
            disabled={!file || queueing}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--active)] px-5 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {queueing
              ? t("panel.supplierProducts.csv.uploading")
              : t("panel.supplierProducts.csv.queueImport")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
