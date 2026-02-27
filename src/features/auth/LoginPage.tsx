"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  hasMockAccount,
  isValidEmail,
  normalizeEmail,
  resolveSafeRedirect,
  signInMockUser,
  startMockEmailVerification,
} from "@/lib/auth/mock-auth";

type LoginPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function readSingleQueryValue(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? "";
  }

  return "";
}

export function LoginPage({ searchParams }: Readonly<LoginPageProps>) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = useMemo(() => {
    const redirect = readSingleQueryValue(searchParams.redirect);
    return resolveSafeRedirect(redirect);
  }, [searchParams.redirect]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setErrorMessage("請輸入有效的電子郵件。");
      return;
    }

    setIsSubmitting(true);

    if (hasMockAccount(normalized)) {
      signInMockUser(normalized);
      router.replace(redirectTarget);
      return;
    }

    startMockEmailVerification(normalized);
    const verifyHref = `/login/verify?email=${encodeURIComponent(normalized)}&redirect=${encodeURIComponent(redirectTarget)}`;
    router.push(verifyHref);
  }

  return (
    <section className="mx-auto w-full max-w-[560px] px-1 py-4 md:py-8">
      <div className="mb-6 flex items-center gap-6 text-2xl text-zinc-900">
        <span className="font-black italic tracking-tight">SwooshLab</span>
      </div>

      <h1 className="max-w-[520px] text-xl font-semibold leading-tight text-zinc-900 md:text-2xl">
        輸入你的電子郵件即可註冊或登入。
      </h1>

      <p className="mt-3 text-base text-zinc-600">
        台灣 <button type="button" className="underline">變更</button>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="sr-only">電子郵件</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="電子郵件*"
            className="h-14 w-full rounded-xl border border-zinc-400 bg-transparent px-4 text-base text-zinc-900 outline-none transition focus:border-zinc-700"
            autoComplete="email"
            required
          />
        </label>

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        <p className="text-base text-zinc-500">繼續即代表我同意 SwooshLab 的隱私權政策與使用條款。</p>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-black px-8 py-3 text-base font-semibold text-white disabled:opacity-60"
          >
            繼續
          </button>
        </div>
      </form>
    </section>
  );
}
