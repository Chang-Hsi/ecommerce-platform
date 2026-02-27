export type ApiEnvelope<T> = {
  code: number;
  message: string;
  data: T;
};

const DEFAULT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";

function toAbsoluteUrl(path: string) {
  if (!DEFAULT_API_BASE_URL) {
    return path;
  }

  const normalizedBase = DEFAULT_API_BASE_URL.endsWith("/")
    ? DEFAULT_API_BASE_URL.slice(0, -1)
    : DEFAULT_API_BASE_URL;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function shouldAutoRefresh(path: string) {
  if (!path.startsWith("/api/")) {
    return false;
  }

  return !path.startsWith("/api/auth/");
}

function pickErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object") {
    const candidate = (payload as { message?: unknown; error?: unknown }).message
      ?? (payload as { message?: unknown; error?: unknown }).error;

    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return fallback;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
};

export async function request<T>(path: string, options: RequestOptions = {}) {
  const { headers, body, method = "GET", ...rest } = options;
  const isFormDataPayload = typeof FormData !== "undefined" && body instanceof FormData;
  const isStringPayload = typeof body === "string";
  const serializedBody = !isFormDataPayload && !isStringPayload && body ? JSON.stringify(body) : null;
  const mergedHeaders = new Headers(headers ?? {});

  if (!isFormDataPayload && !isStringPayload && body && !mergedHeaders.has("Content-Type")) {
    mergedHeaders.set("Content-Type", "application/json");
  }

  async function execute() {
    const response = await fetch(toAbsoluteUrl(path), {
      method,
      headers: mergedHeaders,
      body: body
        ? isFormDataPayload || isStringPayload
          ? body
          : serializedBody ?? undefined
        : undefined,
      credentials: "include",
      ...rest,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const payload: unknown = isJson ? await response.json() : await response.text();

    return {
      response,
      payload,
    };
  }

  let { response, payload } = await execute();

  if (response.status === 401 && shouldAutoRefresh(path)) {
    const refreshResponse = await fetch(toAbsoluteUrl("/api/auth/refresh"), {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      ({ response, payload } = await execute());
    }
  }

  if (!response.ok) {
    throw new Error(pickErrorMessage(payload, `Request failed: ${response.status}`));
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid API response payload.");
  }

  const envelope = payload as ApiEnvelope<T>;

  if (typeof envelope.code !== "number") {
    throw new Error("Invalid API response code.");
  }

  if (envelope.code !== 0) {
    throw new Error(envelope.message || "Request failed.");
  }

  return envelope;
}
