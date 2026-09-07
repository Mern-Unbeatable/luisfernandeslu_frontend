import {
  fileList,
  firstFile,
  formatEuro,
  parseNumber,
  pickList,
  pickPage,
  pickTotal,
  splitLines,
} from "../apiError";

const TAB_ALIASES = {
  all: "all",
  pending: "pending",
  pending_review: "pending",
  pendingreview: "pending",
  rejected: "rejected",
  regular: "regular",
  bulk: "bulk_order",
  bulk_order: "bulk_order",
  bulkorder: "bulk_order",
  featured: "featured",
};

export function toApiProductTab(tab) {
  if (tab === "bulk_order") return "bulk";
  return tab || "all";
}

export function fromApiProductTab(value) {
  const key = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return TAB_ALIASES[key] || null;
}

function resolveProductTab(item) {
  const explicit =
    fromApiProductTab(item.tab) ||
    fromApiProductTab(item.listingStatus) ||
    fromApiProductTab(item.moderationStatus) ||
    fromApiProductTab(item.status);

  if (explicit && explicit !== "regular") return explicit;
  if (item.isFeatured || item.featured || item.promotion?.status === "ACTIVE") {
    return "featured";
  }
  if (item.bulkEnabled || item.bulkOptions?.length) return "bulk_order";
  if (explicit) return explicit;
  return "regular";
}

function resolveCardStatus(tab, item) {
  const raw = String(
    item.status || item.listingStatus || item.moderationStatus || "",
  ).toLowerCase();
  if (tab === "pending" || raw.includes("pending")) return "pending";
  if (tab === "rejected" || raw.includes("reject")) return "rejected";
  return null;
}

function toImageUrl(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof File || value instanceof Blob) return value;
  if (typeof value === "object") {
    return (
      value.url ||
      value.src ||
      value.path ||
      value.bannerImageUrl ||
      value.imageUrl ||
      ""
    );
  }
  return "";
}

function resolveImage(item) {
  return toImageUrl(
    item.bannerImage ||
      item.bannerImageUrl ||
      item.image ||
      item.thumbnail ||
      item.images?.[0] ||
      item.gallery?.[0] ||
      "",
  );
}

function formatPriceText(item) {
  const price = formatEuro(item.basePrice ?? item.price ?? item.unitPrice);
  if (item.bulkEnabled || item.tab === "bulk_order") {
    return `Price: ${price} per unit (bulk)`;
  }
  return `Price: ${price} per unit`;
}

export function mapSupplierCatalogItem(item) {
  if (!item || typeof item !== "object") return null;

  const tab = resolveProductTab(item);
  const status = resolveCardStatus(tab, item);
  const title = item.title || item.name || item.product?.title || "";

  return {
    id: item.id,
    tab,
    categoryId: item.categoryId || item.category?.id || "",
    categoryName: item.category?.name || item.categoryName || "",
    subCategoryId: item.subCategoryId || item.subCategory?.id || "",
    productTypeId: item.productTypeId || item.productType?.id || "",
    sku: item.sku || "",
    warehouseLocation: item.warehouseLocation || item.warehouse || "",
    quantity: item.quantity ?? item.listedQuantity ?? "",
    weight: item.weightKg ?? item.weight ?? "",
    b2bDiscount: item.b2bDiscount,
    minB2bQuantity: item.minB2bQuantity,
    feature: item.feature,
    additionalInformation: item.additionalInfo || item.additionalInformation,
    specifications: item.specifications,
    bulkEnabled: Boolean(item.bulkEnabled || item.bulkOptions?.length),
    bulkTiers: mapBulkTiersFromApi(item.bulkOptions || item.bulkTiers),
    cardType: tab === "featured" ? "featured" : "dashboard",
    tag:
      tab === "regular" || tab === "bulk_order" || tab === "featured"
        ? tab
        : null,
    status,
    badge:
      tab === "featured"
        ? { label: "Featured", className: "bg-sky-100 text-sky-700" }
        : null,
    product: {
      image: resolveImage(item),
      title,
      description: item.description || item.product?.description || "",
      priceText: item.priceText || formatPriceText({ ...item, tab }),
      expiryDate: item.promotion?.endsAt || item.expiryDate,
    },
    raw: item,
  };
}

function normalizeTabCountKey(value) {
  const key = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return fromApiProductTab(key) || key;
}

function normalizeTabCounts(rawCounts) {
  if (!rawCounts || typeof rawCounts !== "object") return {};

  return Object.entries(rawCounts).reduce((acc, [key, value]) => {
    const normalizedKey = normalizeTabCountKey(key);
    const parsedValue = Number(value);

    if (!normalizedKey || !Number.isFinite(parsedValue)) return acc;

    acc[normalizedKey] = Math.max(acc[normalizedKey] ?? 0, parsedValue);
    return acc;
  }, {});
}

