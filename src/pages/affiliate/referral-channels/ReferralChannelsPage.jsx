import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import {
  FiCheck,
  FiCopy,
  FiShare2,
  FiX,
} from 'react-icons/fi'
import { MdQrCode2 } from 'react-icons/md'

const PROMO_CODE = 'ALEX50'
const SHARE_LINK = `https://marketplace.platform.com/ref?code=${PROMO_CODE}`

function QrIcon({ className = 'size-5' }) {
  return <MdQrCode2 className={className} aria-hidden />
}

export default function ReferralChannelsPage() {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [shareHint, setShareHint] = useState('')

  useEffect(() => {
    if (!copied) return undefined
    const timer = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(timer)
  }, [copied])

  useEffect(() => {
    if (!shareHint) return undefined
    const timer = setTimeout(() => setShareHint(''), 2200)
    return () => clearTimeout(timer)
  }, [shareHint])

  useEffect(() => {
    if (!qrOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setQrOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [qrOpen])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const shareProposal = async () => {
    const payload = {
      title: t('affiliateReferralChannels.shareTitle'),
      text: t('affiliateReferralChannels.shareText', { code: PROMO_CODE }),
      url: SHARE_LINK,
    }

    try {
      if (navigator.share) {
        await navigator.share(payload)
        return
      }
      await navigator.clipboard.writeText(`${payload.text}\n${SHARE_LINK}`)
      setShareHint(t('affiliateReferralChannels.proposalLinkCopied'))
    } catch {
      // user cancelled share — ignore
    }
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(SHARE_LINK)}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          {t('affiliateReferralChannels.title')}
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t('affiliateReferralChannels.subtitle')}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-[var(--active)] uppercase">
            {t('affiliateReferralChannels.primaryChannel')}
          </span>
          <span className="inline-flex rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {t('affiliateReferralChannels.active')}
          </span>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t('affiliateReferralChannels.referralCodeTitle')}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
            {t('affiliateReferralChannels.referralCodeSubtitle')}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-[var(--secondary-text)] uppercase">
              {t('affiliateReferralChannels.promotionalCode')}
            </p>
            <p className="mt-1 text-3xl font-bold tracking-wide text-[var(--primary-text)]">
              {PROMO_CODE}
            </p>
          </div>

          <button
            type="button"
            onClick={copyCode}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2F3437] px-4 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {copied ? (
              <FiCheck className="size-4" aria-hidden />
            ) : (
              <FiCopy className="size-4" aria-hidden />
            )}
            {copied
              ? t('affiliateReferralChannels.copied')
              : t('affiliateReferralChannels.copy')}
          </button>
        </div>

        <div className="mt-5">
          <label
            htmlFor="direct-share-link"
            className="text-sm font-semibold text-[var(--primary-text)]"
          >
            {t('affiliateReferralChannels.directShareLink')}
          </label>
          <input
            id="direct-share-link"
            type="text"
            readOnly
            value={SHARE_LINK}
            onFocus={(event) => event.target.select()}
            className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={shareProposal}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[var(--primary-text)] transition hover:bg-gray-50"
        >
          <FiShare2 className="size-4" aria-hidden />
          {t('affiliateReferralChannels.shareProposal')}
        </button>

        <button
          type="button"
          onClick={() => setQrOpen(true)}
          aria-label={t('affiliateReferralChannels.showQrAria')}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-[var(--primary-text)] transition hover:bg-gray-50"
        >
          <QrIcon className="size-6" />
        </button>
      </div>

      {shareHint ? (
        <p className="text-sm font-medium text-[var(--active)]">{shareHint}</p>
      ) : null}

      {qrOpen
        ? createPortal(
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label={t('affiliateReferralChannels.qr.closeOverlay')}
                className="absolute inset-0 bg-black/45"
                onClick={() => setQrOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="referral-qr-title"
                className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2
                      id="referral-qr-title"
                      className="text-lg font-bold text-[var(--primary-text)]"
                    >
                      {t('affiliateReferralChannels.qr.title')}
                    </h2>
                    <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
                      {t('affiliateReferralChannels.qr.subtitle')}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={t('affiliateReferralChannels.qr.close')}
                    onClick={() => setQrOpen(false)}
                    className="rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100"
                  >
                    <FiX className="size-5" />
                  </button>
                </div>

                <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <img
                    src={qrSrc}
                    alt={t('affiliateReferralChannels.qr.alt', {
                      link: SHARE_LINK,
                    })}
                    className="size-[220px] rounded-lg bg-white p-2"
                  />
                  <p className="break-all text-center text-xs text-[var(--secondary-text)]">
                    {SHARE_LINK}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={shareProposal}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--active)] text-sm font-semibold text-white transition hover:brightness-95"
                >
                  <FiShare2 className="size-4" aria-hidden />
                  {t('affiliateReferralChannels.shareProposal')}
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
