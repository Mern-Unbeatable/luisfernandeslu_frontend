import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import StatusBadge from "@/components/data-display/DataTable/StatusBadge";
import { SUPPLIER_PROMO_CODES_PAGE_SIZE } from "@/data/demoData";
import { getApiErrorMessage } from "@/features/supplier/apiError";
import {
  useDeletePromoCodeMutation,
  useGetPromoCodeByIdQuery,
  useGetPromoCodesQuery,
  useUpdatePromoCodeMutation,
  useUpdatePromoCodeStatusMutation,
} from "@/features/supplier/promo-codes/promoCodesApi";
import { STATUS_LABEL_KEYS } from "../utils/promoCode.constants";

export function usePromoCodeTableController({ t, navigate }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [promoCodePage, setPromoCodePage] = useState(1);
  const [selectedPromoCodeId, setSelectedPromoCodeId] = useState(null);
  const [statusMutationId, setStatusMutationId] = useState(null);
  const [promoCodeToDelete, setPromoCodeToDelete] = useState(null);
  const [deletingPromoCode, setDeletingPromoCode] = useState(false);

  const {
    data: promoCodeResponse,
    isLoading,
    isFetching,
  } = useGetPromoCodesQuery({
    status: statusFilter,
    page: promoCodePage,
    limit: SUPPLIER_PROMO_CODES_PAGE_SIZE,
  });

  const {
    data: selectedPromoCode,
    isFetching: isPromoCodeDetailLoading,
    isError: isPromoCodeDetailError,
  } = useGetPromoCodeByIdQuery(selectedPromoCodeId, {
    skip: !selectedPromoCodeId,
  });

  const [updatePromoCodeStatus] = useUpdatePromoCodeStatusMutation();
  const [updatePromoCode] = useUpdatePromoCodeMutation();
  const [deletePromoCode] = useDeletePromoCodeMutation();

  const promoCodes = useMemo(
    () => promoCodeResponse?.promoCodes ?? [],
    [promoCodeResponse],
  );

  const promoCodeTotal = promoCodeResponse?.total ?? promoCodes.length;
  const promoCodePageCount = Math.max(
    1,
    Math.ceil(promoCodeTotal / SUPPLIER_PROMO_CODES_PAGE_SIZE),
  );
  const safePromoCodePage = Math.min(promoCodePage, promoCodePageCount);

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("panel.supplierPromoCodes.allStatus") },
      { value: "active", label: t("panel.supplierPromoCodes.statusActive") },
      {
        value: "disabled",
        label: t("panel.supplierPromoCodes.statusDisabled"),
      },
      { value: "expired", label: t("panel.supplierPromoCodes.statusExpired") },
    ],
    [t],
  );

  const filteredPromoCodes = useMemo(() => {
    const q = search.trim().toLowerCase();

    return promoCodes.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;

      const statusLabel = t(STATUS_LABEL_KEYS[row.status] || "").toLowerCase();
      const discountTypeLabel =
        row.discountType === "fixed"
          ? t("panel.supplierPromoCodes.discountTypeFixed").toLowerCase()
          : t("panel.supplierPromoCodes.discountTypePercentage").toLowerCase();
      const usageLimitLabel = row.usageLimitUnlimited
        ? t("panel.supplierPromoCodes.unlimited").toLowerCase()
        : String(row.usageLimit ?? "").toLowerCase();
      const usedCountLabel = `${row.usedCount}/${
        row.usageLimitUnlimited
          ? t("panel.supplierPromoCodes.unlimitedLower")
          : row.usageLimit
      }`.toLowerCase();

      return (
        String(row.code).toLowerCase().includes(q) ||
        String(row.discountType).toLowerCase().includes(q) ||
        discountTypeLabel.includes(q) ||
        String(row.discountValue).toLowerCase().includes(q) ||
        String(row.minOrder).toLowerCase().includes(q) ||
        usageLimitLabel.includes(q) ||
        usedCountLabel.includes(q) ||
        String(row.status).toLowerCase().includes(q) ||
        statusLabel.includes(q) ||
        String(row.expiryDate).toLowerCase().includes(q)
      );
    });
  }, [promoCodes, search, statusFilter, t]);

  const renderedPromoCodeTotal = filteredPromoCodes.length;
  const pagedPromoCodes = filteredPromoCodes.slice(
    (safePromoCodePage - 1) * SUPPLIER_PROMO_CODES_PAGE_SIZE,
    safePromoCodePage * SUPPLIER_PROMO_CODES_PAGE_SIZE,
  );

  const promoCodeFrom =
    renderedPromoCodeTotal === 0
      ? 0
      : (safePromoCodePage - 1) * SUPPLIER_PROMO_CODES_PAGE_SIZE + 1;
  const promoCodeTo =
    renderedPromoCodeTotal === 0
      ? 0
      : Math.min(
          safePromoCodePage * SUPPLIER_PROMO_CODES_PAGE_SIZE,
          renderedPromoCodeTotal,
        );

  const handleStatusChange = useCallback(
    async (row, status) => {
      if (!row?.id || statusMutationId === row.id) return;

      try {
        setStatusMutationId(row.id);

        if (status === "expired") {
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10);

          await updatePromoCode({
            id: row.id,
            expiryDate: yesterday,
          }).unwrap();

          if (row.isActive === false) {
            await updatePromoCodeStatus({
              id: row.id,
              isActive: true,
            }).unwrap();
          }

          toast.success(
            t("panel.supplierPromoCodes.statusExpired", {
              defaultValue: "Expired",
            }),
          );
          return;
        }

        await updatePromoCodeStatus({
          id: row.id,
          isActive: status === "active",
        }).unwrap();

        toast.success(
          status === "active"
            ? t("panel.supplierPromoCodes.statusActive")
            : t("panel.supplierPromoCodes.statusDisabled"),
        );
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            t("panel.supplierPromoCodes.actionFailed", {
              defaultValue: "Could not update promo code.",
            }),
          ),
        );
      } finally {
        setStatusMutationId(null);
      }
    },
    [statusMutationId, t, updatePromoCode, updatePromoCodeStatus],
  );

  const handleRequestDeletePromoCode = useCallback((row) => {
    if (!row?.id) return;
    setPromoCodeToDelete(row);
  }, []);

  const handleCloseDeletePromoCode = useCallback(() => {
    if (deletingPromoCode) return;
    setPromoCodeToDelete(null);
  }, [deletingPromoCode]);

  const handleDeletePromoCode = useCallback(
    async (row) => {
      if (!row?.id) return;
      try {
        setDeletingPromoCode(true);
        await deletePromoCode(row.id).unwrap();
        toast.success(t("panel.supplierPromoCodes.actionDelete"));
        setPromoCodeToDelete(null);
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            t("panel.supplierPromoCodes.deleteFailed", {
              defaultValue: "Could not delete promo code.",
            }),
          ),
        );
      } finally {
        setDeletingPromoCode(false);
      }
    },
    [deletePromoCode, t],
  );

  const handleEditPromoCode = useCallback(
    (row) => {
      if (!row?.id) return;
      navigate("/supplier/promo-codes/create", {
        state: { promoCodeId: row.id, mode: "edit" },
      });
    },
    [navigate],
  );

  const handleSeePromoCodeDetails = useCallback((row) => {
    if (!row?.id) return;
    setSelectedPromoCodeId(row.id);
  }, []);

  const tableFilters = useMemo(
    () => [
      {
        id: "status",
        value: statusFilter,
        onChange: (value) => {
          setStatusFilter(value);
          setPromoCodePage(1);
        },
        options: statusOptions,
        placeholder: t("panel.supplierPromoCodes.allStatus"),
      },
    ],
    [statusFilter, statusOptions, t],
  );

  const columns = useMemo(
    () => [
      {
        key: "code",
        header: t("panel.supplierPromoCodes.colPromoCode"),
      },
      {
        key: "discountType",
        header: t("panel.supplierPromoCodes.colDiscountType"),
        render: (value) =>
          value === "fixed"
            ? t("panel.supplierPromoCodes.discountTypeFixed")
            : t("panel.supplierPromoCodes.discountTypePercentage"),
      },
      {
        key: "discountValue",
        header: t("panel.supplierPromoCodes.colDiscountValue"),
      },
      {
        key: "minOrder",
        header: t("panel.supplierPromoCodes.colMinOrder"),
      },
      {
        key: "usageLimit",
        header: t("panel.supplierPromoCodes.colUsageLimit"),
        render: (value, row) =>
          row.usageLimitUnlimited
            ? t("panel.supplierPromoCodes.unlimited")
            : value,
      },
      {
        key: "usedCount",
        header: t("panel.supplierPromoCodes.colUsedCount"),
        render: (_, row) => {
          const limitLabel = row.usageLimitUnlimited
            ? t("panel.supplierPromoCodes.unlimitedLower")
            : row.usageLimit;
          return `${row.usedCount}/${limitLabel}`;
        },
      },
      {
        key: "status",
        header: t("panel.supplierPromoCodes.colStatus"),
        render: (value) => (
          <StatusBadge
            status={value}
            label={t(STATUS_LABEL_KEYS[value])}
            className="rounded-full"
          />
        ),
      },
      {
        key: "expiryDate",
        header: t("panel.supplierPromoCodes.colExpiryDate"),
      },
    ],
    [t],
  );

  const rowActions = useMemo(
    () => [
      {
        id: "see-details",
        label: t("panel.supplierPromoCodes.actionSeeDetails"),
        variant: "header",
        onClick: handleSeePromoCodeDetails,
      },
      {
        id: "edit",
        label: t("panel.supplierPromoCodes.actionEdit"),
        onClick: handleEditPromoCode,
      },
      {
        id: "delete",
        label: t("panel.supplierPromoCodes.actionDelete"),
        onClick: handleRequestDeletePromoCode,
      },
      {
        id: "status-section",
        label: t("panel.supplierPromoCodes.statusSection"),
        variant: "section",
      },
      {
        id: "set-active",
        label: t("panel.supplierPromoCodes.statusActive"),
        onClick: (row) => handleStatusChange(row, "active"),
      },
      {
        id: "set-disabled",
        label: t("panel.supplierPromoCodes.statusDisabled"),
        onClick: (row) => handleStatusChange(row, "disabled"),
      },
      {
        id: "set-expired",
        label: t("panel.supplierPromoCodes.statusExpired"),
        onClick: (row) => handleStatusChange(row, "expired"),
      },
    ],
    [
      handleRequestDeletePromoCode,
      handleEditPromoCode,
      handleSeePromoCodeDetails,
      handleStatusChange,
      t,
    ],
  );

  return {
    search,
    setSearch,
    promoCodePage: safePromoCodePage,
    setPromoCodePage,
    columns,
    rowActions,
    tableFilters,
    pagedPromoCodes,
    isLoading: isLoading || isFetching,
    pagination: {
      page: safePromoCodePage,
      pageSize: SUPPLIER_PROMO_CODES_PAGE_SIZE,
      total: renderedPromoCodeTotal,
      from: promoCodeFrom,
      to: promoCodeTo,
      hasPrevious: safePromoCodePage > 1,
      hasNext: safePromoCodePage < promoCodePageCount,
      onPageChange: setPromoCodePage,
    },
    selectedPromoCodeId,
    selectedPromoCode,
    isPromoCodeDetailLoading,
    isPromoCodeDetailError,
    closePromoCodeDetails: () => setSelectedPromoCodeId(null),
    promoCodeToDelete,
    deletingPromoCode,
    confirmDeletePromoCode: handleDeletePromoCode,
    closeDeletePromoCode: handleCloseDeletePromoCode,
  };
}