export function mapSupplierProductList(payload, fallbackPage = 1) {
  const products = pickList(payload, ["products", "items"])
    .map(mapSupplierCatalogItem)
    .filter(Boolean);

  const counts =
    payload?.tabCounts ||
    payload?.counts ||
    payload?.tabs ||
    payload?.data?.tabCounts ||
    payload?.data?.counts ||
    payload?.data?.tabs ||
    null;

  const normalizedCounts = normalizeTabCounts(counts);
  const fallbackCounts = products.reduce(
    (acc, item) => {
      const tab = item.tab || "regular";
      acc.all = (acc.all ?? 0) + 1;
      acc[tab] = (acc[tab] ?? 0) + 1;
      return acc;
    },
    { all: products.length },
  );

  return {
    products,
    total: pickTotal(payload, products.length),
    page: pickPage(payload, fallbackPage),
    tabCounts:
      Object.keys(normalizedCounts).length > 0
        ? { ...fallbackCounts, ...normalizedCounts }
        : fallbackCounts,
  };
}

function mapBulkTiersFromApi(tiers = []) {
  if (!Array.isArray(tiers)) return [];
  return tiers.map((tier, index) => ({
    id: tier.id || `tier-${index + 1}`,
    quantity:
      tier.quantity ||
      (tier.minQuantity != null && tier.maxQuantity != null
        ? `${tier.minQuantity}-${tier.maxQuantity}`
        : String(tier.minQuantity ?? "")),
    price:
      tier.price != null
        ? formatEuro(tier.price)
        : String(tier.priceLabel || ""),
  }));
}

function mapBulkOptionsForApi(tiers = []) {
  return tiers
    .map((tier) => {
      const range = String(tier.quantity || "").match(
        /(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)/i,
      );
      const minQuantity = range
        ? Number(range[1])
        : parseNumber(String(tier.quantity || "").split("-")[0]);
      const maxQuantity = range
        ? Number(range[2])
        : (parseNumber(String(tier.quantity || "").split("-")[1]) ??
          minQuantity);
      const price = parseNumber(tier.price);
      if (minQuantity == null || price == null) return null;
      return {
        minQuantity,
        maxQuantity: maxQuantity ?? minQuantity,
        price,
      };
    })
    .filter(Boolean);
}

export function buildProductFormData(form, { includeLocked = true } = {}) {
  const data = new FormData();
  const warehouseLocation =
    form.warehouseLocationLabel || form.warehouseLocation || "";

  if (includeLocked && form.sku) data.append("sku", String(form.sku).trim());
  if (form.title) data.append("title", String(form.title).trim());
  if (warehouseLocation) data.append("warehouseLocation", warehouseLocation);
  if (includeLocked && form.categoryId)
    data.append("categoryId", form.categoryId);
  if (includeLocked && form.subCategoryId) {
    data.append("subCategoryId", form.subCategoryId);
  }
  if (includeLocked && form.productTypeId) {
    data.append("productTypeId", form.productTypeId);
  }

  const quantity = parseNumber(form.quantity);
  if (quantity != null) data.append("quantity", String(quantity));

  const basePrice = parseNumber(form.basePrice);
  if (basePrice != null) data.append("basePrice", String(basePrice));

  const b2bDiscount = parseNumber(form.b2bDiscount);
  if (b2bDiscount != null) data.append("b2bDiscount", String(b2bDiscount));

  const minB2bQuantity = parseNumber(form.minB2bQuantity);
  if (minB2bQuantity != null)
    data.append("minB2bQuantity", String(minB2bQuantity));

  const weightKg = parseNumber(form.weight);
  if (weightKg != null) data.append("weightKg", String(weightKg));

  if (form.description) data.append("description", form.description);
  if (form.feature) data.append("feature", form.feature);
  if (form.additionalInformation) {
    data.append("additionalInfo", form.additionalInformation);
  }
  if (form.specifications) data.append("specifications", form.specifications);

  const bulkEnabled = Boolean(form.bulkEnabled);
  data.append("bulkEnabled", String(bulkEnabled));
  if (bulkEnabled) {
    data.append(
      "bulkOptions",
      JSON.stringify(mapBulkOptionsForApi(form.bulkTiers)),
    );
  }

  const banner = firstFile(form.bannerImage);
  if (banner) data.append("bannerImage", banner);

  fileList(form.otherImages).forEach((file) => {
    data.append("images", file);
  });

  return data;
}

export function mapLookupToForm(product, current = {}) {
  if (!product) return current;

  return {
    ...current,
    sku: product.sku || current.sku,
    title: product.title || current.title,
    warehouseLocation:
      product.warehouseLocation ||
      product.warehouse ||
      current.warehouseLocation,
    categoryId:
      product.category?.id || product.categoryId || current.categoryId,
    subCategoryId:
      product.subCategory?.id || product.subCategoryId || current.subCategoryId,
    productTypeId:
      product.productType?.id || product.productTypeId || current.productTypeId,
    quantity:
      product.quantity != null ? String(product.quantity) : current.quantity,
    basePrice:
      product.basePrice != null
        ? formatEuro(product.basePrice)
        : current.basePrice,
  };
}

