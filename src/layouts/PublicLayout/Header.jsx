import Logo from '../../components/common/Logo/Logo'
import {
  FiSearch,
  FiGlobe,
  FiMessageSquare,
  FiShoppingCart,
  FiUser,
} from 'react-icons/fi'
import {
  FaTwitter,
  FaFacebook,
  FaPinterest,
  FaRedditAlien,
  FaYoutube,
  FaInstagram,
} from 'react-icons/fa'

const socialLinks = [
  { Icon: FaTwitter, label: 'Twitter' },
  { Icon: FaFacebook, label: 'Facebook' },
  { Icon: FaPinterest, label: 'Pinterest' },
  { Icon: FaRedditAlien, label: 'Reddit' },
  { Icon: FaYoutube, label: 'YouTube' },
  { Icon: FaInstagram, label: 'Instagram' },
]

const actionIcons = [
  { Icon: FiMessageSquare, label: 'Messages' },
  { Icon: FiShoppingCart, label: 'Cart' },
  { Icon: FiUser, label: 'Account' },
]

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top bar — Figma */}
      <div className="w-full bg-zinc-950 shadow-[inset_0px_-1px_0px_0px_rgba(255,255,255,0.16)]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10 xl:px-24">
          <p className="text-white text-sm font-normal leading-5 truncate">
            Welcome to construpreco online eCommerce store.
          </p>

          <div className="flex items-center justify-center gap-3 shrink-0">
            <span className="hidden sm:inline text-white text-sm font-normal leading-5">
              Follow us:
            </span>
            <div className="flex items-start gap-3">
              {socialLinks.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-white hover:text-amber-500 transition-colors"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="w-full bg-white border-b border-slate-100">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-10 xl:px-24">
          <Logo />

          <div className="hidden md:flex flex-1 max-w-[640px] mx-4 lg:mx-8">
            <label className="flex w-full items-center gap-2 rounded-sm bg-white px-5 py-3.5 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)] outline outline-1 outline-offset-[-1px] outline-slate-200 focus-within:outline-amber-500">
              <input
                type="search"
                placeholder="search product name......"
                className="w-full min-w-0 bg-transparent text-sm leading-5 text-slate-500 placeholder:text-slate-500 outline-none"
              />
              <FiSearch className="size-5 shrink-0 text-zinc-900" aria-hidden />
            </label>
          </div>

          <div className="flex items-center gap-6 lg:gap-9 shrink-0">
            <button
              type="button"
              className="hidden sm:inline-flex h-11 items-center gap-2 rounded-sm p-2.5 outline outline-1 outline-offset-[-1px] outline-gray-200 text-neutral-950 hover:bg-slate-50 transition-colors"
            >
              <FiGlobe className="size-5 shrink-0" aria-hidden />
              <span className="text-base font-medium">English</span>
            </button>

            <div className="flex items-center gap-6">
              {actionIcons.map(({ Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="text-slate-800 hover:text-neutral-950 transition-colors"
                >
                  <Icon className="size-7" strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:hidden px-4 pb-4">
          <label className="flex w-full items-center gap-2 rounded-sm bg-white px-4 py-3 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)] outline outline-1 outline-slate-200">
            <input
              type="search"
              placeholder="search product name......"
              className="w-full min-w-0 bg-transparent text-sm text-slate-500 placeholder:text-slate-500 outline-none"
            />
            <FiSearch className="size-5 shrink-0 text-zinc-900" aria-hidden />
          </label>
        </div>
      </div>
    </header>
  )
}
