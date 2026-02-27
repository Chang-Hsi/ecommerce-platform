import { Suspense } from "react";
import { LoginVerifyPage } from "@/features/auth/LoginVerifyPage";

export default function LoginVerifyRoutePage() {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-[560px] px-1 py-4 md:py-8" />}>
      <LoginVerifyPage />
    </Suspense>
  );
}
