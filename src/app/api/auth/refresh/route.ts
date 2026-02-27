import { apiError, apiOk } from "@/lib/server/api-response";
import {
  AUTH_ACCESS_COOKIE_NAME,
  AUTH_REFRESH_COOKIE_NAME,
  buildAccessCookieOptions,
  buildRefreshCookieOptions,
  getAuthUserDto,
  tryRefreshSessionFromCookies,
} from "@/lib/server/auth-session";

export async function POST() {
  const refreshed = await tryRefreshSessionFromCookies();

  if (!refreshed) {
    const response = apiError("登入已失效，請重新登入", 401, 401);

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

  const response = apiOk({
    session: getAuthUserDto(refreshed.user),
  });

  response.cookies.set(AUTH_ACCESS_COOKIE_NAME, refreshed.accessToken, buildAccessCookieOptions());
  response.cookies.set(AUTH_REFRESH_COOKIE_NAME, refreshed.refreshToken, buildRefreshCookieOptions());

  return response;
}
