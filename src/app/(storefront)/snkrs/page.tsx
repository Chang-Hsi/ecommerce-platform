import { Suspense } from "react";
import { SnkrsPage } from "@/features/snkrs/SnkrsPage";

export default function SnkrsRoutePage() {
  return (
    <Suspense fallback={<div className="h-[70vh] w-full bg-[var(--background)]" />}>
      <SnkrsPage />
    </Suspense>
  );
}
