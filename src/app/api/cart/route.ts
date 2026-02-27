import { apiError, apiOk } from "@/lib/server/api-response";
import { listCartItemsByUser } from "@/lib/server/cart-favorites";
import { requireRequestUser } from "@/lib/server/require-auth";

export async function GET() {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const items = await listCartItemsByUser(auth.user.id);
    return apiOk({ items });
  } catch (error) {
    console.error("[api/cart] GET failed", error);
    return apiError("讀取購物車失敗", 500);
  }
}
