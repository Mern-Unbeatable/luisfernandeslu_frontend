import { useState } from 'react'
import { FiAward, FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

function CommissionLevelCard({
  level,
  subtitle,
  activeLabel,
  commissionSplitLabel,
  payoutNote,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}) {
  return (
    <article className="flex min-w-[11rem] flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
          <FiAward className="size-5" aria-hidden />
        </span>
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
        {subtitle}
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
          onClick={() => onEdit?.(level)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--active)] px-3 py-2 text-sm font-semibold text-white hover:brightness-95"
        >
          <FiEdit2 className="size-4" aria-hidden />
          {editLabel}
        </button>
        <button
          type="button"
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
  description: 'Recurring Lifetime payout spilt',
}

export default function LevelControlSection({ levels = [], onLevelsChange }) {
  const { t } = useTranslation()
  const I18N = 'adminAffiliateDirectory.levelControl'
  const [form, setForm] = useState({ ...EMPTY_FORM })

  const handleDelete = (level) => {
    onLevelsChange?.(levels.filter((item) => item.id !== level.id))
  }

  const handleEdit = (level) => {
    setForm({
      levelName: level.name,
      commissionPercent: String(level.commissionPercent),
      membersRequired: String(level.membersRequired),
      description: level.description,
    })
  }

  const handleCancel = () => setForm({ ...EMPTY_FORM })

  const handleSave = (event) => {
    event.preventDefault()
    if (!form.levelName.trim()) return
    const next = {
      id: `lvl-${Date.now()}`,
      name: form.levelName.trim(),
      subtitleKey: 'customTier',
      commissionPercent: Number(form.commissionPercent) || 0,
      membersRequired: Number(form.membersRequired) || 0,
      description: form.description,
      isActive: false,
    }
    onLevelsChange?.([...levels, next])
    setForm({ ...EMPTY_FORM })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap">
        {levels.map((level) => (
          <CommissionLevelCard
            key={level.id}
            level={level}
            subtitle={t(`${I18N}.tierSubtitles.${level.subtitleKey}`, {
              defaultValue: level.subtitleKey,
            })}
            activeLabel={t(`${I18N}.activeBadge`)}
            commissionSplitLabel={t(`${I18N}.commissionSplit`)}
            payoutNote={t(`${I18N}.payoutNote`)}
            editLabel={t(`${I18N}.edit`)}
            deleteLabel={t(`${I18N}.delete`)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          {t(`${I18N}.createTitle`)}
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
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
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
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
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
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
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
              className="mt-1.5 w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-200 bg-[#FBF7F0] px-5 py-2.5 text-sm font-semibold text-[var(--primary-text)] hover:bg-amber-50"
            >
              {t(`${I18N}.form.cancel`)}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
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
