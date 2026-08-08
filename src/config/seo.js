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
  products: {
    titleKey: 'seo.productsTitle',
    descriptionKey: 'seo.productsDescription',
  },
  productDetail: {
    titleKey: 'seo.productDetailTitle',
    descriptionKey: 'seo.productDetailDescription',
  },
  userCheckout: {
    titleKey: 'seo.userCheckoutTitle',
    descriptionKey: 'seo.userCheckoutDescription',
  },
  companyCheckout: {
    titleKey: 'seo.companyCheckoutTitle',
    descriptionKey: 'seo.companyCheckoutDescription',
  },
  orderConfirmation: {
    titleKey: 'seo.orderConfirmationTitle',
    descriptionKey: 'seo.orderConfirmationDescription',
  },
  messages: {
    titleKey: 'seo.messagesTitle',
    descriptionKey: 'seo.messagesDescription',
  },
  cart: {
    titleKey: 'seo.cartTitle',
    descriptionKey: 'seo.cartDescription',
  },
  disputeResolution: {
    titleKey: 'seo.disputeResolutionTitle',
    descriptionKey: 'seo.disputeResolutionDescription',
  },
  returnPolicy: {
    titleKey: 'seo.returnPolicyTitle',
    descriptionKey: 'seo.returnPolicyDescription',
  },
  privacyPolicy: {
    titleKey: 'seo.privacyPolicyTitle',
    descriptionKey: 'seo.privacyPolicyDescription',
  },
  termsAndConditions: {
    titleKey: 'seo.termsTitle',
    descriptionKey: 'seo.termsDescription',
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
