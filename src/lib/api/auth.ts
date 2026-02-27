import { request } from "@/lib/api/request";

export type AuthSessionDto = {
  email: string;
  name: string;
};

export async function fetchAuthSessionFromApi() {
  const payload = await request<{ session: AuthSessionDto | null }>("/api/auth/session", {
    cache: "no-store",
  });

  return payload.data.session;
}

export async function requestLoginCodeFromApi(email: string) {
  const payload = await request<{
    email: string;
    hasAccount: boolean;
    expiresAt: string;
    debugCode?: string;
  }>("/api/auth/login/request-code", {
    method: "POST",
    body: {
      email,
    },
  });

  return payload.data;
}

export async function verifyLoginCodeFromApi(email: string, code: string) {
  const payload = await request<{
    session: AuthSessionDto;
  }>("/api/auth/login/verify", {
    method: "POST",
    body: {
      email,
      code,
    },
  });

  return payload.data.session;
}

export async function logoutFromApi() {
  await request<{ success: boolean }>("/api/auth/logout", {
    method: "POST",
  });
}
