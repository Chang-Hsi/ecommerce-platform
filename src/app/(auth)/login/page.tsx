import { Suspense } from "react";
import { LoginPage } from "@/features/auth/LoginPage";

export default function LoginRoutePage() {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-[560px] px-1 py-4 md:py-8" />}>
      <LoginPage />
    </Suspense>
  );
}
