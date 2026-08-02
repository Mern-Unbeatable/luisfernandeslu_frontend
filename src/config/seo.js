/**
 * Shared SEO payloads for routes (i18n keys).
 * Usage in router: handle: { seo: routeSeo.home }
 * Dynamic pages can still render <Seo title={product.name} />
 */
export const routeSeo = {
  home: {
    titleKey: 'seo.homeTitle',
    descriptionKey: 'seo.homeDescription',
  },
  message: {
    titleKey: 'seo.messageTitle',
    descriptionKey: 'seo.messageDescription',
  },
  notFound: {
    titleKey: 'seo.notFoundTitle',
    descriptionKey: 'seo.notFoundDescription',
    noIndex: true,
  },
}
