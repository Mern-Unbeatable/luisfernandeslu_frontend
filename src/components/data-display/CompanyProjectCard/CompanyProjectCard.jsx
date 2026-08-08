import { FiGlobe, FiMapPin } from 'react-icons/fi'

export default function CompanyProjectCard({
  project,
  onSelect,
  className = '',
}) {
  if (!project) return null

  return (
    <button
      type="button"
      onClick={() => onSelect?.(project)}
      className={`flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-colors hover:border-[var(--active)] ${className}`}
    >
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-base font-bold text-[var(--primary-text)] sm:text-lg">
          {project.name}
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-[var(--secondary-text)]">
          <FiMapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{project.address}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 border-t border-gray-100 bg-[#F9FAFB] px-5 py-3 text-sm text-[var(--secondary-text)] sm:px-6">
        <FiGlobe className="size-4 shrink-0" aria-hidden />
        <span>{project.categoryLabel}</span>
      </div>
    </button>
  )
}
