import LegalPolicyArticle from './LegalPolicyArticle'

const SECTION_ORDER = [
  'introduction',
  'informationWeCollect',
  'howWeUse',
  'dataSecurity',
  'cookies',
  'dataSharing',
  'userRights',
  'dataRetention',
  'policyUpdates',
  'contact',
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPolicyArticle pageKey="privacyPolicyPage" sectionOrder={SECTION_ORDER} />
  )
}
