import { useMemo, useState } from 'react'
import { FiAward, FiCheck, FiEdit2, FiMove, FiTrash2 } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import {
  useCreateAdminAffiliateLevelMutation,
  useDeleteAdminAffiliateLevelMutation,
  useGetAdminAffiliateLevelsQuery,
  useReorderAdminAffiliateLevelsMutation,
  useUpdateAdminAffiliateLevelMutation,
} from '@/features/admin/adminAffiliateApi'
import { mapAdminAffiliateLevel } from '@/features/admin/adminAffiliateMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import { confirmDelete } from '@/utils/confirmDialog'

function reorderItems(items, fromIndex, toIndex) {
  if (fromIndex === toIndex) return items
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

function CommissionLevelCard({
  level,
  activeLabel,
  commissionSplitLabel,
  payoutNote,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
  draggable = false,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  return (
    <article
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`flex min-w-[11rem] flex-1 flex-col rounded-xl border bg-white p-4 shadow-sm transition-[opacity,box-shadow,border-color] sm:p-5 ${
        isDragging
          ? 'cursor-grabbing border-[var(--active)] opacity-50'
          : isDropTarget
            ? 'border-[var(--active)] ring-2 ring-[var(--active)]/30'
            : 'border-gray-200'
      } ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          {draggable ? (
            <span
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[var(--secondary-text)]"
              aria-hidden
            >
              <FiMove className="size-4" />
            </span>
          ) : null}
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <FiAward className="size-5" aria-hidden />
          </span>
        </div>
        {level.isActive ? (
          <span className="rounded-md bg-[color-mix(in_srgb,var(--active)_18%,white)] px-2 py-0.5 text-xs font-semibold text-[var(--active)]">
            {activeLabel}
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 text-base font-bold text-[var(--primary-text)]">
        {level.name}
      </h3>
      <p className="text-[10px] font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
        {level.requirement || '—'}
      </p>
      <p className="mt-4 text-[10px] font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
        {commissionSplitLabel}
      </p>
      <p className="mt-1 text-3xl font-bold text-[var(--primary-text)]">
        {level.commissionPercent}%
      </p>
      <p className="mt-1 text-xs text-[var(--secondary-text)]">{payoutNote}</p>
      <div className="mt-auto flex gap-2 pt-5">
        <button
          type="button"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          onClick={() => onEdit?.(level)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--active)] px-3 py-2 text-sm font-semibold text-white hover:brightness-95"
        >
          <FiEdit2 className="size-4" aria-hidden />
          {editLabel}
        </button>
        <button
          type="button"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          onClick={() => onDelete?.(level)}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          aria-label={deleteLabel}
        >
          <FiTrash2 className="size-4" aria-hidden />
        </button>
      </div>
    </article>
  )
}

const EMPTY_FORM = {
  levelName: '',
  commissionPercent: '',
  membersRequired: '',
  description: 'Recurring Lifetime payout split',
  isActive: false,
}

export default function LevelControlSection() {
  const { t } = useTranslation()
  const I18N = 'adminAffiliateDirectory.levelControl'
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [editingId, setEditingId] = useState(null)
  const [dragIndex, setDragIndex] = useState(null)
  const [dropIndex, setDropIndex] = useState(null)

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminAffiliateLevelsQuery()

  const [createLevel, { isLoading: isCreating }] =
    useCreateAdminAffiliateLevelMutation()
  const [updateLevel, { isLoading: isUpdating }] =
    useUpdateAdminAffiliateLevelMutation()
  const [deleteLevel, { isLoading: isDeleting }] =
    useDeleteAdminAffiliateLevelMutation()
  const [reorderLevels, { isLoading: isReordering }] =
    useReorderAdminAffiliateLevelsMutation()

  const levels = useMemo(
    () => (data?.levels ?? []).map(mapAdminAffiliateLevel),
    [data?.levels],
  )

  const showInitialLoading = isLoading && !data
  const isSaving = isCreating || isUpdating
  const isBusy = isSaving || isDeleting || isReordering

  const handleEdit = (level) => {
    setEditingId(level.id)
    setForm({
      levelName: level.name,
      commissionPercent: String(level.commissionPercent),
      membersRequired: String(level.membersRequired),
      description: level.description,
      isActive: level.isActive,
    })
  }

  const handleDelete = async (level) => {
    const confirmed = await confirmDelete({
      title: t(`${I18N}.deleteConfirmTitle`),
      text: t(`${I18N}.deleteConfirm`, { name: level.name }),
      confirmText: t(`${I18N}.deleteConfirmButton`),
      cancelText: t(`${I18N}.form.cancel`),
    })
    if (!confirmed) return

    try {
      const result = await deleteLevel(level.id).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N}.deleteFailed`)))
        return
      }

      if (editingId === level.id) {
        setEditingId(null)
        setForm({ ...EMPTY_FORM })
      }

      toast.success(result?.message || t(`${I18N}.deleteSuccess`))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N}.deleteFailed`)))
    }
  }

  const handleDragStart = (index) => (event) => {
    setDragIndex(index)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (index) => (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    if (dropIndex !== index) setDropIndex(index)
  }

  const handleDrop = (index) => async (event) => {
    event.preventDefault()
    const fromIndex =
      dragIndex ?? Number.parseInt(event.dataTransfer.getData('text/plain'), 10)

    setDragIndex(null)
    setDropIndex(null)

    if (Number.isNaN(fromIndex) || fromIndex === index) return

    const reordered = reorderItems(levels, fromIndex, index)
    const ids = reordered.map((level) => level.id)

    try {
      const result = await reorderLevels({ ids }).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N}.reorderFailed`)))
        return
      }

      toast.success(result?.message || t(`${I18N}.reorderSuccess`))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N}.reorderFailed`)))
    }
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDropIndex(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!form.levelName.trim()) return

    const payload = {
      name: form.levelName.trim(),
      commissionPercent: Number(form.commissionPercent) || 0,
      membersRequired: Number(form.membersRequired) || 0,
      description: form.description.trim(),
    }

    try {
      if (editingId) {
        const result = await updateLevel({
          tierId: editingId,
          ...payload,
          isActive: form.isActive,
        }).unwrap()

        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N}.saveFailed`)))
          return
        }

        toast.success(result?.message || t(`${I18N}.updateSuccess`))
      } else {
        const result = await createLevel(payload).unwrap()

        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N}.saveFailed`)))
          return
        }

        toast.success(result?.message || t(`${I18N}.createSuccess`))
      }

      handleCancel()
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N}.saveFailed`)))
    }
  }

  const formTitle = editingId ? t(`${I18N}.editTitle`) : t(`${I18N}.createTitle`)

  return (
    <div className="space-y-8">
      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, t(`${I18N}.loadFailed`))}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t('adminAffiliateDirectory.retry')}
          </button>
        </div>
      ) : null}

      {showInitialLoading ? (
        <p className="text-sm text-[var(--secondary-text)]">
          {t(`${I18N}.loading`)}
        </p>
      ) : (
        <div
          className={`flex flex-col gap-4 xl:flex-row xl:flex-wrap ${
            isFetching && data ? 'opacity-60 transition-opacity' : ''
          }`}
        >
          {levels.map((level, index) => (
            <CommissionLevelCard
              key={level.id}
              level={level}
              activeLabel={t(`${I18N}.activeBadge`)}
              commissionSplitLabel={t(`${I18N}.commissionSplit`)}
              payoutNote={level.description || t(`${I18N}.payoutNote`)}
              editLabel={t(`${I18N}.edit`)}
              deleteLabel={t(`${I18N}.delete`)}
              draggable={!isBusy}
              isDragging={dragIndex === index}
              isDropTarget={dropIndex === index && dragIndex !== index}
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDrop={handleDrop(index)}
              onDragEnd={handleDragEnd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          {formTitle}
        </h2>
        <form className="mt-5 space-y-5" onSubmit={handleSave}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
                {t(`${I18N}.form.levelName`)}
              </span>
              <input
                type="text"
                value={form.levelName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, levelName: e.target.value }))
                }
                placeholder={t(`${I18N}.form.levelNamePlaceholder`)}
                disabled={isBusy}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
                {t(`${I18N}.form.commission`)}
              </span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.commissionPercent}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    commissionPercent: e.target.value,
                  }))
                }
                placeholder="5"
                disabled={isBusy}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
                {t(`${I18N}.form.membersRequired`)}
              </span>
              <input
                type="number"
                min="0"
                value={form.membersRequired}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    membersRequired: e.target.value,
                  }))
                }
                placeholder="5"
                disabled={isBusy}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
              {t(`${I18N}.form.description`)}
            </span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={isBusy}
              className="mt-1.5 w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          {editingId ? (
            <label className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary-text)]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                disabled={isBusy}
                className="size-4 rounded border-gray-300 text-[var(--active)] focus:ring-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              />
              {t(`${I18N}.form.isActive`)}
            </label>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isBusy}
              className="rounded-lg border border-gray-200 bg-[#FBF7F0] px-5 py-2.5 text-sm font-semibold text-[var(--primary-text)] hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t(`${I18N}.form.cancel`)}
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiCheck className="size-4" aria-hidden />
              {t(`${I18N}.form.save`)}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
