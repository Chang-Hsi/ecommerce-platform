import { apiError } from "@/lib/server/api-response";
import { resolveRequestSession } from "@/lib/server/auth-session";

export async function requireRequestUser() {
  const resolved = await resolveRequestSession();

  if (!resolved) {
    return {
      user: null,
      errorResponse: apiError("請先登入", 401, 401),
    };
  }

  return {
    user: resolved.user,
    errorResponse: null,
  };
}
