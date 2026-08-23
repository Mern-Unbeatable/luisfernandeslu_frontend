import { baseApi } from '../../../services/api/baseApi'
import { pickList, pickPage, pickTotal } from '../apiError'

const NORMALIZED_STATUS_MAP = {
  active: 'active',
  enabled: 'active',
  published: 'active',
  disabled: 'disabled',
  inactive: 'disabled',
  expired: 'expired',
  ended: 'expired',
  finished: 'expired',
}

function normalizeDiscountType(value) {
  const key = String(value ?? '').trim().toUpperCase()
  if (key === 'FIXED' || key === 'FIXED_AMOUNT' || key === 'AMOUNT') return 'fixed'
  if (key === 'PERCENTAGE' || key === 'PCT' || key === '%') return 'percentage'
  return 'percentage'
}

function parseNumberValue(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const cleaned = String(value ?? '')
    .replace(/[^0-9.-]+/g, '')
    .trim()
  if (!cleaned) return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

function formatCurrencyValue(value) {
  if (value == null || value === '') return '€0'
  const amount = parseNumberValue(value)
  if (amount == null) return String(value)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateValue(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function toPromoCodeStatus(rawStatus, isActive, expiryDate) {
  const statusKey = String(rawStatus ?? '').trim().toLowerCase()
  const mapped = NORMALIZED_STATUS_MAP[statusKey]

  if (mapped) return mapped

  if (isActive === false) return 'disabled'

  const expiry = expiryDate ? new Date(expiryDate) : null
  if (expiry && !Number.isNaN(expiry.getTime()) && expiry.getTime() < Date.now()) {
    return 'expired'
  }

  return isActive === true ? 'active' : 'disabled'
}

function mapPromoCodeItem(item) {
  if (!item || typeof item !== 'object') return null

  const rawDiscountType = normalizeDiscountType(item.discountType ?? item.type)
  const discountValue = item.discountValue ?? item.discount ?? item.value
  const parsedDiscount = parseNumberValue(discountValue)
  const usageUnlimited = Boolean(item.unlimited ?? item.usageUnlimited)
  const usageLimit = item.usageLimit ?? item.usage_limit
  const minOrderAmount = item.minOrderAmount ?? item.minOrder ?? item.minimumOrder ?? 0
  const isActive =
    item.isActive != null
      ? Boolean(item.isActive)
      : item.active != null
        ? Boolean(item.active)
        : item.status != null
          ? String(item.status).toLowerCase() === 'active'
          : true

  return {
    id: item.id ?? item._id ?? item.promoCodeId ?? '',
    code: item.code ?? item.promoCode ?? '',
    discountType: rawDiscountType,
    discountValue:
      parsedDiscount != null
        ? rawDiscountType === 'fixed'
          ? formatCurrencyValue(parsedDiscount)
          : `${parsedDiscount}%`
        : String(discountValue ?? ''),
    minOrder: formatCurrencyValue(minOrderAmount),
    usageLimit: usageUnlimited ? 'Unlimited' : String(usageLimit ?? ''),
    usageLimitUnlimited: usageUnlimited,
    usedCount: Number(item.usedCount ?? item.used ?? item.redemptions ?? 0) || 0,
    status: toPromoCodeStatus(item.status, isActive, item.expiryDate ?? item.expiresAt),
    expiryDate: formatDateValue(item.expiryDate ?? item.expiresAt ?? item.expirationDate),
    isActive,
    raw: item,
  }
}

export function mapPromoCodeList(payload, fallbackPage = 1) {
  const list = pickList(payload, ['promoCodes', 'codes', 'items', 'data'])
    .map(mapPromoCodeItem)
    .filter(Boolean)

  const total = pickTotal(payload, list.length)
  const page = pickPage(payload, fallbackPage)

  return {
    promoCodes: list,
    total,
    page,
  }
}

export function buildPromoCodePayload(form = {}) {
  const code = String(form.code ?? '').trim()
  const discountType = String(form.discountType ?? 'percentage').toUpperCase()
  const discountValue = parseNumberValue(form.discountValue)
  const minOrderAmount = parseNumberValue(form.minOrderAmount)
  const usageLimit = parseNumberValue(form.usageLimit)
  const expiryDate = form.expiryDate
    ? new Date(`${form.expiryDate}T23:59:59.000Z`).toISOString()
    : undefined

  const payload = {
    code,
    discountType,
    ...(discountValue != null ? { discountValue } : {}),
    ...(minOrderAmount != null ? { minOrderAmount } : {}),
    ...(expiryDate ? { expiryDate } : {}),
    ...(form.usageUnlimited ? { unlimited: true } : {}),
    ...(form.usageUnlimited ? {} : usageLimit != null ? { usageLimit } : {}),
    ...(form.applicableUsers ? { applicableUsers: String(form.applicableUsers).toUpperCase() } : {}),
  }

  const categoryIds = Array.isArray(form.categoryIds)
    ? form.categoryIds.filter(Boolean)
    : form.applicableCategory
      ? [form.applicableCategory]
      : []

  const productIds = Array.isArray(form.productIds)
    ? form.productIds.filter(Boolean)
    : Array.isArray(form.applicableProductIds)
      ? form.applicableProductIds.filter(Boolean)
      : []

  if (categoryIds.length) payload.categoryIds = categoryIds
  if (productIds.length) payload.productIds = productIds

  return payload
}

export const supplierPromoCodesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPromoCodes: builder.query({
      query: ({ status = 'all', scope = 'all', page = 1, limit = 20, productId } = {}) => ({
        url: '/api/promo-codes',
        method: 'GET',
        params: {
          status,
          scope,
          ...(productId ? { productId } : {}),
          page,
          limit,
        },
      }),
      transformResponse: (response, _meta, arg) =>
        mapPromoCodeList(response, arg?.page ?? 1),
      providesTags: (result) =>
        result?.promoCodes?.length
          ? [
              ...result.promoCodes.map(({ id }) => ({ type: 'PromoCode', id })),
              { type: 'PromoCode', id: 'LIST' },
            ]
          : [{ type: 'PromoCode', id: 'LIST' }],
    }),
    getPromoCodeById: builder.query({
      query: (id) => ({
        url: `/api/promo-codes/${id}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        const item = response?.promoCode ?? response?.data ?? response
        return mapPromoCodeItem(item)
      },
      providesTags: (_result, _error, id) => [{ type: 'PromoCode', id }],
    }),
    createPromoCode: builder.mutation({
      query: (body) => ({
        url: '/api/promo-codes',
        method: 'POST',
        data: buildPromoCodePayload(body),
      }),
      invalidatesTags: [{ type: 'PromoCode', id: 'LIST' }],
    }),
    updatePromoCode: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/promo-codes/${id}`,
        method: 'PATCH',
        data: buildPromoCodePayload(body),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'PromoCode', id },
        { type: 'PromoCode', id: 'LIST' },
      ],
    }),
    updatePromoCodeStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/api/promo-codes/${id}/status`,
        method: 'PATCH',
        data: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'PromoCode', id },
        { type: 'PromoCode', id: 'LIST' },
      ],
    }),
    deletePromoCode: builder.mutation({
      query: (id) => ({
        url: `/api/promo-codes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'PromoCode', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetPromoCodesQuery,
  useGetPromoCodeByIdQuery,
  useCreatePromoCodeMutation,
  useUpdatePromoCodeMutation,
  useUpdatePromoCodeStatusMutation,
  useDeletePromoCodeMutation,
} = supplierPromoCodesApi
