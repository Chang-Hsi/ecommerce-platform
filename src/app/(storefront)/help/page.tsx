import { Suspense } from "react";
import { HelpPage } from "@/features/help/HelpPage";

export default function HelpRoutePage() {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-6xl space-y-10 mb-[5rem]" />}>
      <HelpPage />
    </Suspense>
  );
}
