import { FiChevronDown } from 'react-icons/fi';

const STATUS_STYLES = {
  produced: 'bg-sky-100 text-sky-700',
  'in-production':
    'bg-[color-mix(in_srgb,var(--active)_15%,transparent)] text-[var(--active)]',
  'in production':
    'bg-[color-mix(in_srgb,var(--active)_15%,transparent)] text-[var(--active)]',
  ready: 'bg-pink-100 text-pink-700',
  assigned: 'bg-gray-700 text-white',
  assign: 'bg-violet-100 text-violet-700',
  pending:
    'bg-[color-mix(in_srgb,var(--active)_15%,transparent)] text-[var(--active)]',
  cancel: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-emerald-100 text-emerald-700',
  new: 'bg-sky-100 text-sky-700',
  processing: 'bg-pink-100 text-pink-700',
  active: 'bg-emerald-100 text-emerald-700',
  disabled: 'bg-gray-100 text-gray-600',
  expired: 'bg-red-100 text-red-700',
  good: 'bg-emerald-100 text-emerald-700',
  low: 'bg-amber-100 text-amber-700',
  'out-of-stock': 'bg-red-100 text-red-700',
  'out of stock': 'bg-red-100 text-red-700',
  under_review: 'bg-amber-100 text-amber-700',
  'under review': 'bg-amber-100 text-amber-700',
  item_received: 'bg-emerald-100 text-emerald-700',
  'item received': 'bg-emerald-100 text-emerald-700',
  inspection_pass: 'bg-violet-100 text-violet-700',
  'inspection pass': 'bg-violet-100 text-violet-700',
  inspection_progress: 'bg-teal-100 text-teal-700',
  'inspection progress': 'bg-teal-100 text-teal-700',
  inspection_rejected: 'bg-red-100 text-red-700',
  'inspection rejected': 'bg-red-100 text-red-700',
  approved: 'bg-sky-100 text-sky-700',
  rejected: 'bg-red-100 text-red-700',
  default: 'bg-gray-100 text-[var(--secondary-text)]',
};

export default function StatusBadge({
  status,
  label,
  showChevron = false,
  className = '',
}) {
  const key = String(status || label || '')
    .trim()
    .toLowerCase();
  const styles = STATUS_STYLES[key] || STATUS_STYLES.default;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${styles} ${className}`}
    >
      {label || status}
      {showChevron ? (
        <FiChevronDown className='size-3.5 shrink-0 opacity-80' aria-hidden />
      ) : null}
    </span>
  );
}
