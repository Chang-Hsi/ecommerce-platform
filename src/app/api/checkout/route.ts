import { apiError, apiOk } from "@/lib/server/api-response";
import { getCheckoutPreviewByUserId } from "@/lib/server/checkout";
import { requireRequestUser } from "@/lib/server/require-auth";

export async function GET() {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const checkout = await getCheckoutPreviewByUserId(auth.user.id);
    return apiOk({ checkout });
  } catch (error) {
    console.error("[api/checkout] GET failed", error);
    return apiError("讀取結帳資料失敗", 500);
  }
}
