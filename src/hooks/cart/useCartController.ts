"use client";

import { useEffect, useMemo, useState } from "react";
import { cartMessages } from "@/content/cart";
import {
  changeCartItemQty,
  getCartItems,
  getCartSummary,
  MOCK_CART_CHANGED_EVENT,
  removeCartItem,
  toggleCartItemFavorite,
} from "@/lib/cart/mock-cart";
import type { MockCartItem } from "@/lib/cart/types";

export function useCartController() {
  const [items, setItems] = useState<MockCartItem[]>([]);

  useEffect(() => {
    function sync() {
      setItems(getCartItems());
    }

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener(MOCK_CART_CHANGED_EVENT, sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(MOCK_CART_CHANGED_EVENT, sync as EventListener);
    };
  }, []);

  const summary = useMemo(() => getCartSummary(items), [items]);

  function onIncreaseQty(itemId: string) {
    setItems(changeCartItemQty(itemId, 1));
  }

  function onDecreaseQty(itemId: string) {
    const target = items.find((item) => item.id === itemId);
    if (!target || target.qty <= 1) {
      return;
    }

    setItems(changeCartItemQty(itemId, -1));
  }

  function onRemove(itemId: string) {
    setItems(removeCartItem(itemId));
  }

  function onToggleFavorite(itemId: string) {
    setItems(toggleCartItemFavorite(itemId));
  }

  return {
    items,
    summary,
    messages: cartMessages,
    onIncreaseQty,
    onDecreaseQty,
    onRemove,
    onToggleFavorite,
  };
}
