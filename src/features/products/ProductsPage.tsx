"use client";

import { useSearchParams } from "next/navigation";
import { ProductsView } from "@/components/products/ProductsView";

function mapSearchParams(searchParams: URLSearchParams) {
  const mapped: Record<string, string | string[]> = {};

  for (const key of searchParams.keys()) {
    const values = searchParams.getAll(key);
    if (values.length <= 1) {
      mapped[key] = values[0] ?? "";
      continue;
    }

    mapped[key] = values;
  }

  return mapped;
}

export function ProductsPage() {
  const searchParams = useSearchParams();
  return <ProductsView searchParams={mapSearchParams(searchParams)} />;
}
