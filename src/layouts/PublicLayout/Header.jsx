import { useEffect, useRef, useState } from 'react'
import Logo from '../../components/common/Logo/Logo'
import {
  FiSearch,
  FiGlobe,
  FiMessageSquare,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerBottom, setHeaderBottom] = useState(0)
  const headerRef = useRef(null)

  useEffect(() => {
    const updateHeaderBottom = () => {
      if (!headerRef.current) return
      setHeaderBottom(headerRef.current.getBoundingClientRect().bottom)
    }

    updateHeaderBottom()
    window.addEventListener('resize', updateHeaderBottom)
    window.addEventListener('scroll', updateHeaderBottom, { passive: true })

    return () => {
      window.removeEventListener('resize', updateHeaderBottom)
      window.removeEventListener('scroll', updateHeaderBottom)
    }
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header ref={headerRef} className="relative w-full sticky top-0 z-50">
      {/* Top bar — desktop only */}
      <div className="hidden md:block w-full bg-zinc-950 shadow-[inset_0px_-1px_0px_0px_rgba(255,255,255,0.16)]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10 xl:px-24">
          <p className="text-white text-sm font-normal leading-5 truncate">
            Welcome to construpreco online eCommerce store.
          </p>

          <div className="flex items-center justify-center gap-3 shrink-0">
            <span className="text-white text-sm font-normal leading-5">
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
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header — solid bar above overlay */}
      <div className="relative z-50 md:hidden w-full bg-[#FFFFFF]">
        <div className="flex items-center gap-2.5 px-4 py-6">
          <Logo className="shrink-0" />

          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-white px-3 py-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.06)] outline outline-1 outline-slate-200">
            <input
              type="search"
              placeholder="search product..."
              className="w-full min-w-0 bg-transparent text-sm text-slate-500 placeholder:text-slate-400 outline-none"
            />
            <FiSearch className="size-3.5 shrink-0 text-zinc-900" aria-hidden />
          </label>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="shrink-0 p-1 text-neutral-950"
          >
            {menuOpen ? (
              <FiX className="size-5" strokeWidth={2} />
            ) : (
              <FiMenu className="size-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block w-full bg-white border-b border-slate-100">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-10 xl:px-24">
          <Logo />

          <div className="flex flex-1 max-w-[640px] mx-4 lg:mx-8">
            <label className="flex w-full items-center gap-2 rounded-sm bg-white px-5 py-3.5 shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)] outline outline-1 outline-offset-[-1px] outline-slate-200 focus-within:outline-amber-500">
              <input
                type="search"
                placeholder="search product name......"
                className="w-full min-w-0 bg-transparent text-sm leading-5 text-slate-500 placeholder:text-slate-500 outline-none"
              />
              <FiSearch className="size-5 shrink-0 text-zinc-900" aria-hidden />
            </label>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-sm px-3 outline outline-1 outline-offset-[-1px] outline-gray-200 text-neutral-950 hover:bg-slate-50 transition-colors"
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
                  <Icon className="size-6" strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop — only below header */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-40 bg-black/30 transition-opacity duration-300 ease-out ${
          menuOpen
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: headerBottom }}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      {/* Dropdown — right side, items stacked vertically */}
      <div
        className={`md:hidden absolute right-3 top-full z-50 mt-1 w-44 origin-top-right transition-all duration-300 ease-out ${
          menuOpen
            ? 'translate-y-0 opacity-100 scale-100'
            : '-translate-y-2 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="flex flex-col py-1">
            {actionIcons.map(({ Icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-left text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <Icon className="size-5 shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
