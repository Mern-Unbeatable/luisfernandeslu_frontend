import { useMemo, useState } from 'react'
import { FiCheck, FiClock, FiEdit2 } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import {
  useCreateAdminPromotionPlanMutation,
  useGetAdminPromotionPlansQuery,
  useUpdateAdminPromotionPlanMutation,
} from '@/features/admin/adminPromotionPlanApi'
import { mapAdminPromotionPlan } from '@/features/admin/adminPromotionPlanMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

const I18N_KEY = 'adminMarketingManagement.promotionPlans'

const CURRENCIES = ['USD', 'EUR']

const EMPTY_FORM = {
  label: '',
  durationDays: '',
  price: '',
  currency: 'USD',
  isActive: true,
  sortOrder: '',
}

function PromotionPlanCard({ plan, activeLabel, durationLabel, onEdit, editLabel }) {
  return (
    <article className="flex min-w-[11rem] flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
          <FiClock className="size-5" aria-hidden />
        </span>
        {plan.isActive ? (
          <span className="rounded-md bg-[color-mix(in_srgb,var(--active)_18%,white)] px-2 py-0.5 text-xs font-semibold text-[var(--active)]">
            {activeLabel}
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 text-base font-bold text-[var(--primary-text)]">
        {plan.label}
      </h3>
      <p className="mt-1 text-sm text-[var(--secondary-text)]">
        {durationLabel}: {plan.durationDays}
      </p>
      <p className="mt-4 text-3xl font-bold text-[var(--primary-text)]">
        {plan.priceDisplay}
      </p>
      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={() => onEdit?.(plan)}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--active)] px-3 py-2 text-sm font-semibold text-white hover:brightness-95"
        >
          <FiEdit2 className="size-4" aria-hidden />
          {editLabel}
        </button>
      </div>
    </article>
  )
}

export default function PromotionPlansSection() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [editingId, setEditingId] = useState(null)

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminPromotionPlansQuery()

  const [createPlan, { isLoading: isCreating }] =
    useCreateAdminPromotionPlanMutation()
  const [updatePlan, { isLoading: isUpdating }] =
    useUpdateAdminPromotionPlanMutation()

  const plans = useMemo(
    () =>
      [...(data?.plans ?? [])]
        .map(mapAdminPromotionPlan)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [data?.plans],
  )

  const showInitialLoading = isLoading && !data
  const isSaving = isCreating || isUpdating

  const handleEdit = (plan) => {
    setEditingId(plan.id)
    setForm({
      label: plan.label,
      durationDays: String(plan.durationDays),
      price: String(plan.price),
      currency: plan.currency,
      isActive: plan.isActive,
      sortOrder: plan.sortOrder == null ? '' : String(plan.sortOrder),
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.label.trim()) return

    try {
      if (editingId) {
        const result = await updatePlan({
          planId: editingId,
          label: form.label.trim(),
          durationDays: Number(form.durationDays) || 0,
          price: Number(form.price) || 0,
          currency: form.currency,
          isActive: form.isActive,
          sortOrder:
            form.sortOrder === '' ? undefined : Number(form.sortOrder) || 0,
        }).unwrap()

        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.saveFailed`)))
          return
        }

        toast.success(result?.message || t(`${I18N_KEY}.updateSuccess`))
      } else {
        const result = await createPlan({
          label: form.label.trim(),
          durationDays: Number(form.durationDays) || 0,
          price: Number(form.price) || 0,
          currency: form.currency,
          isActive: form.isActive,
          sortOrder: Number(form.sortOrder) || plans.length + 1,
        }).unwrap()

        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.saveFailed`)))
          return
        }

        toast.success(result?.message || t(`${I18N_KEY}.createSuccess`))
      }

      handleCancel()
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.saveFailed`)))
    }
  }

  const formTitle = editingId
    ? t(`${I18N_KEY}.editTitle`)
    : t(`${I18N_KEY}.createTitle`)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[var(--primary-text)] sm:text-xl">
          {t(`${I18N_KEY}.sectionTitle`)}
        </h2>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.sectionSubtitle`)}
        </p>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, t(`${I18N_KEY}.loadFailed`))}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t('adminMarketingManagement.retry')}
          </button>
        </div>
      ) : null}

      {showInitialLoading ? (
        <p className="text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.loading`)}
        </p>
      ) : (
        <div
          className={`flex flex-col gap-4 xl:flex-row xl:flex-wrap ${
            isFetching && data ? 'opacity-60 transition-opacity' : ''
          }`}
        >
          {plans.length === 0 ? (
            <p className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-[var(--secondary-text)]">
              {t(`${I18N_KEY}.empty`)}
            </p>
          ) : (
            plans.map((plan) => (
              <PromotionPlanCard
                key={plan.id}
                plan={plan}
                activeLabel={t(`${I18N_KEY}.activeBadge`)}
                durationLabel={t(`${I18N_KEY}.durationDays`)}
                editLabel={t(`${I18N_KEY}.edit`)}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-bold text-[var(--primary-text)]">
          {formTitle}
        </h3>
        <form className="mt-5 space-y-5" onSubmit={handleSave}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
                {t(`${I18N_KEY}.form.label`)}
              </span>
              <input
                type="text"
                value={form.label}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, label: e.target.value }))
                }
                placeholder={t(`${I18N_KEY}.form.labelPlaceholder`)}
                disabled={isSaving}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
                {t(`${I18N_KEY}.form.durationDays`)}
              </span>
              <input
                type="number"
                min="1"
                value={form.durationDays}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    durationDays: e.target.value,
                  }))
                }
                placeholder="7"
                disabled={isSaving}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
                {t(`${I18N_KEY}.form.price`)}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="29.90"
                disabled={isSaving}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
                {t(`${I18N_KEY}.form.currency`)}
              </span>
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, currency: e.target.value }))
                }
                disabled={isSaving}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
                {t(`${I18N_KEY}.form.sortOrder`)}
              </span>
              <input
                type="number"
                min="1"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, sortOrder: e.target.value }))
                }
                placeholder="1"
                disabled={isSaving}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary-text)]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              disabled={isSaving}
              className="size-4 rounded border-gray-300 text-[var(--active)] focus:ring-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
            />
            {t(`${I18N_KEY}.form.isActive`)}
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-lg border border-gray-200 bg-[#FBF7F0] px-5 py-2.5 text-sm font-semibold text-[var(--primary-text)] hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t(`${I18N_KEY}.form.cancel`)}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiCheck className="size-4" aria-hidden />
              {t(`${I18N_KEY}.form.save`)}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
