import { apiError, apiOk } from "@/lib/server/api-response";
import { upsertCartItemByUser } from "@/lib/server/cart-favorites";
import { requireRequestUser } from "@/lib/server/require-auth";

type AddCartItemBody = {
  slug?: string;
  sizeLabel?: string;
  qty?: number;
};

export async function POST(request: Request) {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const body = (await request.json()) as AddCartItemBody;

    if (!body.slug || !body.slug.trim()) {
      return apiError("請提供商品 slug", 400);
    }

    const items = await upsertCartItemByUser({
      userId: auth.user.id,
      slug: body.slug.trim(),
      sizeLabel: body.sizeLabel,
      qty: body.qty,
    });

    return apiOk({ items });
  } catch (error) {
    console.error("[api/cart/items] POST failed", error);
    return apiError(error instanceof Error ? error.message : "加入購物車失敗", 400);
  }
}
