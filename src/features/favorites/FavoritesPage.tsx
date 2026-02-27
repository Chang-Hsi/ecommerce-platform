"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { FavoritesGrid } from "@/components/favorites/FavoritesGrid";
import { ProductRecommendations } from "@/components/products/ProductRecommendations";
import { productsContent } from "@/content/products";
import { resolveSafeRedirect } from "@/lib/auth/mock-auth";
import { useMockAuthSession } from "@/hooks/auth/useMockAuthSession";
import { useFavoritesController } from "@/hooks/favorites/useFavoritesController";

export function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useMockAuthSession();
  const {
    title,
    emptyTitle,
    emptyDescription,
    emptyCtaLabel,
    items,
    hasItems,
    onRemoveFavorite,
    onAddToCart,
  } = useFavoritesController();
  const recommendationItems = useMemo(() => {
    const favoriteSlugSet = new Set(items.map((item) => item.slug));
    const filtered = productsContent.filter((item) => !favoriteSlugSet.has(item.slug));
    const source = filtered.length > 0 ? filtered : productsContent;
    return source.slice(0, 6);
  }, [items]);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      const redirect = resolveSafeRedirect("/favorites");
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{title}</h1>
      </header>

      {hasItems ? (
        <div className="space-y-10">
          <FavoritesGrid items={items} onRemoveFavorite={onRemoveFavorite} onAddToCart={onAddToCart} />
          <ProductRecommendations items={recommendationItems} />
        </div>
      ) : (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-zinc-900">{emptyTitle}</h2>
          <p className="mt-2 text-base text-zinc-600">{emptyDescription}</p>
          <Link
            href="/products?page=1"
            className="mt-4 inline-flex rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white"
          >
            {emptyCtaLabel}
          </Link>
        </section>
      )}
    </div>
  );
}
