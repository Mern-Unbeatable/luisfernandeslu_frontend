export default function Logo({ className = '' }) {
  return (
    <a
      href="/"
      className={`inline-flex flex-col items-start gap-0.5 shrink-0 ${className}`}
      aria-label="CONSTRUPRECO home"
    >
      <svg
        width="48"
        height="36"
        viewBox="0 0 48 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="text-amber-500"
      >
        <path
          d="M18.5 22.5V14.5C18.5 12.015 20.515 10 23 10H28C30.485 10 32.5 12.015 32.5 14.5V16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="14"
          y="16"
          width="20"
          height="12"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="24" cy="7" r="3.5" fill="currentColor" />
        <path
          d="M12 28H36"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[11px] sm:text-xs font-bold tracking-[0.04em] text-neutral-950 uppercase leading-none">
        CONSTRUPRECO
      </span>
    </a>
  )
}
