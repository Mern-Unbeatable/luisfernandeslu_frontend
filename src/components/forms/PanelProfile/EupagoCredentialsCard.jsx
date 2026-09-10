import { Field, PrimaryButton, SecretInput } from './FormControls'

/**
 * Write-only EuPago API key + extern key card (supplier / factory / admin-style).
 */
export default function EupagoCredentialsCard({
  form = {},
  setField,
  onSave,
  saving = false,
  t,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-8">
        <h3 className="text-sm font-bold tracking-wide text-[var(--primary-text)] uppercase">
          {t('panel.profile.eupagoCredentials')}
        </h3>
      </div>
      <div className="space-y-4 p-5 sm:p-8">
        <Field label={t('panel.profile.eupagoApiKey')}>
          <SecretInput
            value={form.eupagoApiKey}
            onChange={setField('eupagoApiKey')}
            placeholder={t('panel.profile.eupagoApiKeyPlaceholder')}
            revealable={false}
            autoComplete="new-password"
          />
          <p className="mt-1.5 text-xs text-[var(--secondary-text)]">
            {t('panel.profile.eupagoApiKeyNote')}
          </p>
        </Field>
        <Field label={t('panel.profile.eupagoExternKey')}>
          <SecretInput
            value={form.eupagoExternKey}
            onChange={setField('eupagoExternKey')}
            placeholder={t('panel.profile.eupagoExternKeyPlaceholder')}
            revealable={false}
            autoComplete="new-password"
          />
          <p className="mt-1.5 text-xs text-[var(--secondary-text)]">
            {t('panel.profile.eupagoExternKeyNote')}
          </p>
        </Field>
        <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {t('panel.profile.eupagoContactNote')}
        </p>
        <div className="flex justify-end pt-1">
          <PrimaryButton onClick={onSave} loading={saving}>
            {t('panel.profile.saveIban')}
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}
