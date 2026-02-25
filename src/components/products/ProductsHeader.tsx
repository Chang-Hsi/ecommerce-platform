"use client";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { DropdownSelect } from "@/components/common/DropdownSelect";

type SortOption = {
  label: string;
  value: string;
};

type MobileCategoryLink = {
  label: string;
  href: string;
  category: string;
};

type ProductsHeaderProps = {
  title: string;
  resultCount: number;
  compact: boolean;
  activeCategory: string | null;
  mobileCategoryLinks: MobileCategoryLink[];
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
  onOpenMobileFilters: () => void;
  sortValue: string;
  sortOptions: SortOption[];
  onSortChange: (value: string) => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProductsHeader({
  title,
  resultCount,
  compact,
  activeCategory,
  mobileCategoryLinks,
  sidebarVisible,
  onToggleSidebar,
  onOpenMobileFilters,
  sortValue,
  sortOptions,
  onSortChange,
}: Readonly<ProductsHeaderProps>) {
  return (
    <section
      id="products-sticky-header"
      className={cn(
        "sticky top-[var(--storefront-header-offset,0px)] z-30 border-b border-zinc-200 bg-white transition-all duration-500",
        compact ? "lg:py-3" : "lg:py-5",
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="py-4 lg:hidden">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        </div>

        <nav className="-mx-4 overflow-x-auto border-y border-zinc-200 bg-white px-4 lg:hidden">
          <ul className="flex min-w-max items-center gap-8 py-3">
            {mobileCategoryLinks.map((item) => (
              <li key={item.category}>
                <Link
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap text-xl font-semibold transition-colors",
                    activeCategory === item.category ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-between border-b border-zinc-200 py-3 lg:hidden">
          <p className="text-lg text-zinc-600">{resultCount} 項結果</p>
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2 text-lg font-semibold text-zinc-900"
          >
            <span>篩選</span>
            <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="hidden items-center justify-between gap-3 lg:flex">
          <div className="min-w-0">
            <h1
              className={cn(
                "font-black tracking-tight text-zinc-900 transition-all duration-500",
                compact ? "text-2xl" : "text-3xl",
              )}
            >
              {title} ({resultCount})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900"
            >
              <span>{sidebarVisible ? "隱藏篩選條件" : "顯示篩選條件"}</span>
              <AdjustmentsHorizontalIcon className="h-4 w-4" aria-hidden />
            </button>

            <DropdownSelect
              triggerLabel="排序依據"
              value={sortValue}
              options={sortOptions}
              onChange={onSortChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