export function mapProductToFormValue(product) {
  if (!product) return null;

  const catalog = product.raw ? mapSupplierCatalogItem(product.raw) : product;
  const source = product.raw || product;

  return {
    warehouseLocation:
      source.warehouseLocation ||
      source.warehouse ||
      catalog?.warehouseLocation ||
      "",
    categoryId: source.categoryId || source.category?.id || "",
    subCategoryId: source.subCategoryId || source.subCategory?.id || "",
    productTypeId: source.productTypeId || source.productType?.id || "",
    title: source.title || catalog?.product?.title || "",
    quantity: String(source.quantity ?? source.listedQuantity ?? ""),
    basePrice: formatEuro(source.basePrice ?? source.price),
    b2bDiscount: source.b2bDiscount != null ? String(source.b2bDiscount) : "",
    minB2bQuantity:
      source.minB2bQuantity != null ? String(source.minB2bQuantity) : "",
    sku: source.sku || "",
    weight: String(source.weightKg ?? source.weight ?? ""),
    description: source.description || "",
    feature: source.feature || "",
    additionalInformation:
      source.additionalInfo || source.additionalInformation || "",
    specifications: source.specifications || "",
    bulkEnabled: Boolean(source.bulkEnabled || source.bulkOptions?.length),
    bulkTiers: mapBulkTiersFromApi(source.bulkOptions || source.bulkTiers),
    bannerImage: resolveImage(source) || null,
    otherImages: (source.images || source.gallery || [])
      .map(toImageUrl)
      .filter((url) => url && url !== resolveImage(source)),
  };
}

export function mapProductDetail(payload) {
  const item = payload?.product || payload?.data || payload;
  if (!item || typeof item !== "object") return null;

  const images = [];
  const banner = resolveImage(item);
  if (banner) images.push(banner);
  (item.images || item.gallery || []).forEach((src) => {
    const url = toImageUrl(src);
    if (url && !images.includes(url)) images.push(url);
  });

  const features = splitLines(item.feature || item.features);
  const description = item.description || "";
  const additional = item.additionalInfo || item.additionalInformation || "";
  const specifications = item.specifications || "";
  const stock = item.quantity ?? item.listedQuantity ?? item.stock;
  const categoryName =
    item.category?.name ||
    [item.category?.name, item.subCategory?.name, item.productType?.name]
      .filter(Boolean)
      .join(" › ") ||
    item.categoryName ||
    "";

  const bulkPricing = (item.bulkOptions || []).map((tier) => ({
    range:
      tier.minQuantity != null && tier.maxQuantity != null
        ? `${tier.minQuantity} - ${tier.maxQuantity}`
        : String(tier.quantity || ""),
    price: `${formatEuro(tier.price)} each`,
  }));

  const reviews = (item.reviews || []).map((review, index) => ({
    id: review.id || `review-${index + 1}`,
    author: review.author || review.userName || review.name || "Customer",
    rating: review.rating ?? 0,
    text: review.text || review.comment || "",
  }));

  return {
    id: item.id,
    title: item.title || item.name || "",
    sku: item.sku || "",
    category: categoryName,
    availability:
      Number(stock) > 0 ? "In Stock" : item.availability || "Out of stock",
    warehouse: item.warehouseLocation || item.warehouse || "",
    rating: item.rating ?? item.averageRating ?? 0,
    feedbackCount: item.feedbackCount ?? item.reviewCount ?? reviews.length,
    price: formatEuro(item.basePrice ?? item.price),
    priceText:
      item.priceText || `${formatEuro(item.basePrice ?? item.price)} per unit`,
    unit: item.unit || "",
    minOrder: item.minB2bQuantity != null ? `${item.minB2bQuantity} PCS` : "",
    images,
    image: images[0] || "",
    bulkPricing,
    description,
    descriptionParagraphs: description ? [description] : [],
    features,
    additionalText: additional,
    additionalParagraphs: additional ? [additional] : [],
    specificationText: specifications,
    specificationParagraphs: specifications ? [specifications] : [],
    reviews,
    raw: item,
  };
}

export function mapPromotionPlans(payload) {
  return pickList(payload, ["plans", "promotionPlans"]).map((plan) => ({
    id: plan.id,
    name:
      plan.name || plan.title || `${plan.days || plan.durationDays || ""} days`,
    price: formatEuro(plan.price ?? plan.amount),
    days: plan.days || plan.durationDays,
    raw: plan,
  }));
}

export function resolveAiField(section) {
  if (section === "additionalInformation") return "additionalInfo";
  return section;
}
