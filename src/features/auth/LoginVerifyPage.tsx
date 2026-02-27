"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestLoginCodeFromApi, verifyLoginCodeFromApi } from "@/lib/api/auth";
import {
  resolveSafeRedirect,
  setMockSession,
} from "@/lib/auth/mock-auth";

function readSingleQueryValue(value: string | null) {
  return value?.trim() ?? "";
}

export function LoginVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(24);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialDebugCode = useMemo(() => readSingleQueryValue(searchParams.get("debugCode")), [searchParams]);
  const [debugCode, setDebugCode] = useState<string | null>(initialDebugCode || null);

  const email = useMemo(() => readSingleQueryValue(searchParams.get("email")).toLowerCase(), [searchParams]);

  const redirectTarget = useMemo(() => {
    const redirect = readSingleQueryValue(searchParams.get("redirect"));
    return resolveSafeRedirect(redirect);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    if (!email) {
      router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
      return;
    }

    if (initialDebugCode) {
      return;
    }

    async function bootstrapVerificationCode() {
      try {
        const payload = await requestLoginCodeFromApi(email);
        if (!isMounted) {
          return;
        }
        setDebugCode(payload.debugCode ?? null);
      } catch {
        if (!isMounted) {
          return;
        }
        setDebugCode(null);
      }
    }

    void bootstrapVerificationCode();

    return () => {
      isMounted = false;
    };
  }, [email, initialDebugCode, redirectTarget, router]);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [resendCountdown]);

  async function handleResend() {
    if (!email) {
      return;
    }

    try {
      const payload = await requestLoginCodeFromApi(email);
      setResendCountdown(24);
      setErrorMessage(null);
      setDebugCode(payload.debugCode ?? null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "目前無法重寄驗證碼，請稍後再試。");
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage("找不到登入信箱，請重新輸入。");
      return;
    }

    setIsSubmitting(true);

    try {
      const nextSession = await verifyLoginCodeFromApi(email, code);
      setMockSession({
        email: nextSession.email,
        name: nextSession.name,
      });
      router.replace(redirectTarget);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "驗證失敗，請重新輸入。");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-[560px] px-1 py-4 md:py-8">
      <div className="mb-6 flex items-center gap-6 text-2xl text-zinc-900">
        <span className="font-black italic tracking-tight">SwooshLab</span>
      </div>

      <h1 className="max-w-[520px] text-xl font-semibold leading-tight text-zinc-900 md:text-2xl">
        輸入透過電子郵件收到 8 位數驗證碼。
      </h1>

      <p className="mt-3 text-base text-zinc-700">
        {email} <button type="button" className="underline" onClick={() => router.back()}>編輯</button>
      </p>

      <form onSubmit={handleVerify} className="mt-8 space-y-5">
        <label className="block">
          <span className="sr-only">8 位數驗證碼</span>
          <div className="relative">
            <input
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="8 位數驗證碼*"
              inputMode="numeric"
              className="h-14 w-full rounded-xl border border-zinc-400 bg-transparent px-4 pr-14 text-base text-zinc-900 outline-none transition focus:border-zinc-700"
              required
            />
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCountdown > 0}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 disabled:opacity-40"
              aria-label="重寄驗證碼"
            >
              <ArrowPathIcon className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </label>

        <p className="text-right text-sm text-zinc-500">
          {resendCountdown > 0 ? `${resendCountdown} 秒後重新傳送驗證碼` : "可重新傳送驗證碼"}
        </p>

        {debugCode ? <p className="text-sm text-zinc-500">Demo 驗證碼：{debugCode}</p> : null}
        {errorMessage ? <p className="whitespace-pre-line text-sm text-red-600">{errorMessage}</p> : null}

        <button
          type="submit"
          className="h-14 w-full rounded-full bg-black text-base font-semibold text-white disabled:opacity-60"
          disabled={code.length !== 8 || isSubmitting}
        >
          登入
        </button>

        <button
          type="button"
          className="h-14 w-full rounded-full border border-zinc-300 text-base font-semibold text-zinc-800"
        >
          使用密碼
        </button>
      </form>
    </section>
  );
}
