import { baseApi } from "../../../services/api/baseApi";
import { parseNumber, pickList, pickPage, pickTotal } from "../apiError";

function resolveImageValue(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return (
      value.url ||
      value.src ||
      value.path ||
      value.imageUrl ||
      value.thumbnail ||
      value.bannerImageUrl ||
      value.image?.url ||
      value.image?.src ||
      ""
    );
  }
  return "";
}

function resolveGallery(value) {
  const candidates = [];
  const raw = value || {};

  if (Array.isArray(raw.gallery)) candidates.push(...raw.gallery);
  if (Array.isArray(raw.images)) candidates.push(...raw.images);
  if (Array.isArray(raw.product?.gallery))
    candidates.push(...raw.product.gallery);
  if (Array.isArray(raw.product?.images))
    candidates.push(...raw.product.images);

  return candidates.map((entry) => resolveImageValue(entry)).filter(Boolean);
}

function formatPriceText(item = {}) {
  const baseValue =
    item.basePrice ??
    item.price ??
    item.unitPrice ??
    item.salePrice ??
    item.currentPrice ??
    item.product?.basePrice ??
    item.product?.price ??
    item.product?.unitPrice ??
    item.product?.salePrice;

  const price = parseNumber(baseValue);
  const unit = item.unit ?? item.product?.unit ?? item.unitLabel ?? "unit";

  if (price == null) {
    return item.priceText ?? item.product?.priceText ?? "Price on request";
  }

  return `Price: €${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} per ${unit}`;
}

function mapSupplierFactoryProductItem(item) {
  if (!item || typeof item !== "object") return null;

  const productRef = item.product ?? {};
  const image =
    resolveImageValue(
      item.bannerImage ||
        item.image ||
        productRef.image ||
        productRef.bannerImage ||
        item.gallery?.[0] ||
        productRef.gallery?.[0] ||
        item.images?.[0] ||
        productRef.images?.[0],
    ) ||
    resolveGallery(item)[0] ||
    "";

  const title =
    item.title || productRef.title || item.name || productRef.name || "";
  const description =
    item.description ||
    productRef.description ||
    item.shortDescription ||
    productRef.shortDescription ||
    "";

  return {
    id: String(item.id ?? productRef.id ?? item._id ?? ""),
    factoryId: item.factoryId ?? productRef.factoryId ?? item.factory?.id ?? "",
    product: {
      image,
      title,
      description,
      priceText:
        item.priceText ??
        productRef.priceText ??
        formatPriceText({ ...item, ...productRef }),
      unit: item.unit ?? productRef.unit ?? "unit",
      sku: item.sku ?? productRef.sku ?? "",
      category: item.category?.name ?? productRef.category?.name ?? "",
    },
    raw: item,
  };
}

export function mapSupplierFactoryProductList(payload, fallbackPage = 1) {
  const products = pickList(payload, ["products", "items", "data"])
    .map(mapSupplierFactoryProductItem)
    .filter(Boolean);

  const total = pickTotal(payload, products.length);
  const page = pickPage(payload, fallbackPage);
  const limitValue =
    payload?.limit ?? payload?.pagination?.limit ?? payload?.meta?.limit ?? 12;
  const limit = Number(limitValue || 12) || 12;

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil((total || products.length) / limit)),
  };
}

function mapSupplierFactoryProductDetail(payload) {
  const item = payload?.product ?? payload?.data ?? payload ?? {};
  const productRef = item.product ?? {};

  const gallery = resolveGallery(item);
  const image =
    resolveImageValue(
      item.bannerImage ||
        item.image ||
        productRef.image ||
        productRef.bannerImage ||
        gallery[0],
    ) || "";

  const title =
    item.title || productRef.title || item.name || productRef.name || "";
  const description =
    item.description ||
    productRef.description ||
    item.shortDescription ||
    productRef.shortDescription ||
    "";

  const basePrice =
    item.basePrice ??
    productRef.basePrice ??
    item.price ??
    productRef.price ??
    item.unitPrice ??
    productRef.unitPrice ??
    item.salePrice ??
    productRef.salePrice;

  const parsedPrice = parseNumber(basePrice);
  const priceText =
    item.priceText ??
    productRef.priceText ??
    (parsedPrice == null
      ? "Price on request"
      : `€${parsedPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`);

  return {
    id: String(item.id ?? productRef.id ?? item._id ?? ""),
    factoryId: item.factoryId ?? productRef.factoryId ?? item.factory?.id ?? "",
    title,
    sku: item.sku ?? productRef.sku ?? "",
    category:
      item.category?.name ??
      productRef.category?.name ??
      item.categoryName ??
      productRef.categoryName ??
      "",
    description,
    descriptionParagraphs: Array.isArray(item.descriptionParagraphs)
      ? item.descriptionParagraphs
      : Array.isArray(productRef.descriptionParagraphs)
        ? productRef.descriptionParagraphs
        : description
          ? [description]
          : [],
    image,
    images: gallery.length ? gallery : image ? [image] : [],
    priceText,
    price:
      parsedPrice == null
        ? null
        : `€${parsedPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
    unit:
      item.unit ??
      productRef.unit ??
      item.unitLabel ??
      productRef.unitLabel ??
      "unit",
    availability: item.availability ?? item.stockStatus ?? "In stock",
    rating: Number(item.rating ?? productRef.rating ?? 0) || 0,
    feedbackCount:
      Number(item.feedbackCount ?? productRef.feedbackCount ?? 0) || 0,
    features: Array.isArray(item.features)
      ? item.features
      : Array.isArray(productRef.features)
        ? productRef.features
        : Array.isArray(item.specifications)
          ? item.specifications
          : Array.isArray(productRef.specifications)
            ? productRef.specifications
            : [],
    seller: item.factory
      ? {
          id: item.factory.id ?? "",
          name: item.factory.name ?? item.factory.businessName ?? "Factory",
          location: item.factory.location ?? item.factory.city ?? "",
        }
      : null,
    raw: item,
  };
}

export const supplierFactoryProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierFactoryProducts: builder.query({
      query: ({ page = 1, limit = 12, search = "", factoryId = "" } = {}) => ({
        url: "/api/supplier/factory-products",
        method: "GET",
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(factoryId ? { factoryId } : {}),
        },
      }),
      transformResponse: (response, _meta, arg) =>
        mapSupplierFactoryProductList(response, arg?.page ?? 1),
      providesTags: (result) =>
        result?.products?.length
          ? [
              ...result.products.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "SUPPLIER_FACTORY_PRODUCTS" },
            ]
          : [{ type: "Product", id: "SUPPLIER_FACTORY_PRODUCTS" }],
    }),
    getSupplierFactoryProductById: builder.query({
      query: (id) => ({
        url: `/api/supplier/factory-products/${id}`,
        method: "GET",
      }),
      transformResponse: (response) =>
        mapSupplierFactoryProductDetail(response),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const {
  useGetSupplierFactoryProductsQuery,
  useGetSupplierFactoryProductByIdQuery,
} = supplierFactoryProductsApi;
