"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

const desktopNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

function navClass(pathname: string, href: string) {
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return isActive
    ? "rounded-full bg-black px-4 py-2 text-white"
    : "rounded-full px-4 py-2 text-zinc-600 hover:bg-zinc-200";
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-black uppercase tracking-[0.16em] text-black"
        >
          SwooshLab
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {desktopNavItems.map((item) => (
            <Link key={item.href} href={item.href} className={navClass(pathname, item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/products?sort=newest&page=1"
            className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700 hover:border-zinc-800"
          >
            Explore
          </Link>
          <Link
            href="/cart"
            className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            Cart
          </Link>
        </div>
      </div>
    </header>
  );
}
