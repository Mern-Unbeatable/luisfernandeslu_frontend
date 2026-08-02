/**
 * Shared SEO payloads for routes.
 * Usage in router: handle: { seo: routeSeo.home }
 * Dynamic pages can still render <Seo title={product.name} />
 */
export const routeSeo = {
  home: {
    title: 'Home',
    description:
      'CONSTRUPRECO — shop building materials online with fast delivery across Portugal.',
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
    noIndex: true,
  },
}
