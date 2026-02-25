"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCartItemById,
  getCartItemCount,
  getCartItems,
  MOCK_CART_CHANGED_EVENT,
  MOCK_MINI_CART_OPEN_EVENT,
} from "@/lib/cart/mock-cart";
import type { MiniCartOpenPayload, MockCartItem } from "@/lib/cart/types";

export function useMiniCartController() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<MockCartItem[]>([]);
  const [lastAddedItemId, setLastAddedItemId] = useState<string | null>(null);

  useEffect(() => {
    function syncItems() {
      setItems(getCartItems());
    }

    function onMiniCartOpen(event: Event) {
      const customEvent = event as CustomEvent<MiniCartOpenPayload>;
      const itemId = customEvent.detail?.itemId;
      if (!itemId) {
        return;
      }

      setLastAddedItemId(itemId);
      setItems(getCartItems());
      setIsOpen(true);
    }

    syncItems();

    window.addEventListener("storage", syncItems);
    window.addEventListener(MOCK_CART_CHANGED_EVENT, syncItems as EventListener);
    window.addEventListener(MOCK_MINI_CART_OPEN_EVENT, onMiniCartOpen as EventListener);

    return () => {
      window.removeEventListener("storage", syncItems);
      window.removeEventListener(MOCK_CART_CHANGED_EVENT, syncItems as EventListener);
      window.removeEventListener(MOCK_MINI_CART_OPEN_EVENT, onMiniCartOpen as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const itemCount = useMemo(() => getCartItemCount(items), [items]);

  const lastAddedItem = useMemo(() => {
    if (lastAddedItemId) {
      return items.find((item) => item.id === lastAddedItemId) ?? getCartItemById(lastAddedItemId);
    }

    return items[0] ?? null;
  }, [items, lastAddedItemId]);

  const closeMiniCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    itemCount,
    lastAddedItem,
    closeMiniCart,
  };
}
