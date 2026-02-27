"use client";

import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMockAuthSession } from "@/hooks/auth/useMockAuthSession";

function getFooterGroups(isAuthenticated: boolean) {
  const resourcesLinks = [
    { label: "新品和精選", href: "/products?group=new-featured&page=1" },
    { label: "收藏", href: "/favorites" },
    { label: "購物車", href: "/cart" },
  ];

  if (!isAuthenticated) {
    resourcesLinks.unshift({ label: "加入會員", href: "/login" });
  }

  return [
    {
      title: "資源",
      links: resourcesLinks,
    },
    {
      title: "協助",
      links: [
        { label: "取得協助", href: "/help" },
        { label: "出貨與寄送", href: "/help/topics/shipping-delivery" },
        { label: "退貨", href: "/help/topics/returns" },
        { label: "付款選項", href: "/help/topics/orders-payment" },
        { label: "聯絡我們", href: "/help/contact" },
      ],
    },
    {
      title: "公司",
      links: [{ label: "關於 SwooshLab", href: "/help/topics/company-info" }],
    },
  ] as const;
}

export function Footer() {
  const { isAuthenticated } = useMockAuthSession();
  const footerGroups = getFooterGroups(isAuthenticated);

  return (
    <footer className="mt-10 border-t border-[var(--border)]">
      <div className="bg-zinc-100 px-4 py-10 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h2 className="text-base font-semibold text-zinc-900">{group.title}</h2>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 text-sm text-zinc-700">
            <GlobeAltIcon className="h-4 w-4" aria-hidden />
            <span>台灣</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 text-xs text-zinc-500">
          <p>2026 SwooshLab Demo Storefront</p>
          <Link href="/admin" className="font-semibold text-zinc-700 hover:text-black">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
