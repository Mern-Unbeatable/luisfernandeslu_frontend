import { useTranslation } from 'react-i18next'
import { HOME_STATS } from '../data/homeStats'

export default function HomeStatsBar() {
  const { t } = useTranslation()

  return (
    <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
      {HOME_STATS.map(({ id, Icon, value }) => (
        <li key={id} className="flex flex-col items-center text-center">
          <span className="mb-3 inline-flex size-14 items-center justify-center rounded-full bg-white text-[#F64C00] sm:size-16 shadow-lg">
            <Icon className="size-7 sm:size-8" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="text-xl font-bold text-(--primary-text) sm:text-2xl">
            {value}
          </p>
          <p className="mt-1 text-sm text-(--secondary-text)">
            {t(`home.stats.${id}`)}
          </p>
        </li>
      ))}
    </ul>
  )
}
