import { Field, PrimaryButton, SecretInput } from './FormControls'

/**
 * Write-only EuPago credentials card.
 * Admin (Construpreço) only needs the API key; sellers only need their extern key.
 */
export default function EupagoCredentialsCard({
  form = {},
  setField,
  onSave,
  saving = false,
  showApiKey = false,
  showExternKey = true,
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
        {showApiKey ? (
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
        ) : null}
        {showExternKey ? (
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
        ) : null}
        <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {t(
            showExternKey
              ? 'panel.profile.eupagoContactNote'
              : 'panel.profile.eupagoAdminNote',
          )}
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
