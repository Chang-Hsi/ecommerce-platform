"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getFavoriteItemById,
  getFavoriteItems,
  MOCK_FAVORITES_CHANGED_EVENT,
  MOCK_FAVORITE_PANEL_OPEN_EVENT,
} from "@/lib/favorites/mock-favorites";
import type { FavoritePanelOpenPayload, MockFavoriteItem } from "@/lib/favorites/types";

export function useFavoritePanelController() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<MockFavoriteItem[]>([]);
  const [lastOpenedItemId, setLastOpenedItemId] = useState<string | null>(null);

  useEffect(() => {
    function syncItems() {
      setItems(getFavoriteItems());
    }

    function onPanelOpen(event: Event) {
      const customEvent = event as CustomEvent<FavoritePanelOpenPayload>;
      const itemId = customEvent.detail?.itemId;
      if (!itemId) {
        return;
      }

      setLastOpenedItemId(itemId);
      setItems(getFavoriteItems());
      setIsOpen(true);
    }

    syncItems();

    window.addEventListener("storage", syncItems);
    window.addEventListener(MOCK_FAVORITES_CHANGED_EVENT, syncItems as EventListener);
    window.addEventListener(MOCK_FAVORITE_PANEL_OPEN_EVENT, onPanelOpen as EventListener);

    return () => {
      window.removeEventListener("storage", syncItems);
      window.removeEventListener(MOCK_FAVORITES_CHANGED_EVENT, syncItems as EventListener);
      window.removeEventListener(MOCK_FAVORITE_PANEL_OPEN_EVENT, onPanelOpen as EventListener);
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

  const lastOpenedItem =
    (lastOpenedItemId ? items.find((item) => item.id === lastOpenedItemId) : null) ??
    (lastOpenedItemId ? getFavoriteItemById(lastOpenedItemId) : null) ??
    null;

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    lastOpenedItem,
    closePanel,
  };
}
