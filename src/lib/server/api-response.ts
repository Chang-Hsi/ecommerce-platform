import { NextResponse } from "next/server";

export type ApiEnvelope<T> = {
  code: number;
  message: string;
  data: T;
};

export function apiOk<T>(data: T, message = "ok", init?: ResponseInit) {
  return NextResponse.json<ApiEnvelope<T>>(
    {
      code: 0,
      message,
      data,
    },
    {
      status: 200,
      ...init,
    },
  );
}

export function apiError(message: string, status = 400, code = 1, details?: Record<string, unknown>) {
  return NextResponse.json(
    {
      code,
      message,
      data: details ?? {},
    },
    { status },
  );
}
