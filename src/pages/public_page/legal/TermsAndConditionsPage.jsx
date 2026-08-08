import LegalPolicyArticle from './LegalPolicyArticle'

const SECTION_ORDER = [
  'introduction',
  'useOfPlatform',
  'accounts',
  'productInformation',
  'ordersPayments',
  'deliveryLogistics',
  'returnsRefunds',
  'b2bCredit',
  'prohibitedActivities',
  'contact',
]

export default function TermsAndConditionsPage() {
  return (
    <LegalPolicyArticle
      pageKey="termsPage"
      sectionOrder={SECTION_ORDER}
    />
  )
}
