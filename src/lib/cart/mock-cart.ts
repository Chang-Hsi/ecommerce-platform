import {
  addCartItemToApi,
  fetchCartItemsFromApi,
  removeCartItemFromApi,
  updateCartItemQtyFromApi,
} from "@/lib/api/cart";
import { getMockSession } from "@/lib/auth/mock-auth";
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

function replaceCartItems(items: MockCartItem[]) {
  writeCartItems(items);
  emitCartChanged();
  return items;
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

export async function syncCartItemsFromApi() {
  if (!isBrowser()) {
    return defaultMockCartItems;
  }

  if (!getMockSession()) {
    return replaceCartItems([]);
  }

  try {
    const items = await fetchCartItemsFromApi();
    return replaceCartItems(items);
  } catch (error) {
    console.error("[mock-cart] syncCartItemsFromApi failed", error);
    return getCartItems();
  }
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

  replaceCartItems(nextItems);
  emitMiniCartOpen({ itemId: addedItemId });

  void addCartItemToApi({
    slug: input.slug,
    sizeLabel: input.sizeLabel,
    qty: 1,
  })
    .then((items) => {
      replaceCartItems(items);
    })
    .catch((error) => {
      console.error("[mock-cart] addCartItemToApi failed", error);
    });

  return {
    items: nextItems,
    addedItemId,
  };
}

export function removeCartItem(itemId: string) {
  const nextItems = getCartItems().filter((item) => item.id !== itemId);
  replaceCartItems(nextItems);

  void removeCartItemFromApi(itemId)
    .then((items) => {
      replaceCartItems(items);
    })
    .catch((error) => {
      console.error("[mock-cart] removeCartItemFromApi failed", error);
    });

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

  replaceCartItems(nextItems);

  void updateCartItemQtyFromApi(itemId, safeQty)
    .then((items) => {
      replaceCartItems(items);
    })
    .catch((error) => {
      console.error("[mock-cart] updateCartItemQtyFromApi failed", error);
    });

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

  replaceCartItems(nextItems);
  return nextItems;
}

export function getCartItemById(itemId: string) {
  return getCartItems().find((item) => item.id === itemId) ?? null;
}
