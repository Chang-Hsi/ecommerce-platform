"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getMockSession, MOCK_AUTH_CHANGED_EVENT, resolveSafeRedirect } from "@/lib/auth/mock-auth";
import { addCartItem, getCartItems, MOCK_CART_CHANGED_EVENT, syncCartItemsFromApi } from "@/lib/cart/mock-cart";
import {
  getFavoriteItems,
  MOCK_FAVORITES_CHANGED_EVENT,
  removeFavoriteItem,
  syncFavoriteItemsFromApi,
} from "@/lib/favorites/mock-favorites";
import type { MockFavoriteItem } from "@/lib/favorites/types";
import { getProductDetailBySlug } from "@/lib/products/detail-mapper";
import type { ProductSizeOption } from "@/content/product-detail";

export type CartFavoriteViewItem = MockFavoriteItem & {
  isInCart: boolean;
};

export function useCartFavoritesController() {
  const router = useRouter();
  const [items, setItems] = useState<MockFavoriteItem[]>([]);
  const [cartSlugs, setCartSlugs] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [pickerItemId, setPickerItemId] = useState<string | null>(null);
  const [pickerError, setPickerError] = useState<string | null>(null);

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

  const viewItems = useMemo<CartFavoriteViewItem[]>(
    () => items.map((item) => ({ ...item, isInCart: cartSlugSet.has(item.slug) })),
    [items, cartSlugSet],
  );

  const pickerItem = useMemo(
    () => (pickerItemId ? viewItems.find((item) => item.id === pickerItemId) ?? null : null),
    [pickerItemId, viewItems],
  );

  const pickerSizes = useMemo<ProductSizeOption[]>(() => {
    if (!pickerItem) {
      return [];
    }

    const detail = getProductDetailBySlug(pickerItem.slug);
    if (!detail) {
      return [];
    }

    return detail.sizes;
  }, [pickerItem]);

  function requireSession() {
    const hasSession = Boolean(getMockSession());
    if (hasSession) {
      return true;
    }

    const redirect = resolveSafeRedirect("/cart");
    router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    return false;
  }

  function onRemoveFavorite(itemId: string) {
    setItems(removeFavoriteItem(itemId));
  }

  function openSizePicker(itemId: string) {
    setPickerError(null);
    setPickerItemId(itemId);
  }

  function closeSizePicker() {
    setPickerError(null);
    setPickerItemId(null);
  }

  function onSelectPickerSize(sizeValue: string) {
    if (!pickerItemId) {
      return;
    }

    setSelectedSizes((current) => ({ ...current, [pickerItemId]: sizeValue }));
    setPickerError(null);
  }

  function resolveSizeLabel(item: CartFavoriteViewItem) {
    return selectedSizes[item.id] ?? item.defaultSize ?? null;
  }

  function addFavoriteItemToCart(item: CartFavoriteViewItem, sizeLabel?: string | null) {
    addCartItem({
      slug: item.slug,
      name: item.name,
      subtitle: item.subtitle,
      imageSrc: item.imageSrc,
      colorLabel: item.colorLabel,
      sizeLabel: sizeLabel ?? "單一尺寸",
      unitPrice: item.price,
      compareAtPrice: item.compareAtPrice,
      lowStock: true,
    });
  }

  function onAddToCart(item: CartFavoriteViewItem) {
    if (item.isInCart) {
      return;
    }

    if (!requireSession()) {
      return;
    }

    const selectedSize = resolveSizeLabel(item);
    if (item.requiresSizeSelection && !selectedSize) {
      openSizePicker(item.id);
      return;
    }

    addFavoriteItemToCart(item, selectedSize);
  }

  function confirmAddToCartFromPicker() {
    if (!pickerItem) {
      return;
    }

    if (pickerItem.isInCart) {
      closeSizePicker();
      return;
    }

    if (!requireSession()) {
      return;
    }

    const selectedSize = resolveSizeLabel(pickerItem);
    if (!selectedSize) {
      setPickerError("請先選擇尺寸");
      return;
    }

    addFavoriteItemToCart(pickerItem, selectedSize);
    closeSizePicker();
  }

  return {
    items: viewItems,
    hasItems: viewItems.length > 0,
    pickerItem,
    pickerSizes,
    pickerError,
    selectedSizes,
    onRemoveFavorite,
    onAddToCart,
    openSizePicker,
    closeSizePicker,
    onSelectPickerSize,
    confirmAddToCartFromPicker,
    resolveSizeLabel,
  };
}
