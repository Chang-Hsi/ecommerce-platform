"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { favoritesPageContent } from "@/content/favorites";
import { MOCK_AUTH_CHANGED_EVENT } from "@/lib/auth/mock-auth";
import {
  addCartItem,
  getCartItems,
  MOCK_CART_CHANGED_EVENT,
  syncCartItemsFromApi,
} from "@/lib/cart/mock-cart";
import {
  getFavoriteItems,
  MOCK_FAVORITES_CHANGED_EVENT,
  removeFavoriteItem,
  syncFavoriteItemsFromApi,
} from "@/lib/favorites/mock-favorites";
import type { MockFavoriteItem } from "@/lib/favorites/types";

export type FavoriteViewItem = MockFavoriteItem & {
  isInCart: boolean;
};

export function useFavoritesController() {
  const router = useRouter();
  const [items, setItems] = useState<MockFavoriteItem[]>([]);
  const [cartSlugs, setCartSlugs] = useState<string[]>([]);

  useEffect(() => {
    function sync() {
      setItems(getFavoriteItems());
      setCartSlugs(getCartItems().map((item) => item.slug));
    }

    async function syncRemote() {
      const [favoriteItems, cartItems] = await Promise.all([syncFavoriteItemsFromApi(), syncCartItemsFromApi()]);
      setItems(favoriteItems);
      setCartSlugs(cartItems.map((item) => item.slug));
    }

    sync();
    void syncRemote();

    function handleAuthChanged() {
      void syncRemote();
    }

    window.addEventListener("storage", sync);
    window.addEventListener(MOCK_FAVORITES_CHANGED_EVENT, sync as EventListener);
    window.addEventListener(MOCK_CART_CHANGED_EVENT, sync as EventListener);
    window.addEventListener(MOCK_AUTH_CHANGED_EVENT, handleAuthChanged as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(MOCK_FAVORITES_CHANGED_EVENT, sync as EventListener);
      window.removeEventListener(MOCK_CART_CHANGED_EVENT, sync as EventListener);
      window.removeEventListener(MOCK_AUTH_CHANGED_EVENT, handleAuthChanged as EventListener);
    };
  }, []);

  const cartSlugSet = useMemo(() => new Set(cartSlugs), [cartSlugs]);

  const viewItems = useMemo<FavoriteViewItem[]>(
    () => items.map((item) => ({ ...item, isInCart: cartSlugSet.has(item.slug) })),
    [items, cartSlugSet],
  );

  function onRemoveFavorite(itemId: string) {
    setItems(removeFavoriteItem(itemId));
  }

  function onAddToCart(item: FavoriteViewItem) {
    if (item.isInCart) {
      return;
    }

    if (item.requiresSizeSelection && !item.defaultSize) {
      router.push(`/products/${item.slug}`);
      return;
    }

    addCartItem({
      slug: item.slug,
      name: item.name,
      subtitle: item.subtitle,
      imageSrc: item.imageSrc,
      colorLabel: item.colorLabel,
      sizeLabel: item.defaultSize ?? "單一尺寸",
      unitPrice: item.price,
      compareAtPrice: item.compareAtPrice,
      lowStock: false,
    });
  }

  return {
    title: favoritesPageContent.title,
    emptyTitle: favoritesPageContent.emptyTitle,
    emptyDescription: favoritesPageContent.emptyDescription,
    emptyCtaLabel: favoritesPageContent.emptyCtaLabel,
    items: viewItems,
    hasItems: viewItems.length > 0,
    onRemoveFavorite,
    onAddToCart,
  };
}
