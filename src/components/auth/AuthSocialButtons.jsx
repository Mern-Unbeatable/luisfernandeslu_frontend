function GoogleIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  )
}

function FacebookIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
    >
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.32 20.06v-6.5h2.18l.33-2.54h-2.51v-1.62c0-.74.2-1.24 1.26-1.24h1.35V5.9c-.23-.03-1.04-.1-1.97-.1-1.95 0-3.29 1.19-3.29 3.38v1.89H8.68v2.54h2.19v6.5h2.45Z"
      />
    </svg>
  )
}

/** Google / Facebook auth buttons */
export default function AuthSocialButtons({
  googleLabel,
  facebookLabel,
  orLabel = 'Or',
}) {
  return (
    <>
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-sm text-[var(--secondary-text)]">{orLabel}</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-gray-50"
        >
          <GoogleIcon className="size-5 shrink-0" />
          {googleLabel}
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-gray-50"
        >
          <FacebookIcon className="size-5 shrink-0" />
          {facebookLabel}
        </button>
      </div>
    </>
  )
}
