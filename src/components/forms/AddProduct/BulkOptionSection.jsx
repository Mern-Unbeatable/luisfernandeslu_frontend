import {
  AiAssistButton,
  Field,
  TextAreaInput,
  TextInput,
  Toggle,
} from './FormControls'

export default function BulkOptionSection({
  enabled,
  tiers = [],
  onToggle,
  onTierChange,
  onAddTier,
}) {
  const updateTier = (id, key, value) => {
    onTierChange?.(
      tiers.map((tier) => (tier.id === id ? { ...tier, [key]: value } : tier)),
    )
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <Toggle label="Bulk Option" checked={enabled} onChange={onToggle} />

      {enabled ? (
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                <Field label="Quantity">
                  <TextInput
                    value={tier.quantity}
                    onChange={(value) => updateTier(tier.id, 'quantity', value)}
                    placeholder="1-20"
                    className="h-9 rounded-lg text-xs"
                  />
                </Field>
                <Field label="Price ($)">
                  <TextInput
                    value={tier.price}
                    onChange={(value) => updateTier(tier.id, 'price', value)}
                    placeholder="$40.00"
                    className="h-9 rounded-lg text-xs"
                  />
                </Field>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddTier}
            className="self-start text-sm font-normal text-[var(--active)] hover:underline"
          >
            Add Another condition
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function AiTextSection({
  label,
  value,
  onChange,
  placeholder,
  aiLabel,
  onAiClick,
  aiLoading = false,
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Field label={label}>
        <TextAreaInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </Field>
      <AiAssistButton
        label={aiLabel}
        onClick={onAiClick}
        disabled={aiLoading}
      />
    </div>
  )
}
