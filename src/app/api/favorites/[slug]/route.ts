import { apiError, apiOk } from "@/lib/server/api-response";
import { removeFavoriteByUser } from "@/lib/server/cart-favorites";
import { requireRequestUser } from "@/lib/server/require-auth";

type FavoriteDeleteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function DELETE(_: Request, context: FavoriteDeleteContext) {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const { slug } = await context.params;

    const items = await removeFavoriteByUser({
      userId: auth.user.id,
      slug,
    });

    return apiOk({ items });
  } catch (error) {
    console.error("[api/favorites/:slug] DELETE failed", error);
    return apiError("移除最愛失敗", 500);
  }
}
