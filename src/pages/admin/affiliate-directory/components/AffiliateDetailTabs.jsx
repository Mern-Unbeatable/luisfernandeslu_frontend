import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs'

export default function AffiliateDetailTabs({ tabs, activeTab, onTabChange }) {
  return (
    <SegmentedTabs
      standalone
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  )
}
