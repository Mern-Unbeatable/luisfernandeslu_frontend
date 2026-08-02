const siteName = 'CONSTRUPRECO'

export const appConfig = {
  name: siteName,
  titleTemplate: (pageTitle) =>
    pageTitle ? `${pageTitle} | ${siteName}` : siteName,
  defaultTitle: siteName,
  defaultDescription:
    'CONSTRUPRECO — the most complete building materials marketplace. Fast delivery and trusted suppliers.',
  defaultKeywords:
    'construpreco, building materials, ecommerce, construction, marketplace',
  twitterHandle: '@construpreco',
  locale: 'en',
}
