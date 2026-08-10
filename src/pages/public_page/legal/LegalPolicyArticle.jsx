import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'

function PolicyList({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null

  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--primary-text)]">
      {items.map((item, index) => (
        <li key={`${index}-${item.slice(0, 24)}`}>{item}</li>
      ))}
    </ul>
  )
}

function PolicySection({ pageKey, sectionKey }) {
  const { t } = useTranslation()
  const base = `${pageKey}.sections.${sectionKey}`
  const paragraphs = t(`${base}.paragraphs`, { returnObjects: true, defaultValue: [] })
  const blocks = t(`${base}.blocks`, { returnObjects: true, defaultValue: [] })

  return (
    <section className="border-t border-gray-100 pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-lg font-bold text-[var(--primary-text)] sm:text-xl">
        {t(`${base}.title`)}
      </h2>

      {Array.isArray(paragraphs)
        ? paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-3 text-base leading-relaxed text-[var(--primary-text)]"
            >
              {paragraph}
            </p>
          ))
        : null}

      {Array.isArray(blocks)
        ? blocks.map((block, index) => (
            <div
              key={block.heading || `block-${index}`}
              className="mt-4"
            >
              {block.heading ? (
                <p className="text-base font-semibold text-[var(--primary-text)]">
                  {block.heading}
                </p>
              ) : null}
              <PolicyList items={block.items} />
            </div>
          ))
        : null}
    </section>
  )
}

export default function LegalPolicyArticle({ pageKey, sectionOrder }) {
  const { t } = useTranslation()

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

        <article className="mt-10 space-y-8">
          {sectionOrder.map((key) => (
            <PolicySection key={key} pageKey={pageKey} sectionKey={key} />
          ))}
        </article>
      </div>
    </div>
  )
}
