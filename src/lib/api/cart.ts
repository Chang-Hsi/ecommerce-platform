import type { MockCartItem } from "@/lib/cart/types";
import { request } from "@/lib/api/request";

export async function fetchCartItemsFromApi() {
  const payload = await request<{ items: MockCartItem[] }>("/api/cart", {
    cache: "no-store",
  });

  return payload.data.items;
}

export async function addCartItemToApi(input: { slug: string; sizeLabel?: string; qty?: number }) {
  const payload = await request<{ items: MockCartItem[] }>("/api/cart/items", {
    method: "POST",
    body: input,
  });

  return payload.data.items;
}

export async function updateCartItemQtyFromApi(itemId: string, qty: number) {
  const payload = await request<{ items: MockCartItem[] }>(`/api/cart/items/${encodeURIComponent(itemId)}`, {
    method: "PATCH",
    body: {
      qty,
    },
  });

  return payload.data.items;
}

export async function removeCartItemFromApi(itemId: string) {
  const payload = await request<{ items: MockCartItem[] }>(`/api/cart/items/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
  });

  return payload.data.items;
}
