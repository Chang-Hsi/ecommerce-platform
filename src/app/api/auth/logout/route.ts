import { apiOk } from "@/lib/server/api-response";
import {
  AUTH_ACCESS_COOKIE_NAME,
  AUTH_REFRESH_COOKIE_NAME,
  buildAccessCookieOptions,
  buildRefreshCookieOptions,
  revokeSessionByRefreshCookie,
} from "@/lib/server/auth-session";

export async function POST() {
  await revokeSessionByRefreshCookie();

  const response = apiOk({
    success: true,
  });

  response.cookies.set(AUTH_ACCESS_COOKIE_NAME, "", {
    ...buildAccessCookieOptions(),
    maxAge: 0,
  });

  response.cookies.set(AUTH_REFRESH_COOKIE_NAME, "", {
    ...buildRefreshCookieOptions(),
    maxAge: 0,
  });

  return response;
}
