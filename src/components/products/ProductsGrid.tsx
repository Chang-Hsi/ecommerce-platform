"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductCatalogItem } from "@/content/products";

type ProductsGridProps = {
  products: ProductCatalogItem[];
};

export function ProductsGrid({ products }: Readonly<ProductsGridProps>) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
      {products.map((product) => (
        <Link key={product.slug} href={`/products/${product.slug}`} className="flex h-full flex-col bg-zinc-100">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
            <Image
              src={product.imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1279px) 33vw, 28vw"
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-0.5 px-1 pb-2 pt-2 sm:px-2">
            <p className="text-base font-semibold text-red-600">{product.badge}</p>
            <h2 className="text-base font-semibold tracking-tight text-zinc-900">{product.name}</h2>
            <p className="text-base text-zinc-500">{product.subtitle}</p>
            <p className="pt-0.5 text-base font-medium text-zinc-900">NT${product.price.toLocaleString()}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
