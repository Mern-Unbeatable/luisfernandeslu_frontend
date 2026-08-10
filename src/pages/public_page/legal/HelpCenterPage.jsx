import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  FiCreditCard,
  FiMail,
  FiMessageCircle,
  FiPackage,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiSmile,
  FiTruck,
} from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'

const SECTION_ORDER = [
  'search',
  'orders',
  'payments',
  'returns',
  'delivery',
  'contact',
]

const SECTION_ICONS = {
  search: FiSearch,
  orders: FiPackage,
  payments: FiCreditCard,
  returns: FiRefreshCw,
  delivery: FiTruck,
  contact: FiPhone,
}

const ITEM_ICONS = {
  mail: FiMail,
  chat: FiMessageCircle,
  phone: FiPhone,
}

function IconBadge({ icon: Icon }) {
  if (!Icon) return null
  return (
    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--active)_12%,white)] text-[var(--active)]">
      <Icon className="size-[18px]" strokeWidth={2} aria-hidden />
    </span>
  )
}

function HelpSection({ pageKey, sectionKey }) {
  const { t } = useTranslation()
  const base = `${pageKey}.sections.${sectionKey}`
  const items = t(`${base}.items`, { returnObjects: true, defaultValue: [] })
  const description = t(`${base}.description`, { defaultValue: '' })
  const SectionIcon = SECTION_ICONS[sectionKey]
  const isContact = sectionKey === 'contact'

  const renderLink = (label, href) => {
    const className =
      'text-[var(--primary-text)] underline-offset-2 hover:text-[var(--active)] hover:underline'

    if (href?.startsWith('/')) {
      return (
        <Link to={href} className={className}>
          {label}
        </Link>
      )
    }

    if (href) {
      return (
        <a href={href} className={className}>
          {label}
        </a>
      )
    }

    return label
  }

  return (
    <section className="border-t border-gray-100 pt-8 first:border-t-0 first:pt-0">
      <h2 className="flex items-center gap-2.5 text-lg font-bold text-[var(--primary-text)] sm:text-xl">
        <IconBadge icon={SectionIcon} />
        {t(`${base}.title`)}
      </h2>

      {description ? (
        <p className="mt-3 text-base leading-relaxed text-[var(--primary-text)]">
          {description}
        </p>
      ) : null}

      {Array.isArray(items) && items.length > 0 ? (
        <ul
          className={
            isContact
              ? 'mt-4 space-y-3'
              : 'mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--primary-text)]'
          }
        >
          {items.map((item) => {
            const label = typeof item === 'string' ? item : item.label
            const href = typeof item === 'object' ? item.href : null
            const iconKey = typeof item === 'object' ? item.icon : null
            const ItemIcon = iconKey ? ITEM_ICONS[iconKey] : null

            if (isContact && ItemIcon) {
              return (
                <li key={label} className="flex items-start gap-3">
                  <ItemIcon
                    className="mt-0.5 size-[18px] shrink-0 text-[var(--active)]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="text-base leading-relaxed text-[var(--primary-text)]">
                    {renderLink(label, href)}
                  </span>
                </li>
              )
            }

            return (
              <li key={label}>
                {renderLink(label, href)}
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}

export default function HelpCenterPage() {
  const { t } = useTranslation()
  const pageKey = 'helpCenterPage'

  return (
    <div className="w-full bg-white py-10 sm:py-12 lg:py-14">
      <Seo
        title={t(`${pageKey}.seoTitle`)}
        description={t(`${pageKey}.seoDescription`)}
      />

      <div className="container mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-3xl lg:text-4xl">
            {t(`${pageKey}.title`)}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-sm text-[var(--secondary-text)]">
            <span
              className="size-2 shrink-0 rounded-full bg-[var(--active)]"
              aria-hidden
            />
            {t(`${pageKey}.lastUpdated`)}
          </p>
        </header>

        <div className="mt-8">
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-[var(--primary-text)] sm:text-xl">
            <IconBadge icon={FiSmile} />
            {t(`${pageKey}.welcomeTitle`)}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--primary-text)]">
            {t(`${pageKey}.welcomeBody`)}
          </p>
        </div>

        <article className="mt-10 space-y-8">
          {SECTION_ORDER.map((key) => (
            <HelpSection key={key} pageKey={pageKey} sectionKey={key} />
          ))}
        </article>
      </div>
    </div>
  )
}
