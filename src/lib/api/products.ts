import type { ProductDetailContent } from "@/content/product-detail";
import type { ProductCatalogItem } from "@/content/products";
import { request } from "@/lib/api/request";

type ProductListQueryInput = {
  category?: string | null;
  sort?: "popular" | "newest" | "price_desc" | "price_asc";
  page?: number;
  q?: string | null;
  gender?: string[];
  kids?: string[];
  price?: string[];
  brand?: string[];
  sport?: string[];
  fit?: string[];
  feature?: string[];
  tech?: string[];
  colors?: string[];
};

function buildProductsQuery(input: ProductListQueryInput) {
  const params = new URLSearchParams();

  function setValue(key: string, value: string | number | null | undefined) {
    if (value === null || value === undefined || value === "") {
      return;
    }

    params.set(key, String(value));
  }

  function setList(key: string, values: string[] | undefined) {
    if (!values || values.length === 0) {
      return;
    }

    params.set(key, values.join(","));
  }

  setValue("category", input.category);
  setValue("sort", input.sort);
  setValue("page", input.page);
  setValue("q", input.q);
  setList("gender", input.gender);
  setList("kids", input.kids);
  setList("price", input.price);
  setList("brand", input.brand);
  setList("sport", input.sport);
  setList("fit", input.fit);
  setList("feature", input.feature);
  setList("tech", input.tech);
  setList("colors", input.colors);

  return params.toString();
}

export async function fetchProductsFromApi(input: ProductListQueryInput) {
  const query = buildProductsQuery(input);
  const path = query ? `/api/products?${query}` : "/api/products";

  const payload = await request<{
    products: ProductCatalogItem[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }>(path, {
    cache: "no-store",
  });

  return payload.data;
}

export async function fetchProductDetailBySlugFromApi(slug: string) {
  const payload = await request<{
    detail: ProductDetailContent;
    recommendations: ProductCatalogItem[];
  }>(`/api/products/${slug}`, {
    cache: "no-store",
  });

  return payload.data;
}
