import { useState } from 'react'
import {
  FiCheckCircle,
  FiExternalLink,
  FiHelpCircle,
  FiInfo,
  FiMail,
  FiShield,
  FiX,
} from 'react-icons/fi'

export default function SmtpGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('google')

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--active)_12%,white)] text-[var(--active)]">
              <FiMail className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--primary-text)]">
                Guia de Configuração de Email (SMTP)
              </h2>
              <p className="text-xs text-[var(--secondary-text)]">
                Como configurar o envio oficial de emails do marketplace
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Fechar"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === 'google'
                ? 'border-[var(--active)] text-[var(--active)]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Google Workspace / Gmail
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hostinger')}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === 'hostinger'
                ? 'border-[var(--active)] text-[var(--active)]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Hostinger
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
              activeTab === 'faq'
                ? 'border-[var(--active)] text-[var(--active)]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Para que serve o SMTP?
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-[var(--primary-text)]">
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 flex items-start gap-3">
                <FiShield className="size-4 shrink-0 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-semibold">Segurança reforçada com Google App Password</p>
                  <p className="mt-0.5 text-blue-800 leading-relaxed">
                    A Google não permite usar a palavra-passe principal do Gmail em aplicações externas. Em vez disso, deve gerar uma <strong>Palavra-passe de aplicação (16 caracteres)</strong> exclusiva para o marketplace.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-sm text-[var(--primary-text)]">
                Passo a passo para gerar a chave:
              </h3>

              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--active)] text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <p className="font-semibold">Aceda à segurança da conta Google</p>
                    <p className="text-xs text-[var(--secondary-text)]">
                      Inicie sessão na sua conta e abra{' '}
                      <a
                        href="https://myaccount.google.com/security"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[var(--active)] underline"
                      >
                        myaccount.google.com/security <FiExternalLink className="size-3" />
                      </a>
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--active)] text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <p className="font-semibold">Ative a Verificação em dois passos (2FA)</p>
                    <p className="text-xs text-[var(--secondary-text)]">
                      A opção de palavras-passe de aplicações só fica visível se a verificação em dois passos estiver ligada.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--active)] text-xs font-bold text-white">
                    3
                  </span>
                  <div>
                    <p className="font-semibold">Crie uma Palavra-passe de aplicação</p>
                    <p className="text-xs text-[var(--secondary-text)]">
                      Pesquise por &quot;Palavras-passe de aplicações&quot; ou aceda a{' '}
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[var(--active)] underline"
                      >
                        myaccount.google.com/apppasswords <FiExternalLink className="size-3" />
                      </a>
                      . Dê o nome &quot;Construpreço&quot; e clique em Criar.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--active)] text-xs font-bold text-white">
                    4
                  </span>
                  <div>
                    <p className="font-semibold">Copie o código de 16 caracteres</p>
                    <p className="text-xs text-[var(--secondary-text)]">
                      A Google exibirá um código como <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono font-bold text-amber-900">xxxx xxxx xxxx xxxx</code>. Copie-o e cole no campo &quot;Palavra-passe de aplicação&quot; desta página.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-1.5 text-xs text-[var(--secondary-text)]">
                <p className="font-bold text-[var(--primary-text)]">Valores recomendados para Google:</p>
                <p>• <strong>Servidor SMTP (Host):</strong> <code className="font-mono">smtp.gmail.com</code></p>
                <p>• <strong>Porta:</strong> <code className="font-mono">587</code> (com TLS) ou <code className="font-mono">465</code> (com SSL)</p>
                <p>• <strong>Email / Utilizador:</strong> o seu email completo da Google</p>
              </div>

              {/* Final Steps explanation */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 space-y-1 text-xs text-emerald-950">
                <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <FiCheckCircle className="size-4 text-emerald-600 shrink-0" />
                  Como guardar e testar no perfil:
                </p>
                <p><strong>1. Guardar:</strong> Preencha os campos e clique no botão verde <strong>&quot;Guardar Credenciais SMTP&quot;</strong>.</p>
                <p><strong>2. Testar:</strong> Clique em <strong>&quot;Testar Conexão&quot;</strong>, digite o seu email pessoal e confirme que recebe o email de teste.</p>
              </div>
            </div>
          )}

          {activeTab === 'hostinger' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-4 text-xs text-purple-900 flex items-start gap-3">
                <FiInfo className="size-4 shrink-0 mt-0.5 text-purple-600" />
                <div>
                  <p className="font-semibold">Email corporativo da Hostinger (@construpreco.pt)</p>
                  <p className="mt-0.5 text-purple-800 leading-relaxed">
                    Se a caixa de correio está alojada na Hostinger, utilize as credenciais SMTP diretas do hPanel.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-sm text-[var(--primary-text)]">
                Passo a passo na Hostinger:
              </h3>

              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <p className="font-semibold">Aceda ao hPanel da Hostinger</p>
                    <p className="text-xs text-[var(--secondary-text)]">
                      Entre em <a href="https://hpanel.hostinger.com" target="_blank" rel="noreferrer" className="underline font-semibold">hpanel.hostinger.com</a> e abra a secção <strong>Emails</strong>.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <p className="font-semibold">Verifique a conta de envio</p>
                    <p className="text-xs text-[var(--secondary-text)]">
                      Certifique-se de que a conta de correio (ex.: <code className="font-mono">geral@construpreco.pt</code>) está ativa.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                    3
                  </span>
                  <div>
                    <p className="font-semibold">Preencha os dados SMTP:</p>
                    <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-1 text-xs">
                      <p>• <strong>Servidor SMTP (Host):</strong> <code className="font-mono font-bold">smtp.hostinger.com</code></p>
                      <p>• <strong>Porta:</strong> <code className="font-mono font-bold">465</code></p>
                      <p>• <strong>Conexão Segura (SSL):</strong> Ativa</p>
                      <p>• <strong>Palavra-passe:</strong> A password dessa caixa de correio</p>
                    </div>
                  </div>
                </li>
              </ol>

              {/* Final Steps explanation */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 space-y-1 text-xs text-emerald-950">
                <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <FiCheckCircle className="size-4 text-emerald-600 shrink-0" />
                  Como guardar e testar no perfil:
                </p>
                <p><strong>1. Guardar:</strong> Preencha os campos e clique no botão verde <strong>&quot;Guardar Credenciais SMTP&quot;</strong>.</p>
                <p><strong>2. Testar:</strong> Clique em <strong>&quot;Testar Conexão&quot;</strong>, digite o seu email pessoal e confirme que recebe o email de teste.</p>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                  <h4 className="flex items-center gap-2 font-bold text-sm text-[var(--primary-text)]">
                    <FiCheckCircle className="text-emerald-600 size-4" />
                    Para que serve o SMTP na plataforma?
                  </h4>
                  <p className="mt-1.5 text-xs text-[var(--secondary-text)] leading-relaxed">
                    O SMTP (Simple Mail Transfer Protocol) é o motor responsável pelo envio de todos os emails automáticos transacionais do marketplace. Sem ele configurado, o sistema não consegue entregar mensagens aos utilizadores.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                  <h4 className="flex items-center gap-2 font-bold text-sm text-[var(--primary-text)]">
                    <FiCheckCircle className="text-emerald-600 size-4" />
                    Onde são enviados os emails?
                  </h4>
                  <ul className="mt-1.5 space-y-1 text-xs text-[var(--secondary-text)] list-disc pl-5">
                    <li><strong>Códigos de verificação (OTP):</strong> enviados no registo de novas contas de clientes, empresas, fábricas e transportadores.</li>
                    <li><strong>Recuperação de palavra-passe:</strong> envio de códigos de redefinição de segurança.</li>
                    <li><strong>Confirmação de encomendas:</strong> alertas imediatos de novas compras e pagamentos.</li>
                    <li><strong>Atribuição de entregas:</strong> envio do código de 4 dígitos de entrega aos transportadores.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                  <h4 className="flex items-center gap-2 font-bold text-sm text-[var(--primary-text)]">
                    <FiCheckCircle className="text-emerald-600 size-4" />
                    Por que usar o email oficial em vez de um email pessoal?
                  </h4>
                  <p className="mt-1.5 text-xs text-[var(--secondary-text)] leading-relaxed">
                    Ao utilizar o seu domínio oficial (<code className="font-mono">@construpreco.pt</code>), os emails transmitem total confiança aos seus clientes e parceiros, evitam que as mensagens caiam na pasta de Spam e impedem que apareçam endereços de programadores como remetente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[var(--active)] px-5 py-2.5 text-xs font-semibold text-white hover:brightness-95 transition"
          >
            Entendido, fechar guia
          </button>
        </div>
      </div>
    </div>
  )
}

