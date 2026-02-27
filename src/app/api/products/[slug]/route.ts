import { apiError, apiOk } from "@/lib/server/api-response";
import { getProductDetailBySlugFromDb } from "@/lib/server/products";

type ProductDetailRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, context: ProductDetailRouteContext) {
  try {
    const { slug } = await context.params;
    const payload = await getProductDetailBySlugFromDb(slug);

    if (!payload) {
      return apiError("找不到商品", 404, 404);
    }

    return apiOk(payload);
  } catch (error) {
    console.error("[api/products/:slug] GET failed", error);
    return apiError("讀取商品失敗", 500);
  }
}
