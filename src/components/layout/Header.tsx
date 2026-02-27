"use client";

import {
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { DropdownSelect } from "@/components/common/DropdownSelect";
import {
  headerNavSections,
  hotSearchKeywords,
  type HeaderMenuColumn,
  type HeaderMenuLink,
  type HeaderNavSection,
} from "@/content/header-menu";
import { resolveSafeRedirect } from "@/lib/auth/mock-auth";
import { useMockAuthSession } from "@/hooks/auth/useMockAuthSession";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getDerivedActiveMenuId(pathname: string, searchParams: URLSearchParams) {
  if (pathname === "/snkrs") {
    return "snkrs";
  }

  if (pathname.startsWith("/products")) {
    const gender = searchParams.get("gender");
    if (gender === "men" || gender === "women" || gender === "kids") {
      return gender;
    }

    if (searchParams.get("sale") === "true") {
      return "sale";
    }

    if (searchParams.get("group")) {
      return "new-featured";
    }
  }

  return null;
}

function sectionClass(sectionId: string, isHovered: boolean, activeMenuId: string | null) {
  const isCurrent = sectionId === activeMenuId;

  if (isHovered || isCurrent) {
    return "border-b-2 border-black pb-1 text-black";
  }

  return "pb-1 text-zinc-800 hover:text-black";
}

function getMobileQuickLinks(section: HeaderNavSection): HeaderMenuLink[] {
  const firstColumnLinks = section.columns[0]?.links ?? [];
  const preferred = ["新品發售", "暢銷商品"];
  const quickLinks = preferred
    .map((label) => firstColumnLinks.find((link) => link.label === label))
    .filter((link): link is HeaderMenuLink => Boolean(link));

  if (quickLinks.length > 0) {
    return quickLinks;
  }

  return firstColumnLinks.slice(0, 2);
}

const accountDropdownOptions = [
  { label: "訂單", value: "orders" },
  { label: "最愛", value: "favorites" },
  { label: "帳號設定", value: "settings" },
  { label: "登出", value: "logout" },
];

const promoSlides = [
  {
    title: "最高可享 7 折優惠",
    ctaLabel: "選購我們所有最新優惠商品",
    href: "/products?sale=true&page=1",
  },
  {
    title: "新品登場，立即探索本週焦點",
    ctaLabel: "前往新品和精選",
    href: "/products?group=new-featured&page=1",
  },
  {
    title: "會員專屬精選推薦",
    ctaLabel: "查看你可能喜歡的商品",
    href: "/products?sort=popular&page=1",
  },
] as const;

function buildReturnPath(pathname: string, searchParams: URLSearchParams) {
  if (pathname.startsWith("/login")) {
    return "/";
  }

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function SearchLayer({
  onClose,
}: Readonly<{
  onClose: () => void;
}>) {
  return (
    <div className="fixed inset-0 z-[70] bg-white">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-7 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" onClick={onClose} className="text-xl font-black italic tracking-tight text-black">
            SwooshLab
          </Link>
          <form action="/products" className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <MagnifyingGlassIcon className="h-5 w-5" aria-hidden />
            </span>
            <input
              autoFocus
              name="q"
              placeholder="搜尋"
              className="h-12 w-full rounded-full border border-zinc-200 bg-zinc-100 pl-10 pr-4 text-sm text-zinc-900 outline-none focus:border-zinc-500"
            />
            <input type="hidden" name="page" value="1" />
          </form>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-2 text-sm font-semibold text-zinc-700"
          >
            取消
          </button>
        </div>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500">熱門搜尋字詞</h2>
          <div className="flex flex-wrap gap-2">
            {hotSearchKeywords.map((keyword) => (
              <Link
                key={keyword}
                href={`/products?q=${encodeURIComponent(keyword)}&page=1`}
                onClick={onClose}
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

type MobileDrawerLevel = 0 | 1 | 2;

function MobileDrawer({
  open,
  onClose,
  loginHref,
  isAuthenticated,
  onSignOut,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  loginHref: string;
  isAuthenticated: boolean;
  onSignOut: () => void;
}>) {
  const [level, setLevel] = useState<MobileDrawerLevel>(0);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState<number | null>(null);

  const activeSection = useMemo(
    () => headerNavSections.find((section) => section.id === activeSectionId) ?? null,
    [activeSectionId],
  );

  const activeColumn = useMemo<HeaderMenuColumn | null>(() => {
    if (!activeSection || activeColumnIndex === null) {
      return null;
    }

    return activeSection.columns[activeColumnIndex] ?? null;
  }, [activeColumnIndex, activeSection]);

  const levelOneQuickLinks = useMemo(() => {
    if (!activeSection) {
      return [];
    }

    return getMobileQuickLinks(activeSection);
  }, [activeSection]);

  function closeAndReset() {
    setLevel(0);
    setActiveSectionId(null);
    setActiveColumnIndex(null);
    onClose();
  }

  function handleBack() {
    if (level === 2) {
      setLevel(1);
      setActiveColumnIndex(null);
      return;
    }

    if (level === 1) {
      setLevel(0);
      setActiveSectionId(null);
    }
  }

  function openSection(sectionId: string) {
    setActiveSectionId(sectionId);
    setActiveColumnIndex(null);
    setLevel(1);
  }

  function openColumn(columnIndex: number) {
    setActiveColumnIndex(columnIndex);
    setLevel(2);
  }

  const panelTransform = `translateX(-${level * 100}%)`;

  return (
    <div className={cn("fixed inset-0 z-[60] lg:hidden", !open && "pointer-events-none")}>
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-black/45 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        aria-label="關閉選單背景"
        onClick={closeAndReset}
      />

      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-[86%] max-w-[380px] flex-col bg-white shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 pb-2 pt-4">
          {level > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 rounded-full py-1 text-lg font-medium text-zinc-900"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden />
              <span>{level === 1 ? "全部" : activeSection?.label ?? "全部"}</span>
            </button>
          ) : (
            <span className="inline-block h-8 w-16" aria-hidden />
          )}

          <button
            type="button"
            onClick={closeAndReset}
            className="rounded-full p-1.5 text-zinc-700"
            aria-label="關閉選單"
          >
            <XMarkIcon className="h-7 w-7" aria-hidden />
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden px-6 pb-8">
          <div
            className="flex h-full w-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: panelTransform }}
          >
            <section className="h-full w-full shrink-0 overflow-y-auto pr-6">
              <nav className="space-y-2 pb-10 pt-4">
                {headerNavSections.map((section) => {
                  if (section.id === "snkrs") {
                    return (
                      <Link
                        key={section.id}
                        href={section.href}
                        onClick={closeAndReset}
                        className="flex items-center justify-between py-1.5 text-left text-[1.5rem] font-semibold leading-[1.2] text-zinc-900"
                      >
                        <span>{section.label}</span>
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => openSection(section.id)}
                      className="flex w-full items-center justify-between gap-6 py-1.5 text-left text-[1.5rem] font-semibold leading-[1.2] text-zinc-900"
                    >
                      <span>{section.label}</span>
                      <ChevronRightIcon className="h-4 w-4 shrink-0 text-zinc-700" aria-hidden />
                    </button>
                  );
                })}
              </nav>

              <div className="pb-8">
                <p className="mt-5 text-[1.0rem] leading-[1.45] text-zinc-500">
                  成為 SwooshLab 會員，體驗優質產品、獲得啟發並掌握運動界相關動態。瞭解更多資訊
                </p>

                {isAuthenticated ? (
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        onSignOut();
                        closeAndReset();
                      }}
                      className="rounded-full border border-zinc-300 px-5 py-2 text-base font-semibold text-zinc-900"
                    >
                      登出
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href="/join"
                      onClick={closeAndReset}
                      className="rounded-full bg-black px-5 py-2 text-base font-semibold text-white"
                    >
                      加入
                    </Link>
                    <Link
                      href={loginHref}
                      onClick={closeAndReset}
                      className="rounded-full border border-zinc-300 px-5 py-2 text-base font-semibold text-zinc-900"
                    >
                      登入
                    </Link>
                  </div>
                )}
              </div>

              <div className="space-y-4 pb-8 text-zinc-900">
                <Link
                  href="/help"
                  onClick={closeAndReset}
                  className="flex items-center gap-3 text-[1.2rem] font-semibold"
                >
                  <QuestionMarkCircleIcon className="h-6 w-6" aria-hidden />
                  協助
                </Link>
                <Link
                  href="/cart"
                  onClick={closeAndReset}
                  className="flex items-center gap-3 text-[1.2rem] font-semibold"
                >
                  <ShoppingBagIcon className="h-6 w-6" aria-hidden />
                  購物車
                </Link>
              </div>
            </section>

            <section className="h-full w-full shrink-0 overflow-y-auto pr-6">
              {activeSection ? (
                <div className="space-y-8 pb-10 pt-4">
                  <div>
                    <h2 className="text-[1.5rem] font-semibold leading-[1.25] text-zinc-900">
                      {activeSection.label}
                    </h2>
                  </div>

                  {levelOneQuickLinks.length > 0 ? (
                    <ul className="space-y-4">
                      {levelOneQuickLinks.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            onClick={closeAndReset}
                            className="text-[1.2rem] font-medium leading-[1.35] text-zinc-500"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <ul className="space-y-5">
                    {activeSection.columns.map((column, index) => (
                      <li key={column.title || column.links[0]?.label}>
                        <button
                          type="button"
                          onClick={() => openColumn(index)}
                          className="flex w-full items-center justify-between gap-6 text-left text-[1.2rem] font-medium leading-[1.3] text-zinc-600"
                        >
                          <span>{column.title}</span>
                          <ChevronRightIcon className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="h-full" />
              )}
            </section>

            <section className="h-full w-full shrink-0 overflow-y-auto pr-1">
              {activeColumn ? (
                <div className="space-y-8 pb-10 pt-4">
                  <h2 className="text-[1.5rem] font-semibold leading-[1.25] text-zinc-900">
                    {activeColumn.title}
                  </h2>

                  <ul className="space-y-4">
                    {activeColumn.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link
                          href={link.href}
                          onClick={closeAndReset}
                          className="text-[1.2rem] font-medium leading-[1.35] text-zinc-600"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="h-full" />
              )}
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { session, isAuthenticated, signOut } = useMockAuthSession();
  const headerContainerRef = useRef<HTMLDivElement | null>(null);

  const desktopCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileUnmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hoveredDesktopMenuId, setHoveredDesktopMenuId] = useState<string | null>(null);
  const [desktopMenuPanelId, setDesktopMenuPanelId] = useState<string | null>(null);
  const [isDesktopMenuVisible, setIsDesktopMenuVisible] = useState(false);

  const [lastClickedMenuId, setLastClickedMenuId] = useState<string | null>(null);
  const [isMobileDrawerMounted, setIsMobileDrawerMounted] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchLayerOpen, setIsSearchLayerOpen] = useState(false);
  const [promoSlideIndex, setPromoSlideIndex] = useState(0);
  const isProductsPage = pathname.startsWith("/products");

  const derivedActiveMenuId = useMemo(
    () => getDerivedActiveMenuId(pathname, new URLSearchParams(searchParams.toString())),
    [pathname, searchParams],
  );

  const currentActiveMenuId =
    derivedActiveMenuId ?? (pathname.startsWith("/products/") ? lastClickedMenuId : null);

  const activeDesktopSection = useMemo(
    () => headerNavSections.find((section) => section.id === desktopMenuPanelId) ?? null,
    [desktopMenuPanelId],
  );

  const loginHref = useMemo(() => {
    const returnPath = buildReturnPath(pathname, new URLSearchParams(searchParams.toString()));
    return `/login?redirect=${encodeURIComponent(resolveSafeRedirect(returnPath))}`;
  }, [pathname, searchParams]);

  function handleAccountAction(action: string) {
    switch (action) {
      case "orders":
        router.push("/orders");
        return;
      case "favorites":
        router.push("/favorites");
        return;
      case "settings":
        router.push("/profile/account");
        return;
      case "logout":
        signOut();
        return;
      default:
        router.push("/help");
    }
  }

  function clearDesktopCloseTimer() {
    if (desktopCloseTimerRef.current) {
      clearTimeout(desktopCloseTimerRef.current);
      desktopCloseTimerRef.current = null;
    }
  }

  function clearMobileUnmountTimer() {
    if (mobileUnmountTimerRef.current) {
      clearTimeout(mobileUnmountTimerRef.current);
      mobileUnmountTimerRef.current = null;
    }
  }

  function openDesktopMenu(sectionId: string) {
    clearDesktopCloseTimer();
    setHoveredDesktopMenuId(sectionId);
    setDesktopMenuPanelId(sectionId);
    setIsDesktopMenuVisible(true);
  }

  function keepDesktopMenuOpen() {
    clearDesktopCloseTimer();
    if (desktopMenuPanelId) {
      setIsDesktopMenuVisible(true);
    }
  }

  function scheduleDesktopMenuClose() {
    setHoveredDesktopMenuId(null);
    clearDesktopCloseTimer();
    setIsDesktopMenuVisible(false);
    desktopCloseTimerRef.current = setTimeout(() => {
      setDesktopMenuPanelId(null);
    }, 220);
  }

  function openMobileDrawer() {
    clearMobileUnmountTimer();
    setIsMobileDrawerMounted(true);
    requestAnimationFrame(() => {
      setIsMobileDrawerOpen(true);
    });
  }

  function closeMobileDrawer() {
    setIsMobileDrawerOpen(false);
    clearMobileUnmountTimer();
    mobileUnmountTimerRef.current = setTimeout(() => {
      setIsMobileDrawerMounted(false);
    }, 300);
  }

  useEffect(() => {
    return () => {
      clearDesktopCloseTimer();
      clearMobileUnmountTimer();
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (isMobileDrawerMounted || isSearchLayerOpen) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "";
  }, [isMobileDrawerMounted, isSearchLayerOpen]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPromoSlideIndex((current) => (current + 1) % promoSlides.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    function updateHeaderOffset() {
      const node = headerContainerRef.current;
      if (!node) {
        return;
      }

      const headerHeight = node.scrollHeight;
      document.documentElement.style.setProperty(
        "--storefront-header-offset",
        isProductsPage ? "0px" : `${headerHeight}px`,
      );
    }

    updateHeaderOffset();

    window.addEventListener("resize", updateHeaderOffset);

    return () => {
      window.removeEventListener("resize", updateHeaderOffset);
    };
  }, [isProductsPage]);

  return (
    <>
      <div
        ref={headerContainerRef}
        className={cn(
          "z-40",
          isProductsPage ? "relative" : "sticky top-0",
        )}
      >
        <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto hidden w-full max-w-6xl items-center justify-end gap-2 px-4 py-2 text-xs text-zinc-700 md:flex sm:px-6">
          <Link href="/help" className="hover:text-black">
            協助
          </Link>
          <span className="text-zinc-300">|</span>
          {isAuthenticated && session ? (
            <DropdownSelect
              triggerLabel={`Hi, ${session.name}`}
              value=""
              options={accountDropdownOptions}
              onChange={handleAccountAction}
              align="right"
              openOnHover
              highlightSelected={false}
              showCheckIcon={false}
              showChevron={false}
              triggerButtonClassName="rounded-none border-0 px-0 py-0 text-xs font-normal text-zinc-700 hover:text-black"
              panelClassName="min-w-[220px] rounded-none p-2"
            />
          ) : (
            <>
              <Link href="/join" className="hover:text-black">
                加入
              </Link>
              <span className="text-zinc-300">|</span>
              <Link href={loginHref} className="hover:text-black">
                登入
              </Link>
            </>
          )}
        </div>

        <div
          className="relative border-t border-[var(--border)]"
          onMouseLeave={scheduleDesktopMenuClose}
          onMouseEnter={keepDesktopMenuOpen}
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <Link href="/" className="text-xl font-black italic tracking-tight text-black">
              SwooshLab
            </Link>

            <nav className="hidden items-center gap-5 lg:flex">
              {headerNavSections.map((section) => (
                <Link
                  key={section.id}
                  href={section.href}
                  onMouseEnter={() => openDesktopMenu(section.id)}
                  onFocus={() => openDesktopMenu(section.id)}
                  onClick={() => setLastClickedMenuId(section.id)}
                  className={sectionClass(
                    section.id,
                    hoveredDesktopMenuId === section.id,
                    currentActiveMenuId,
                  )}
                >
                  {section.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <form action="/products" className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <MagnifyingGlassIcon className="h-4 w-4" aria-hidden />
                </span>
                <input
                  name="q"
                  placeholder="搜尋"
                  className="h-9 w-44 rounded-full border border-zinc-200 bg-zinc-100 pl-9 pr-4 text-sm outline-none focus:border-zinc-500"
                />
                <input type="hidden" name="page" value="1" />
              </form>

              <Link href="/favorites" className="rounded-full p-2 text-zinc-800 hover:bg-zinc-100">
                <HeartIcon className="h-5 w-5" aria-hidden />
              </Link>
              <Link href="/cart" className="rounded-full p-2 text-zinc-800 hover:bg-zinc-100">
                <ShoppingBagIcon className="h-5 w-5" aria-hidden />
              </Link>
            </div>

            <div className="flex items-center gap-1 lg:hidden">
              <button
                type="button"
                className="rounded-full p-2 text-zinc-800"
                onClick={() => setIsSearchLayerOpen(true)}
                aria-label="搜尋"
              >
                <MagnifyingGlassIcon className="h-6 w-6" aria-hidden />
              </button>
              <Link
                href={isAuthenticated ? "/profile/account" : loginHref}
                className="rounded-full p-2 text-zinc-800"
                aria-label={isAuthenticated ? "會員中心" : "登入"}
              >
                <UserIcon className="h-6 w-6" aria-hidden />
              </Link>
              <Link href="/cart" className="rounded-full p-2 text-zinc-800" aria-label="購物車">
                <ShoppingBagIcon className="h-6 w-6" aria-hidden />
              </Link>
              <button
                type="button"
                className="rounded-full p-2 text-zinc-800"
                onClick={openMobileDrawer}
                aria-label="開啟選單"
              >
                <Bars3Icon className="h-7 w-7" aria-hidden />
              </button>
            </div>
          </div>

          {activeDesktopSection ? (
            <div
              className={cn(
                "absolute left-0 right-0 top-full z-50 hidden border-t border-[var(--border)] bg-zinc-100 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block",
                isDesktopMenuVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none",
              )}
              onMouseEnter={keepDesktopMenuOpen}
              onMouseLeave={scheduleDesktopMenuClose}
            >
              <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-8">
                <div className="grid grid-cols-5 gap-10">
                  {activeDesktopSection.columns.map((column) => (
                    <section key={column.title || column.links[0]?.label}>
                      <h3 className="mb-3 text-sm font-semibold text-zinc-900">{column.title}</h3>
                      <ul className="space-y-2 text-sm text-zinc-600">
                        {column.links.map((link) => (
                          <li key={link.href + link.label}>
                            <Link href={link.href} className="hover:text-zinc-900">
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-[var(--border)] bg-zinc-100 px-4 py-2 text-center sm:px-6">
          <div className="relative overflow-hidden" aria-live="polite">
            <div key={promoSlideIndex} className="slide-right-in-c">
              <p className="text-xs text-zinc-900 md:text-base">{promoSlides[promoSlideIndex].title}</p>
              <Link
                href={promoSlides[promoSlideIndex].href}
                className="text-xs font-semibold text-zinc-900 underline md:text-sm"
              >
                {promoSlides[promoSlideIndex].ctaLabel}
              </Link>
            </div>
          </div>
        </div>
        </header>
      </div>

      {isMobileDrawerMounted ? (
        <MobileDrawer
          open={isMobileDrawerOpen}
          onClose={closeMobileDrawer}
          loginHref={loginHref}
          isAuthenticated={isAuthenticated}
          onSignOut={signOut}
        />
      ) : null}
      {isSearchLayerOpen ? <SearchLayer onClose={() => setIsSearchLayerOpen(false)} /> : null}
    </>
  );
}
