import type { MockFavoriteItem } from "@/lib/favorites/types";
import { request } from "@/lib/api/request";

export async function fetchFavoriteItemsFromApi() {
  const payload = await request<{ items: MockFavoriteItem[] }>("/api/favorites", {
    cache: "no-store",
  });

  return payload.data.items;
}

export async function addFavoriteBySlugFromApi(slug: string) {
  const payload = await request<{ items: MockFavoriteItem[] }>("/api/favorites", {
    method: "POST",
    body: {
      slug,
    },
  });

  return payload.data.items;
}

export async function removeFavoriteBySlugFromApi(slug: string) {
  const payload = await request<{ items: MockFavoriteItem[] }>(`/api/favorites/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });

  return payload.data.items;
}
