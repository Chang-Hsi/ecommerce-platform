import { Suspense } from "react";
import { ProductsPage } from "@/features/products/ProductsPage";

export default function ProductsRoutePage() {
  return (
    <Suspense fallback={<div className="h-[70vh] w-full bg-[var(--background)]" />}>
      <ProductsPage />
    </Suspense>
  );
}
