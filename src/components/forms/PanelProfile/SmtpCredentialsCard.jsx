import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import {
  FiCheckCircle,
  FiHelpCircle,
  FiMail,
  FiSend,
  FiServer,
  FiShield,
} from 'react-icons/fi'
import {
  useGetAdminSmtpQuery,
  useTestAdminSmtpMutation,
  useUpdateAdminSmtpMutation,
} from '@/features/admin/adminProfileApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import { Field, PrimaryButton, SecretInput, TextInput } from './FormControls'
import SmtpGuideModal from './SmtpGuideModal'

const PRESETS = {
  google: {
    label: 'Google Workspace / Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
  },
  hostinger: {
    label: 'Hostinger',
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
  },
}

export default function SmtpCredentialsCard({ t: propT }) {
  const { t: fallbackT } = useTranslation()
  const t = propT || fallbackT

  const { data, isLoading } = useGetAdminSmtpQuery()
  const [updateSmtp, { isLoading: isSaving }] = useUpdateAdminSmtpMutation()
  const [testSmtp, { isLoading: isTesting }] = useTestAdminSmtpMutation()

  const [form, setForm] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: '',
    fromEmail: '',
    fromName: 'Construpreço',
    pass: '',
  })

  const [hasStoredPassword, setHasStoredPassword] = useState(false)
  const [testRecipient, setTestRecipient] = useState('')
  const [showTestInput, setShowTestInput] = useState(false)
  const [isGuideOpen, setIsGuideOpen] = useState(false)

  useEffect(() => {
    if (data?.smtp) {
      const s = data.smtp
      setForm({
        host: s.host || 'smtp.gmail.com',
        port: s.port ? Number(s.port) : 587,
        secure: Boolean(s.secure),
        user: s.user || '',
        fromEmail: s.fromEmail || s.user || '',
        fromName: s.fromName || 'Construpreço',
        pass: '',
      })
      setHasStoredPassword(Boolean(s.hasPassword))
      if (s.user && !testRecipient) {
        setTestRecipient(s.user)
      }
    }
  }, [data, testRecipient])

  const setField = (key) => (val) => {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey]
    if (!preset) return
    setForm((prev) => ({
      ...prev,
      host: preset.host,
      port: preset.port,
      secure: preset.secure,
    }))
    toast.success(`Definições de ${preset.label} aplicadas`)
  }

  const handleSave = async (e) => {
    e?.preventDefault?.()
    if (!form.host.trim()) {
      toast.error('O Servidor SMTP (Host) é obrigatório')
      return
    }
    if (!form.user.trim()) {
      toast.error('O Email / Utilizador SMTP é obrigatório')
      return
    }
    if (!form.pass.trim() && !hasStoredPassword) {
      toast.error('A Palavra-passe de aplicação é obrigatória')
      return
    }

    try {
      const payload = {
        host: form.host.trim(),
        port: Number(form.port) || 587,
        secure: Boolean(form.secure),
        user: form.user.trim().toLowerCase(),
        fromEmail: (form.fromEmail || form.user).trim().toLowerCase(),
        fromName: form.fromName.trim() || 'Construpreço',
        ...(form.pass.trim() ? { pass: form.pass.trim() } : {}),
      }

      await updateSmtp(payload).unwrap()
      setHasStoredPassword(true)
      setForm((prev) => ({ ...prev, pass: '' }))
      toast.success('Configurações de email (SMTP) guardadas com sucesso!')
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Erro ao guardar configurações SMTP'))
    }
  }

  const handleSendTest = async () => {
    const target = (testRecipient || form.user || '').trim().toLowerCase()
    if (!target) {
      toast.error('Introduza um email de destino para receber o teste')
      return
    }

    try {
      const res = await testSmtp({ toEmail: target }).unwrap()
      toast.success(res?.message || `Email de teste enviado com sucesso para ${target}!`)
      setShowTestInput(false)
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Falha no teste de envio de email'))
    }
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--active)_10%,white)] text-[var(--active)]">
              <FiMail className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide text-[var(--primary-text)] uppercase">
                Credenciais de Email (SMTP)
              </h3>
              <p className="text-xs text-[var(--secondary-text)]">
                Configuração para envio oficial de códigos de verificação (OTP) e notificações
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[var(--active)] hover:bg-[color-mix(in_srgb,var(--active)_8%,white)] transition"
          >
            <FiHelpCircle className="size-3.5" />
            Como configurar? (Guia)
          </button>
        </div>

        {/* Card Body */}
        <div className="space-y-5 p-5 sm:p-8">
          {/* Preset Buttons */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--secondary-text)]">
              Preenchimento Rápido de Servidor:
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('google')}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[var(--primary-text)] hover:border-[var(--active)] hover:text-[var(--active)] transition"
              >
                Google Workspace / Gmail
              </button>
              <button
                type="button"
                onClick={() => applyPreset('hostinger')}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[var(--primary-text)] hover:border-[var(--active)] hover:text-[var(--active)] transition"
              >
                Hostinger
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Servidor SMTP (Host)">
              <TextInput
                value={form.host}
                onChange={setField('host')}
                placeholder="ex.: smtp.gmail.com ou smtp.hostinger.com"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Porta">
                <TextInput
                  type="number"
                  value={form.port}
                  onChange={(val) => setField('port')(Number(val) || 587)}
                  placeholder="587 ou 465"
                  required
                />
              </Field>

              <Field label="Conexão Segura (SSL)">
                <div className="flex h-11 items-center">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--primary-text)]">
                    <input
                      type="checkbox"
                      checked={form.secure}
                      onChange={(e) => setField('secure')(e.target.checked)}
                      className="size-4 rounded border-gray-300 text-[var(--active)] focus:ring-[var(--active)]"
                    />
                    Ativar SSL/TLS
                  </label>
                </div>
              </Field>
            </div>

            <Field label="Email Oficial / Utilizador (User)">
              <TextInput
                type="email"
                value={form.user}
                onChange={setField('user')}
                placeholder="ex.: geral@construpreco.pt"
                required
              />
            </Field>

            <Field label="Palavra-passe de Aplicação (App Password)">
              <SecretInput
                value={form.pass}
                onChange={setField('pass')}
                placeholder={
                  hasStoredPassword
                    ? '•••••••••••••••• (Guardada. Deixe vazio para manter)'
                    : 'Cole aqui a chave de 16 caracteres'
                }
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-[var(--secondary-text)]">
                {hasStoredPassword ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <FiCheckCircle className="size-3" /> Palavra-passe configurada e encriptada com segurança.
                  </span>
                ) : (
                  'Chave de segurança de 16 letras gerada na Google ou password da Hostinger.'
                )}
              </p>
            </Field>

            <Field label="Nome do Remetente">
              <TextInput
                value={form.fromName}
                onChange={setField('fromName')}
                placeholder="Construpreço"
              />
            </Field>

            <Field label="Email de Envio (From Email - Opcional)">
              <TextInput
                type="email"
                value={form.fromEmail}
                onChange={setField('fromEmail')}
                placeholder="Mesmo que o utilizador (ex.: geral@construpreco.pt)"
              />
            </Field>
          </div>

          {/* Test connection section */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[var(--primary-text)]">
                  Verificar Envio de Emails
                </p>
                <p className="text-xs text-[var(--secondary-text)]">
                  Envie um email de teste automático para confirmar que os dados estão corretos.
                </p>
              </div>

              {!showTestInput ? (
                <button
                  type="button"
                  onClick={() => setShowTestInput(true)}
                  disabled={!hasStoredPassword && !form.pass.trim()}
                  className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--primary-text)] hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  <FiSend className="size-3" />
                  Testar Conexão
                </button>
              ) : null}
            </div>

            {showTestInput ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <input
                  type="email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="Email para onde enviar o teste..."
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
                />
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={isTesting}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--active)] px-4 py-1.5 text-xs font-semibold text-white hover:brightness-95 disabled:opacity-60 transition"
                >
                  <FiSend className="size-3" />
                  {isTesting ? 'A enviar...' : 'Enviar Teste'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTestInput(false)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
              </div>
            ) : null}
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-2">
            <PrimaryButton onClick={handleSave} loading={isSaving}>
              Guardar Credenciais SMTP
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* Guide Modal */}
      <SmtpGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  )
}
