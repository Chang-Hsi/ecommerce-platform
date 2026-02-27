import { apiError, apiOk } from "@/lib/server/api-response";
import { removeCartItemByUser, updateCartItemQtyByUser } from "@/lib/server/cart-favorites";
import { requireRequestUser } from "@/lib/server/require-auth";

type CartItemContext = {
  params: Promise<{
    itemId: string;
  }>;
};

type UpdateCartItemBody = {
  qty?: number;
};

export async function PATCH(request: Request, context: CartItemContext) {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const body = (await request.json()) as UpdateCartItemBody;
    const nextQty = Number(body.qty ?? 1);

    if (!Number.isFinite(nextQty) || nextQty < 1) {
      return apiError("請提供有效的數量", 400);
    }

    const { itemId } = await context.params;

    const items = await updateCartItemQtyByUser({
      userId: auth.user.id,
      itemKey: itemId,
      qty: Math.floor(nextQty),
    });

    return apiOk({ items });
  } catch (error) {
    console.error("[api/cart/items/:itemId] PATCH failed", error);
    return apiError(error instanceof Error ? error.message : "更新數量失敗", 400);
  }
}

export async function DELETE(_: Request, context: CartItemContext) {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const { itemId } = await context.params;

    const items = await removeCartItemByUser({
      userId: auth.user.id,
      itemKey: itemId,
    });

    return apiOk({ items });
  } catch (error) {
    console.error("[api/cart/items/:itemId] DELETE failed", error);
    return apiError("移除購物車品項失敗", 500);
  }
}
