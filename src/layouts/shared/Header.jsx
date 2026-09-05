import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Logo from "../../components/common/Logo/Logo";
import LanguageSwitcher from "../../components/common/LanguageSwitcher/LanguageSwitcher";
import CategoryBar from "./CategoryBar";
import { getHomePathForRole } from "../../features/auth/demoUsers";
import { useAuthLogout } from "../../features/auth/useAuthLogout";
import { useGetCartQuery } from "../../features/cart/cartApi";
import { useGetChatThreadsQuery } from "../../features/chat/chatApi";
import { useGetSearchSuggestionsQuery } from "../../features/marketplace/marketplaceApi";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiMessageSquare,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiGrid,
  FiLogOut,
  FiTag,
  FiArrowRight,
  FiBox,
} from "react-icons/fi";
import {
  FaTwitter,
  FaFacebook,

  FaPinterest,
  FaRedditAlien,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

const socialLinks = [
  { Icon: FaTwitter, label: "Twitter" },
  { Icon: FaFacebook, label: "Facebook" },
  { Icon: FaPinterest, label: "Pinterest" },
  { Icon: FaRedditAlien, label: "Reddit" },
  { Icon: FaYoutube, label: "YouTube" },
  { Icon: FaInstagram, label: "Instagram" },
];

/**
 * Public site header.
 * Top promo bar is always visible.
 * Guest: search + SIGN UP / LOG IN.
 * Authenticated: account icon.
 */
export default function Header() {
  const { t } = useTranslation();
  const { logout: handleLogout, isLoggingOut } = useAuthLogout();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);

  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const shouldFetchSuggestions = debouncedQuery.length >= 1;
  const { data: suggestionsData, isFetching: isSuggestionsFetching } =
    useGetSearchSuggestionsQuery(debouncedQuery, {
      skip: !shouldFetchSuggestions,
    });

  const suggestions = suggestionsData || { products: [], categories: [] };
  const hasSuggestions =
    Boolean(suggestions?.products?.length || suggestions?.categories?.length);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(event.target)
      ) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSuggestionsOpen(false);
    const query = searchQuery.trim();
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else if (pathname === '/products') {
      navigate('/products');
    }
  };

  const handleSelectProduct = (productSlug) => {
    setIsSuggestionsOpen(false);
    navigate(`/products/${productSlug}`);
  };

  const handleSelectCategory = (cat) => {
    setIsSuggestionsOpen(false);
    navigate(`/products?search=${encodeURIComponent(cat.name)}`);
  };

  const isMessagesRoute =
    pathname === "/messages" || pathname.startsWith("/messages/");
  const isCartRoute = pathname === "/cart" || pathname.startsWith("/cart/");
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dashboardPath = getHomePathForRole(user?.role);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerBottom, setHeaderBottom] = useState(0);
  const headerRef = useRef(null);
  const searchInputRef = useRef(null);


  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const cartItemCount = cartData?.cart?.items?.length || 0;

  const { data: chatData } = useGetChatThreadsQuery(
    { userId: user?.id },
    { skip: !isAuthenticated || !user?.id, pollingInterval: 10000 },
  );
  const unreadChatCount =
    chatData?.chats?.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0) ||
    0;

  const onLogout = async () => {
    setMenuOpen(false);
    handleLogout();
  };

  useEffect(() => {
    const updateHeaderBottom = () => {
      if (!headerRef.current) return;
      setHeaderBottom(headerRef.current.getBoundingClientRect().bottom);
    };

    updateHeaderBottom();
    window.addEventListener("resize", updateHeaderBottom);
    window.addEventListener("scroll", updateHeaderBottom, { passive: true });

    return () => {
      window.removeEventListener("resize", updateHeaderBottom);
      window.removeEventListener("scroll", updateHeaderBottom);
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const id = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [searchOpen]);

  const utilityIcons = [
    { Icon: FiMessageSquare, key: "messages", to: "/messages", roles: ["company", "customer"] },
    { Icon: FiShoppingCart, key: "cart", to: "/cart", roles: ["customer", "company"] },
  ].filter(({ roles }) => !roles || roles.includes(user?.role));

  const closeSearch = () => setSearchOpen(false);

  const utilityIconClass = (key) => {
    if (key === "messages" && isMessagesRoute) return "text-[var(--active)]";
    if (key === "cart" && isCartRoute) return "text-[var(--active)]";
    return "text-[var(--primary-text)] transition-colors hover:text-[var(--active)]";
  };

  const utilityAriaCurrent = (key) => {
    if (key === "messages" && isMessagesRoute) return "page";
    if (key === "cart" && isCartRoute) return "page";
    return undefined;
  };

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 w-full shrink-0">
        {/* Mobile header */}
        <div className="relative z-50 w-full overflow-visible border-b border-gray-100 bg-white md:hidden">
          <div className="flex w-full items-center gap-2 px-3 py-3 sm:gap-2.5 sm:px-4">
            {/* Logo collapses with fixed max-width (animatable) */}
            <div
              className={`overflow-hidden transition-[max-width,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                searchOpen
                  ? "max-w-0 -translate-x-2 opacity-0"
                  : "max-w-[4.75rem] translate-x-0 opacity-100"
              }`}
            >
              <Logo className="shrink-0 [&_img]:h-8 [&_img]:w-auto" />
            </div>

            {/* Search expands via 0fr → 1fr (smooth width) */}
            <div
              ref={mobileSearchContainerRef}
              className="grid min-w-0 flex-1 transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] relative"
              style={{
                gridTemplateColumns: searchOpen ? "1fr" : "0fr",
              }}
            >
              <div className="min-w-0 overflow-hidden">
                <label
                  className={`flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 focus-within:border-[var(--active)] transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    searchOpen
                      ? "translate-x-0 opacity-100 delay-75"
                      : "translate-x-3 opacity-0"
                  }`}
                >
                  <FiSearch
                    className="size-4 shrink-0 text-[var(--secondary-text)]"
                    aria-hidden
                  />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSuggestionsOpen(true);
                    }}
                    onFocus={() => setIsSuggestionsOpen(true)}
                    placeholder={t("header.searchPlaceholderShort")}
                    tabIndex={searchOpen ? 0 : -1}
                    className="w-full min-w-0 bg-transparent text-sm text-[var(--secondary-text)] outline-none placeholder:text-gray-400"
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        closeSearch();
                        setIsSuggestionsOpen(false);
                      }
                      if (event.key === "Enter") {
                        handleSearchSubmit(event);
                        closeSearch();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      closeSearch();
                      setIsSuggestionsOpen(false);
                    }}
                    tabIndex={searchOpen ? 0 : -1}
                    className="shrink-0 rounded-full p-0.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-100 hover:text-[var(--primary-text)]"
                    aria-label={t("header.closeSearch")}
                  >
                    <FiX className="size-4" strokeWidth={2} />
                  </button>
                </label>
              </div>

              {/* Mobile Suggestions Dropdown */}
              {searchOpen && isSuggestionsOpen && searchQuery.trim().length >= 1 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[360px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-2xl">
                  {isSuggestionsFetching ? (
                    <div className="flex items-center justify-center gap-2 py-4 text-xs text-gray-500">
                      <div className="size-3.5 animate-spin rounded-full border-2 border-[var(--active)] border-t-transparent" />
                      <span>Loading...</span>
                    </div>
                  ) : hasSuggestions ? (
                    <div className="divide-y divide-gray-100">
                      {suggestions?.products?.length > 0 && (
                        <div className="pb-1.5">
                          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Products
                          </div>
                          {suggestions.products.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                handleSelectProduct(item.slug);
                                closeSearch();
                              }}
                              className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left hover:bg-gray-50 active:bg-gray-100"
                            >
                              <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-50 border border-gray-100">
                                {item.image ? (
                                  <img src={item.image} alt={item.title} className="size-full object-cover" />
                                ) : (
                                  <FiBox className="size-4 text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-gray-900">{item.title}</p>
                                <div className="flex items-center gap-1.5 text-[11px]">
                                  {item.category?.name && (
                                    <span className="truncate text-gray-500">{item.category.name}</span>
                                  )}
                                  <span className="font-bold text-[var(--active)]">${item.basePrice.toFixed(2)}</span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {suggestions?.categories?.length > 0 && (
                        <div className="py-1.5">
                          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Categories
                          </div>
                          {suggestions.categories.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                handleSelectCategory(cat);
                                closeSearch();
                              }}
                              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <FiTag className="size-3.5 text-gray-400" />
                                <span className="truncate">{cat.name}</span>
                              </span>
                              <FiArrowRight className="size-3 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="pt-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            handleSearchSubmit(e);
                            closeSearch();
                          }}
                          className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-center text-xs font-semibold text-[var(--active)] hover:bg-gray-50"
                        >
                          <span>See all results</span>
                          <FiArrowRight className="size-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>


            {/* Search toggle */}
            <button
              type="button"
              aria-label={t("header.search")}
              aria-expanded={searchOpen}
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen((open) => !open);
              }}
              className={`shrink-0 p-1.5 text-[var(--primary-text)] transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[var(--active)] ${
                searchOpen
                  ? "pointer-events-none absolute scale-75 opacity-0"
                  : "relative scale-100 opacity-100"
              }`}
            >
              <FiSearch className="size-5" strokeWidth={1.75} />
            </button>

            {/* Lang + menu — no max-width clip (was cutting the switcher) */}
            <div
              className={`flex shrink-0 items-center gap-2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                searchOpen
                  ? "pointer-events-none w-0 translate-x-2 overflow-hidden opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <LanguageSwitcher compact className="shrink-0" />

              <button
                type="button"
                aria-label={
                  menuOpen ? t("header.closeMenu") : t("header.openMenu")
                }
                aria-expanded={menuOpen}
                tabIndex={searchOpen ? -1 : 0}
                onClick={() => {
                  closeSearch();
                  setMenuOpen((open) => !open);
                }}
                className="shrink-0 p-1.5 text-[var(--primary-text)]"
              >
                {menuOpen ? (
                  <FiX className="size-5" strokeWidth={2} />
                ) : (
                  <FiMenu className="size-5" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden w-full border-b border-gray-100 bg-white md:block">
          <div className="container mx-auto flex w-full items-center justify-between gap-6 px-4 py-3.5">
            <Logo />

            <div
              ref={searchContainerRef}
              className="relative mx-4 flex max-w-[560px] flex-1 lg:mx-8"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="w-full"
              >
                <label className="flex w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 focus-within:border-[var(--active)]">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSuggestionsOpen(true);
                    }}
                    onFocus={() => setIsSuggestionsOpen(true)}
                    placeholder={t("header.searchPlaceholder")}
                    className="w-full min-w-0 bg-transparent text-sm leading-5 text-[var(--secondary-text)] outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    aria-label={t("header.search")}
                    className="shrink-0 p-0.5 text-[var(--secondary-text)] hover:text-[var(--active)] transition-colors cursor-pointer"
                  >
                    <FiSearch
                      className="size-5 shrink-0"
                      aria-hidden
                    />
                  </button>
                </label>
              </form>

              {/* Suggestions Dropdown */}
              {isSuggestionsOpen && searchQuery.trim().length >= 1 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-xl backdrop-blur-md">
                  {isSuggestionsFetching ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-6 text-xs text-gray-500">
                      <div className="size-4 animate-spin rounded-full border-2 border-[var(--active)] border-t-transparent" />
                      <span>Loading suggestions...</span>
                    </div>
                  ) : hasSuggestions ? (
                    <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100">
                      {/* Products Section */}
                      {suggestions?.products?.length > 0 && (
                        <div className="p-2">
                          <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Products
                          </div>
                          <div className="mt-1 space-y-0.5">
                            {suggestions.products.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelectProduct(item.slug)}
                                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-gray-50 group"
                              >
                                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="size-full object-cover"
                                    />
                                  ) : (
                                    <FiBox className="size-5 text-gray-400" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium text-gray-900 group-hover:text-[var(--active)]">
                                    {item.title}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    {item.category?.name && (
                                      <span className="truncate rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
                                        {item.category.name}
                                      </span>
                                    )}
                                    <span className="font-semibold text-[var(--active)]">
                                      ${item.basePrice.toFixed(2)}
                                      <span className="text-[10px] font-normal text-gray-400">
                                        /{item.unitOfMeasure}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <FiArrowRight className="size-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--active)]" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Categories Section */}
                      {suggestions?.categories?.length > 0 && (
                        <div className="p-2 bg-gray-50/50">
                          <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Categories
                          </div>
                          <div className="mt-1 space-y-0.5">
                            {suggestions.categories.map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleSelectCategory(cat)}
                                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-white hover:text-[var(--active)] group"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <FiTag className="size-4 shrink-0 text-gray-400 group-hover:text-[var(--active)]" />
                                  <span className="truncate font-medium">{cat.name}</span>
                                </div>
                                <span className="text-xs text-gray-400 group-hover:text-[var(--active)]">
                                  View category &rarr;
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* See all results link */}
                      <div className="p-2 bg-gray-50">
                        <button
                          type="button"
                          onClick={(e) => handleSearchSubmit(e)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-center text-xs font-semibold text-[var(--active)] transition-colors hover:bg-gray-100"
                        >
                          <span>See all results for &ldquo;{searchQuery.trim()}&rdquo;</span>
                          <FiArrowRight className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-500">
                      No results found for &ldquo;{searchQuery.trim()}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>


            <div className="flex shrink-0 items-center gap-5 lg:gap-6">
              <LanguageSwitcher />

              {utilityIcons.map(({ Icon, key, to }) =>
                to ? (
                  <Link
                    key={key}
                    to={to}
                    onClick={(e) => {
                      if (key === "messages" && !isAuthenticated) {
                        e.preventDefault();
                        toast.error(t("header.loginRequiredMessages", "Please log in to view messages"));
                      }
                    }}
                    aria-label={t(`header.${key}`)}
                    aria-current={utilityAriaCurrent(key)}
                    className={`relative ${utilityIconClass(key)}`}
                  >
                    <Icon className="size-6" strokeWidth={1.75} />
                    {key === "cart" && cartItemCount > 0 ? (
                      <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {cartItemCount}
                      </span>
                    ) : key === "messages" && unreadChatCount > 0 ? (
                      <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadChatCount}
                      </span>
                    ) : null}
                  </Link>
                ) : (
                  <button
                    key={key}
                    type="button"
                    aria-label={t(`header.${key}`)}
                    className={utilityIconClass(key)}
                  >
                    <Icon className="size-6" strokeWidth={1.75} />
                  </button>
                ),
              )}

              {isAuthenticated ? (
                <div className="group relative">
                  <button
                    type="button"
                    aria-label={t("header.account")}
                    aria-haspopup="menu"
                    className="flex items-center text-[var(--primary-text)] transition-colors hover:text-[var(--active)] group-hover:text-[var(--active)]"
                  >
                    <FiUser className="size-6" strokeWidth={1.75} />
                  </button>

                  <div className="invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div
                      role="menu"
                      className="min-w-[11rem] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                    >
                      <Link
                        to={dashboardPath}
                        role="menuitem"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--primary-text)] transition-colors hover:bg-gray-50 hover:text-[var(--active)]"
                      >
                        <FiGrid
                          className="size-4 shrink-0"
                          strokeWidth={1.75}
                        />
                        {t("header.dashboard")}
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={onLogout}
                        disabled={isLoggingOut}
                        aria-busy={isLoggingOut || undefined}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isLoggingOut ? (
                          <span
                            aria-hidden
                            className="inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-solid border-red-500 border-r-transparent"
                          />
                        ) : (
                          <FiLogOut
                            className="size-4 shrink-0"
                            strokeWidth={1.75}
                          />
                        )}
                        {t("header.logOut")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--active)] px-4 text-sm font-semibold tracking-wide text-white uppercase transition-opacity hover:opacity-90"
                  >
                    {t("header.signUp")}
                  </Link>
                  <Link
                    to="/login"
                    className="text-sm font-semibold tracking-wide text-[var(--active)] uppercase transition-opacity hover:opacity-80"
                  >
                    {t("header.logIn")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <CategoryBar />

        {/* Mobile overlay + menu */}
        <div
          className={`fixed inset-x-0 bottom-0 z-40 bg-black/30 transition-opacity duration-300 ease-out md:hidden ${
            menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={{ top: headerBottom }}
          aria-hidden={!menuOpen}
          onClick={() => setMenuOpen(false)}
        />

        <div
          className={`absolute top-full right-3 z-50 mt-1 w-52 origin-top-right transition-all duration-300 ease-out md:hidden ${
            menuOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="flex flex-col py-1">
              {utilityIcons.map(({ Icon, key, to }) =>
                to ? (
                  <Link
                    key={key}
                    to={to}
                    onClick={(e) => {
                      if (key === "messages" && !isAuthenticated) {
                        e.preventDefault();
                        toast.error(t("header.loginRequiredMessages", "Please log in to view messages"));
                        return;
                      }
                      setMenuOpen(false);
                    }}
                    aria-current={utilityAriaCurrent(key)}
                    className={`flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      (key === "messages" && isMessagesRoute) ||
                      (key === "cart" && isCartRoute)
                        ? "text-[var(--active)]"
                        : "text-[var(--primary-text)]"
                    }`}
                  >
                    <div className="relative">
                      <Icon className="size-5 shrink-0" strokeWidth={1.75} />
                      {key === "cart" && cartItemCount > 0 ? (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                          {cartItemCount}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-sm font-medium">
                      {t(`header.${key}`)}
                    </span>
                  </Link>
                ) : (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[var(--primary-text)] transition-colors hover:bg-gray-50"
                  >
                    <Icon className="size-5 shrink-0" strokeWidth={1.75} />
                    <span className="text-sm font-medium">
                      {t(`header.${key}`)}
                    </span>
                  </button>
                ),
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-left text-[var(--primary-text)] transition-colors hover:bg-gray-50"
                  >
                    <FiGrid className="size-5 shrink-0" strokeWidth={1.75} />
                    <span className="text-sm font-medium">
                      {t("header.dashboard")}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    aria-busy={isLoggingOut || undefined}
                    className="flex items-center gap-3 px-4 py-3 text-left text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoggingOut ? (
                      <span
                        aria-hidden
                        className="inline-block size-5 shrink-0 animate-spin rounded-full border-2 border-solid border-red-500 border-r-transparent"
                      />
                    ) : (
                      <FiLogOut
                        className="size-5 shrink-0"
                        strokeWidth={1.75}
                      />
                    )}
                    <span className="text-sm font-medium">
                      {t("header.logOut")}
                    </span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 border-t border-gray-100 px-3 py-3">
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--active)] text-sm font-semibold tracking-wide text-white uppercase"
                  >
                    {t("header.signUp")}
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex h-10 items-center justify-center text-sm font-semibold tracking-wide text-[var(--active)] uppercase"
                  >
                    {t("header.logIn")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
