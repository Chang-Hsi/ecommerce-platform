import { apiError, apiOk } from "@/lib/server/api-response";
import { getProfileStateByUserId } from "@/lib/server/profile";
import { requireRequestUser } from "@/lib/server/require-auth";

export async function GET() {
  try {
    const { user, errorResponse } = await requireRequestUser();
    if (!user) {
      return errorResponse;
    }

    const profile = await getProfileStateByUserId(user.id);
    return apiOk({ profile });
  } catch (error) {
    console.error("[api/profile] GET failed", error);
    return apiError("讀取帳號設定失敗", 500);
  }
}
