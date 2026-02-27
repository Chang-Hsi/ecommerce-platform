"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ProductsHeader } from "@/components/products/ProductsHeader";
import { ProductsFiltersPanel } from "@/components/products/ProductsFiltersPanel";
import { ProductsGrid } from "@/components/products/ProductsGrid";
import { useProductsController } from "@/hooks/products/useProductsController";

type ProductsViewProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProductsView({ searchParams }: Readonly<ProductsViewProps>) {
  const {
    products,
    productsSortOptions,
    productsQuickCategoryLinks,
    mobileCategoryLinks,
    pageTitle,
    queryState,
    isSidebarVisible,
    isCompactHeader,
    isMobileFilterOpen,
    desktopSidebarTop,
    setIsSidebarVisible,
    setIsMobileFilterOpen,
    handleSortChange,
    handleMobileSortChange,
    toggleFilter,
    toggleColor,
    buildCategoryHref,
  } = useProductsController({ searchParams });

  const selectedFilters = {
    gender: queryState.gender,
    kids: queryState.kids,
    price: queryState.price,
    brand: queryState.brand,
    sport: queryState.sport,
    fit: queryState.fit,
    feature: queryState.feature,
    tech: queryState.tech,
  };

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen bg-[var(--background)]">
      <ProductsHeader
        title={pageTitle}
        resultCount={products.length}
        compact={isCompactHeader}
        activeCategory={queryState.category}
        mobileCategoryLinks={mobileCategoryLinks}
        sidebarVisible={isSidebarVisible}
        onToggleSidebar={() => setIsSidebarVisible((visible) => !visible)}
        onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
        sortValue={queryState.sort}
        sortOptions={productsSortOptions}
        onSortChange={handleSortChange}
      />

      <div className="px-4 py-4 sm:px-6 lg:px-10">
        <div className={cn(isSidebarVisible ? "lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-8" : "lg:block")}>
          {isSidebarVisible ? (
            <aside
              className="hidden lg:sticky lg:block lg:self-start lg:overflow-y-auto lg:pr-2"
              style={{
                top: `${desktopSidebarTop}px`,
                maxHeight: `calc(100vh - ${desktopSidebarTop + 16}px)`,
              }}
            >
              <nav className="space-y-3 py-4 text-base font-medium text-zinc-900">
                {productsQuickCategoryLinks.map((item) => (
                  <Link key={item.category} href={buildCategoryHref(item.category)} className="block hover:underline">
                    {item.label}
                  </Link>
                ))}
              </nav>

              <ProductsFiltersPanel
                textSizeClass="text-base"
                selectedFilters={selectedFilters}
                onToggleFilter={toggleFilter}
                selectedColors={queryState.colors}
                onToggleColor={toggleColor}
              />
            </aside>
          ) : null}

          <main className="min-w-0">
            <ProductsGrid products={products} />
          </main>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 lg:hidden",
          isMobileFilterOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsMobileFilterOpen(false)}
        aria-hidden
      />

      <section
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 h-[100dvh] bg-white transition-transform duration-500 ease-out lg:hidden",
          isMobileFilterOpen ? "translate-y-0" : "translate-y-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="篩選條件"
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between px-5 pb-4 pt-5">
            <h2 className="text-2xl font-semibold text-zinc-900">篩選</h2>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-zinc-200 text-zinc-700"
              aria-label="關閉篩選"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <section className="border-t border-zinc-300 py-6">
              <h3 className="text-base font-semibold text-zinc-900">排序依據</h3>
              <div className="mt-4 space-y-4">
                {productsSortOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 text-base text-zinc-800">
                    <input
                      type="radio"
                      name="mobile-sort"
                      value={option.value}
                      checked={queryState.sort === option.value}
                      onChange={() => handleMobileSortChange(option.value)}
                      className="h-5 w-5 border-zinc-400 text-zinc-900 focus:ring-zinc-900"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <ProductsFiltersPanel
              textSizeClass="text-base"
              selectedFilters={selectedFilters}
              onToggleFilter={toggleFilter}
              selectedColors={queryState.colors}
              onToggleColor={toggleColor}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
