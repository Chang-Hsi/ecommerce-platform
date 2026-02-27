import { apiError, apiOk } from "@/lib/server/api-response";
import { listFavoriteItemsByUser, upsertFavoriteByUser } from "@/lib/server/cart-favorites";
import { requireRequestUser } from "@/lib/server/require-auth";

type AddFavoriteBody = {
  slug?: string;
};

export async function GET() {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const items = await listFavoriteItemsByUser(auth.user.id);
    return apiOk({ items });
  } catch (error) {
    console.error("[api/favorites] GET failed", error);
    return apiError("讀取最愛清單失敗", 500);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const body = (await request.json()) as AddFavoriteBody;

    if (!body.slug || !body.slug.trim()) {
      return apiError("請提供商品 slug", 400);
    }

    const items = await upsertFavoriteByUser({
      userId: auth.user.id,
      slug: body.slug.trim(),
    });

    return apiOk({ items });
  } catch (error) {
    console.error("[api/favorites] POST failed", error);
    return apiError(error instanceof Error ? error.message : "加入最愛失敗", 400);
  }
}
