import { defaultMockFavoriteItems } from "@/content/favorites";
import type {
  AddFavoriteItemInput,
  FavoritePanelOpenPayload,
  FavoriteToggleResult,
  MockFavoriteItem,
} from "@/lib/favorites/types";

const FAVORITES_STORAGE_KEY = "swooshlab.mock-favorites.items.v1";

export const MOCK_FAVORITES_CHANGED_EVENT = "swooshlab:mock-favorites-changed";
export const MOCK_FAVORITE_PANEL_OPEN_EVENT = "swooshlab:mock-favorite-panel-open";

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParseItems(value: string | null): MockFavoriteItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as MockFavoriteItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => Boolean(item?.id && item?.slug));
  } catch {
    return [];
  }
}

function emitFavoritesChanged() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(MOCK_FAVORITES_CHANGED_EVENT));
}

function emitFavoritePanelOpen(payload: FavoritePanelOpenPayload) {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(MOCK_FAVORITE_PANEL_OPEN_EVENT, { detail: payload }));
}

function writeFavoriteItems(items: MockFavoriteItem[]) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
}

function ensureFavoriteItems() {
  if (!isBrowser()) {
    return defaultMockFavoriteItems;
  }

  const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (stored !== null) {
    return safeParseItems(stored);
  }

  writeFavoriteItems(defaultMockFavoriteItems);
  return defaultMockFavoriteItems;
}

function createFavoriteItem(input: AddFavoriteItemInput): MockFavoriteItem {
  return {
    id: input.slug,
    slug: input.slug,
    name: input.name,
    subtitle: input.subtitle,
    imageSrc: input.imageSrc,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    colorLabel: input.colorLabel,
    defaultSize: input.defaultSize,
    requiresSizeSelection: input.requiresSizeSelection,
    addedAt: new Date().toISOString(),
  };
}

export function getFavoriteItems() {
  return ensureFavoriteItems();
}

export function getFavoriteItemById(itemId: string) {
  return getFavoriteItems().find((item) => item.id === itemId) ?? null;
}

export function getFavoriteItemBySlug(slug: string) {
  return getFavoriteItems().find((item) => item.slug === slug) ?? null;
}

export function isFavoriteItemBySlug(slug: string) {
  return Boolean(getFavoriteItemBySlug(slug));
}

export function addFavoriteItem(input: AddFavoriteItemInput) {
  const existingItems = getFavoriteItems();
  const existing = existingItems.find((item) => item.slug === input.slug);
  const nextItem = createFavoriteItem(input);

  const nextItems = existing
    ? existingItems.map((item) => (item.slug === input.slug ? { ...nextItem, addedAt: item.addedAt } : item))
    : [nextItem, ...existingItems];

  writeFavoriteItems(nextItems);
  emitFavoritesChanged();
  emitFavoritePanelOpen({ itemId: nextItem.id });
  return nextItem;
}

export function removeFavoriteItem(itemId: string) {
  const nextItems = getFavoriteItems().filter((item) => item.id !== itemId);
  writeFavoriteItems(nextItems);
  emitFavoritesChanged();
  return nextItems;
}

export function removeFavoriteItemBySlug(slug: string) {
  const nextItems = getFavoriteItems().filter((item) => item.slug !== slug);
  writeFavoriteItems(nextItems);
  emitFavoritesChanged();
  return nextItems;
}

export function toggleFavoriteItem(input: AddFavoriteItemInput): FavoriteToggleResult {
  const existing = getFavoriteItemBySlug(input.slug);

  if (existing) {
    removeFavoriteItemBySlug(input.slug);
    return {
      isFavorite: false,
      item: null,
    };
  }

  const added = addFavoriteItem(input);
  return {
    isFavorite: true,
    item: added,
  };
}
