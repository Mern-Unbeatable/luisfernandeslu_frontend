import LegalPolicyArticle from './LegalPolicyArticle'

const SECTION_ORDER = [
  'overview',
  'eligibility',
  'nonReturnable',
  'process',
  'approval',
  'refund',
  'shippingCosts',
]

export default function ReturnPolicyPage() {
  return (
    <LegalPolicyArticle pageKey="returnPolicyPage" sectionOrder={SECTION_ORDER} />
  )
}
