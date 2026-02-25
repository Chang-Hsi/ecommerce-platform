"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileNavItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Pay" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--surface)] px-3 py-2 md:hidden">
      <div className="mx-auto grid w-full max-w-md grid-cols-4 gap-2">
        {mobileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-2 py-2 text-center text-xs font-semibold ${
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "bg-zinc-900 text-white"
                : "text-zinc-600"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
