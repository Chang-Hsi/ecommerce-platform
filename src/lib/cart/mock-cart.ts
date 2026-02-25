import { defaultMockCartItems } from "@/content/cart";
import type { CartSummary, MiniCartOpenPayload, MockCartItem } from "@/lib/cart/types";

const CART_STORAGE_KEY = "swooshlab.mock-cart.items.v1";

export const MOCK_CART_CHANGED_EVENT = "swooshlab:mock-cart-changed";
export const MOCK_MINI_CART_OPEN_EVENT = "swooshlab:mini-cart-open";

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParseItems(value: string | null): MockCartItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as MockCartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => Boolean(item?.id && item?.slug));
  } catch {
    return [];
  }
}

function emitCartChanged() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(MOCK_CART_CHANGED_EVENT));
}

function emitMiniCartOpen(payload: MiniCartOpenPayload) {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(MOCK_MINI_CART_OPEN_EVENT, { detail: payload }));
}

function writeCartItems(items: MockCartItem[]) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function ensureCartItems() {
  if (!isBrowser()) {
    return defaultMockCartItems;
  }

  const existing = safeParseItems(localStorage.getItem(CART_STORAGE_KEY));
  if (existing.length > 0) {
    return existing;
  }

  writeCartItems(defaultMockCartItems);
  return defaultMockCartItems;
}

export function getCartItems() {
  return ensureCartItems();
}

export function getCartItemCount(items = getCartItems()) {
  return items.length;
}

export function getCartSummary(items = getCartItems()): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const shippingFee = 0;
  const serviceFee = 0;

  return {
    subtotal,
    shippingFee,
    serviceFee,
    total: subtotal + shippingFee + serviceFee,
  };
}

export function formatPrice(value: number) {
  return `NT$${value.toLocaleString()}`;
}

export type AddCartItemInput = {
  slug: string;
  name: string;
  subtitle: string;
  imageSrc: string;
  colorLabel: string;
  sizeLabel: string;
  unitPrice: number;
  compareAtPrice?: number;
  lowStock?: boolean;
};

export function addCartItem(input: AddCartItemInput) {
  const existingItems = getCartItems();
  const key = `${input.slug}-${input.sizeLabel}`;
  const existing = existingItems.find((item) => item.id === key);

  let nextItems: MockCartItem[];
  let addedItemId: string;

  if (existing) {
    nextItems = existingItems.map((item) =>
      item.id === key
        ? {
            ...item,
            qty: item.qty + 1,
            unitPrice: input.unitPrice,
            compareAtPrice: input.compareAtPrice,
            imageSrc: input.imageSrc,
            name: input.name,
            subtitle: input.subtitle,
            colorLabel: input.colorLabel,
            lowStock: input.lowStock ?? item.lowStock,
          }
        : item,
    );
    addedItemId = key;
  } else {
    const newItem: MockCartItem = {
      id: key,
      slug: input.slug,
      name: input.name,
      subtitle: input.subtitle,
      imageSrc: input.imageSrc,
      colorLabel: input.colorLabel,
      sizeLabel: input.sizeLabel,
      unitPrice: input.unitPrice,
      compareAtPrice: input.compareAtPrice,
      qty: 1,
      lowStock: input.lowStock ?? false,
      isFavorite: false,
    };
    nextItems = [newItem, ...existingItems];
    addedItemId = newItem.id;
  }

  writeCartItems(nextItems);
  emitCartChanged();
  emitMiniCartOpen({ itemId: addedItemId });

  return {
    items: nextItems,
    addedItemId,
  };
}

export function removeCartItem(itemId: string) {
  const nextItems = getCartItems().filter((item) => item.id !== itemId);
  writeCartItems(nextItems);
  emitCartChanged();
  return nextItems;
}

export function updateCartItemQty(itemId: string, qty: number) {
  const safeQty = Math.max(1, Math.floor(qty));
  const nextItems = getCartItems().map((item) =>
    item.id === itemId
      ? {
          ...item,
          qty: safeQty,
        }
      : item,
  );

  writeCartItems(nextItems);
  emitCartChanged();
  return nextItems;
}

export function changeCartItemQty(itemId: string, delta: number) {
  const current = getCartItems().find((item) => item.id === itemId);
  if (!current) {
    return getCartItems();
  }

  return updateCartItemQty(itemId, current.qty + delta);
}

export function toggleCartItemFavorite(itemId: string) {
  const nextItems = getCartItems().map((item) =>
    item.id === itemId
      ? {
          ...item,
          isFavorite: !item.isFavorite,
        }
      : item,
  );

  writeCartItems(nextItems);
  emitCartChanged();
  return nextItems;
}

export function getCartItemById(itemId: string) {
  return getCartItems().find((item) => item.id === itemId) ?? null;
}
