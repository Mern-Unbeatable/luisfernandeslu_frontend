export default function BulkPricingTable({ tiers = [] }) {
  if (!tiers.length) return null

  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left">
            <th className="px-4 py-2.5 font-semibold text-[var(--primary-text)]">
              Buy
            </th>
            <th className="px-4 py-2.5 font-semibold text-[var(--primary-text)]">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, index) => (
            <tr
              key={`${tier.range}-${index}`}
              className={`border-b border-gray-100 last:border-0 ${
                index % 2 === 1 ? 'bg-gray-50/70' : 'bg-white'
              }`}
            >
              <td className="px-4 py-2.5 text-[var(--secondary-text)]">
                {tier.range}
              </td>
              <td className="px-4 py-2.5 text-[var(--secondary-text)]">
                {tier.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
