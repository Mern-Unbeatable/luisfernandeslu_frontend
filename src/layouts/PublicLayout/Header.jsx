import Logo from '../../components/common/Logo/Logo'
import {
  FiSearch,
  FiGlobe,
  FiChevronDown,
  FiHeart,
  FiUser,
  FiShoppingBag,
} from 'react-icons/fi'

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[88px] flex items-center justify-between gap-8">
        <Logo />

        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-3 h-12 px-5 bg-white rounded-lg shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)] outline outline-1 outline-slate-200">
            <FiSearch className="w-5 h-5 text-zinc-900 shrink-0" />
            <input
              type="text"
              placeholder="search product name......"
              className="w-full bg-transparent text-sm text-slate-500 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2 h-11 px-2.5 rounded outline outline-1 outline-gray-200">
            <FiGlobe className="w-5 h-5 text-neutral-950" />
            <span className="text-neutral-950 text-base font-medium">English</span>
            <FiChevronDown className="w-4 h-4 text-neutral-950" />
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Wishlist"
              className="p-1 text-slate-800 hover:text-neutral-950 transition-colors"
            >
              <FiHeart className="w-7 h-7" />
            </button>
            <button
              type="button"
              aria-label="Account"
              className="p-1 text-slate-800 hover:text-neutral-950 transition-colors"
            >
              <FiUser className="w-7 h-7" />
            </button>
            <button
              type="button"
              aria-label="Cart"
              className="relative p-1 text-slate-800 hover:text-neutral-950 transition-colors"
            >
              <FiShoppingBag className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-amber-500 text-[10px] font-semibold text-white flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}