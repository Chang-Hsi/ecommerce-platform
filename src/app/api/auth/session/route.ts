import { apiOk } from "@/lib/server/api-response";
import {
  AUTH_ACCESS_COOKIE_NAME,
  AUTH_REFRESH_COOKIE_NAME,
  buildAccessCookieOptions,
  buildRefreshCookieOptions,
  getAuthUserDto,
  resolveRequestSession,
  tryRefreshSessionFromCookies,
} from "@/lib/server/auth-session";

export async function GET() {
  const resolved = await resolveRequestSession();

  if (resolved) {
    return apiOk({
      session: getAuthUserDto(resolved.user),
    });
  }

  const refreshed = await tryRefreshSessionFromCookies();

  if (refreshed) {
    const response = apiOk({
      session: getAuthUserDto(refreshed.user),
    });

    response.cookies.set(AUTH_ACCESS_COOKIE_NAME, refreshed.accessToken, buildAccessCookieOptions());
    response.cookies.set(AUTH_REFRESH_COOKIE_NAME, refreshed.refreshToken, buildRefreshCookieOptions());

    return response;
  }

  const response = apiOk({ session: null });

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
