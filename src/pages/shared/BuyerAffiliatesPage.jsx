import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {
  FiUsers,
  FiLink,
  FiDollarSign,
  FiTrendingUp,
  FiCopy,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiShare2,
} from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'

export default function BuyerAffiliatesPage() {
  const { t } = useTranslation()
  const user = useSelector((state) => state.auth?.user)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const referralCode = user?.referralCode || ''
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://construpreco.pt'
  const shareLink = referralCode
    ? `${origin}/signup?ref=${encodeURIComponent(referralCode)}`
    : `${origin}/signup/affiliate`

  const handleCopy = async (text, type) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      if (type === 'link') {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
        toast.success(t('affiliateReferralChannels.copied', { defaultValue: 'Link copiado com sucesso!' }))
      } else {
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
        toast.success(t('affiliateReferralChannels.codeCopied', { defaultValue: 'Código copiado!' }))
      }
    } catch {
      toast.error(t('common.copyFailed', { defaultValue: 'Não foi possível copiar.' }))
    }
  }

  const isAffiliate = user?.role === 'AFFILIATE' || user?.role === 'affiliate'

  return (
    <>
      <Seo title={t('buyer.affiliates', { defaultValue: 'Programa de Afiliados' })} />

      <div className="space-y-6">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 p-6 text-white shadow-md sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm">
              <FiUsers className="size-3.5" />
              {t('buyer.affiliatesBadge', { defaultValue: 'Comissões & Parcerias' })}
            </span>
            <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {t('buyer.affiliatesHeroTitle', {
                defaultValue: 'Programa de Afiliados Construpreço',
              })}
            </h1>
            <p className="mt-2 text-sm text-white/90 sm:text-base">
              {t('buyer.affiliatesHeroSubtitle', {
                defaultValue:
                  'Recomende a Construpreço aos seus parceiros, construtores e amigos. Ganhe comissões automáticas em cada encomenda realizada.',
              })}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isAffiliate ? (
                <Link
                  to="/affiliate"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-amber-700 shadow transition hover:bg-amber-50"
                >
                  {t('buyer.affiliatesOpenDashboard', {
                    defaultValue: 'Abrir Painel de Afiliado',
                  })}
                  <FiArrowRight className="size-4" />
                </Link>
              ) : (
                <Link
                  to="/signup/affiliate"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-amber-700 shadow transition hover:bg-amber-50"
                >
                  {t('buyer.affiliatesJoinNow', {
                    defaultValue: 'Registar como Afiliado',
                  })}
                  <FiArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Referral Link & Code Section (if available) */}
        {referralCode ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-bold text-[var(--primary-text)]">
              {t('buyer.affiliatesYourLink', { defaultValue: 'O Seu Link Exclusivo de Recomendação' })}
            </h2>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              {t('buyer.affiliatesYourLinkDesc', {
                defaultValue: 'Partilhe este link com novos utilizadores para que as suas compras fiquem associadas à sua conta.',
              })}
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 font-mono text-sm text-[var(--primary-text)]">
                <span className="truncate block">{shareLink}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(shareLink, 'link')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--active)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 shrink-0"
              >
                {copiedLink ? (
                  <>
                    <FiCheck className="size-4 text-emerald-300" />
                    {t('common.copied', { defaultValue: 'Copiado!' })}
                  </>
                ) : (
                  <>
                    <FiCopy className="size-4" />
                    {t('buyer.affiliatesCopyLink', { defaultValue: 'Copiar Link' })}
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-[var(--secondary-text)]">
                  {t('buyer.affiliatesCodeLabel', { defaultValue: 'Código de Referência:' })}{' '}
                </span>
                <span className="font-mono font-bold text-[var(--primary-text)]">{referralCode}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(referralCode, 'code')}
                className="text-xs font-semibold text-[var(--active)] hover:underline inline-flex items-center gap-1"
              >
                {copiedCode ? (
                  <>
                    <FiCheck className="size-3 text-emerald-600" />
                    {t('common.copied', { defaultValue: 'Copiado' })}
                  </>
                ) : (
                  <>
                    <FiCopy className="size-3" />
                    {t('buyer.affiliatesCopyCode', { defaultValue: 'Copiar código' })}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null}

        {/* 3 Step Benefits Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FiShare2 className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-[var(--primary-text)]">
              {t('buyer.affiliateStep1Title', { defaultValue: '1. Partilhe o Seu Link' })}
            </h3>
            <p className="mt-1.5 text-sm text-[var(--secondary-text)]">
              {t('buyer.affiliateStep1Desc', {
                defaultValue:
                  'Divulgue o seu link nas suas redes, por email, WhatsApp ou diretamente a colegas de obra e clientes.',
              })}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiTrendingUp className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-[var(--primary-text)]">
              {t('buyer.affiliateStep2Title', { defaultValue: '2. Compras Realizadas' })}
            </h3>
            <p className="mt-1.5 text-sm text-[var(--secondary-text)]">
              {t('buyer.affiliateStep2Desc', {
                defaultValue:
                  'Quando os utilizadores referenciados se registam e adquirem materiais de construção, a encomenda é monitorizada.',
              })}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FiDollarSign className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-[var(--primary-text)]">
              {t('buyer.affiliateStep3Title', { defaultValue: '3. Receba Comissões' })}
            </h3>
            <p className="mt-1.5 text-sm text-[var(--secondary-text)]">
              {t('buyer.affiliateStep3Desc', {
                defaultValue:
                  'Ganhe comissões automáticas depositadas por transferência bancária (IBAN) com total transparência.',
              })}
            </p>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t('buyer.affiliatesFaqTitle', { defaultValue: 'Vantagens do Programa' })}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <FiShield className="size-5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[var(--primary-text)]">
                  {t('buyer.affiliateAdv1Title', { defaultValue: 'Comissões Transparentes' })}
                </h4>
                <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
                  {t('buyer.affiliateAdv1Desc', {
                    defaultValue: 'Percentagens claras por cada nível de vendas com relatórios em tempo real.',
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <FiLink className="size-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[var(--primary-text)]">
                  {t('buyer.affiliateAdv2Title', { defaultValue: 'Atribuição Automática' })}
                </h4>
                <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
                  {t('buyer.affiliateAdv2Desc', {
                    defaultValue: 'Cookies e códigos de referência duradouros que garantem a atribuição da venda.',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
