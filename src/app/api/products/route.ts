import { apiError, apiOk } from "@/lib/server/api-response";
import { listProductsFromDb } from "@/lib/server/products";

function parseMultiValue(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const pageRaw = Number(searchParams.get("page") ?? "1");
    const safePage = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

    const payload = await listProductsFromDb({
      category: searchParams.get("category"),
      sort: (searchParams.get("sort") as "popular" | "newest" | "price_desc" | "price_asc" | null) ?? "popular",
      page: safePage,
      q: searchParams.get("q"),
      gender: parseMultiValue(searchParams.get("gender")),
      kids: parseMultiValue(searchParams.get("kids")),
      price: parseMultiValue(searchParams.get("price")),
      brand: parseMultiValue(searchParams.get("brand")),
      sport: parseMultiValue(searchParams.get("sport")),
      fit: parseMultiValue(searchParams.get("fit")),
      feature: parseMultiValue(searchParams.get("feature")),
      tech: parseMultiValue(searchParams.get("tech")),
      colors: parseMultiValue(searchParams.get("colors")),
    });

    return apiOk(payload);
  } catch (error) {
    console.error("[api/products] GET failed", error);
    return apiError("讀取商品列表失敗", 500);
  }
}
