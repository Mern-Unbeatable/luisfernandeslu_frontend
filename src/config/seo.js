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
  disputeResolution: {
    titleKey: 'seo.disputeResolutionTitle',
    descriptionKey: 'seo.disputeResolutionDescription',
  },
  buyerDashboard: {
    titleKey: 'seo.buyerDashboardTitle',
    descriptionKey: 'seo.buyerDashboardDescription',
  },
  buyerOrders: {
    titleKey: 'seo.buyerOrdersTitle',
    descriptionKey: 'seo.buyerOrdersDescription',
  },
  buyerProjects: {
    titleKey: 'seo.buyerProjectsTitle',
    descriptionKey: 'seo.buyerProjectsDescription',
  },
  buyerAccount: {
    titleKey: 'seo.buyerAccountTitle',
    descriptionKey: 'seo.buyerAccountDescription',
  },
  buyerAffiliates: {
    titleKey: 'seo.buyerAffiliatesTitle',
    descriptionKey: 'seo.buyerAffiliatesDescription',
  },
  buyerProductToReview: {
    titleKey: 'seo.buyerProductToReviewTitle',
    descriptionKey: 'seo.buyerProductToReviewDescription',
  },
  panel: {
    titleKey: 'seo.panelTitle',
    descriptionKey: 'seo.panelDescription',
  },
  login: {
    titleKey: 'seo.loginTitle',
    descriptionKey: 'seo.loginDescription',
  },
  signup: {
    titleKey: 'seo.signupTitle',
    descriptionKey: 'seo.signupDescription',
  },
  forgotPassword: {
    titleKey: 'seo.forgotPasswordTitle',
    descriptionKey: 'seo.forgotPasswordDescription',
  },
  notFound: {
    titleKey: 'seo.notFoundTitle',
    descriptionKey: 'seo.notFoundDescription',
    noIndex: true,
  },
}
