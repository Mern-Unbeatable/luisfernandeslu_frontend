export function formatDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function mapPromoCodeToFormValue(promoCode) {
  const raw = promoCode?.raw ?? {};
  const usageUnlimited = Boolean(raw.unlimited ?? raw.usageUnlimited);

  return {
    code: raw.code ?? promoCode?.code ?? "",
    discountType: String(
      raw.discountType ?? promoCode?.discountType ?? "percentage",
    ).toLowerCase(),
    discountValue: String(raw.discountValue ?? raw.discount ?? ""),
    minOrderAmount: String(raw.minOrderAmount ?? raw.minOrder ?? ""),
    expiryDate: formatDateInput(
      raw.expiryDate ?? raw.expiresAt ?? raw.expirationDate,
    ),
    usageLimit: usageUnlimited ? "" : String(raw.usageLimit ?? ""),
    usageUnlimited,
    applicableUsers: String(raw.applicableUsers ?? "all").toLowerCase(),
    applicableCategory: Array.isArray(raw.categoryIds)
      ? (raw.categoryIds[0] ?? "")
      : "",
    applicableProductIds: Array.isArray(raw.productIds) ? raw.productIds : [],
  };
}
