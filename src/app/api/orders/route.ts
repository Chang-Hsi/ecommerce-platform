import { apiError, apiOk } from "@/lib/server/api-response";
import { listCompletedOrdersByUser } from "@/lib/server/orders";
import { requireRequestUser } from "@/lib/server/require-auth";

export async function GET() {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const orders = await listCompletedOrdersByUser(auth.user.id);
    return apiOk({ orders });
  } catch (error) {
    console.error("[api/orders] GET failed", error);
    return apiError("讀取訂單失敗", 500);
  }
}
