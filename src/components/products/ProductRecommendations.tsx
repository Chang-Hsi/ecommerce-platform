"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProductCatalogItem } from "@/content/products";

type ProductRecommendationsProps = {
  items: ProductCatalogItem[];
};

function ProductCard({ item }: Readonly<{ item: ProductCatalogItem }>) {
  return (
    <article className="space-y-3">
      <Link href={`/products/${item.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          <Image
            src={item.imageSrc}
            alt={item.name}
            fill
            sizes="(max-width: 767px) 72vw, 30vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </Link>
      <div className="space-y-0.5">
        <p className="text-2xl font-medium text-zinc-900">{item.name}</p>
        <p className="text-xl text-zinc-500">{item.subtitle}</p>
        <p className="pt-1 text-2xl font-medium text-zinc-900">NT${item.price.toLocaleString()}</p>
      </div>
    </article>
  );
}

export function ProductRecommendations({ items }: Readonly<ProductRecommendationsProps>) {
  const desktopVisibleCount = useMemo(() => Math.min(3, Math.max(1, items.length)), [items.length]);
  const maxDesktopStartIndex = useMemo(
    () => Math.max(0, items.length - desktopVisibleCount),
    [items.length, desktopVisibleCount],
  );
  const desktopItemWidthPercent = useMemo(() => 100 / desktopVisibleCount, [desktopVisibleCount]);
  const [desktopStartIndex, setDesktopStartIndex] = useState(0);

  if (items.length === 0) {
    return null;
  }

  const hasPrev = desktopStartIndex > 0;
  const hasNext = desktopStartIndex < maxDesktopStartIndex;
  const desktopTrackTransform = `translateX(-${desktopStartIndex * desktopItemWidthPercent}%)`;

  function handlePrevPage() {
    if (!hasPrev) {
      return;
    }

    setDesktopStartIndex((index) => Math.max(0, index - 1));
  }

  function handleNextPage() {
    if (!hasNext) {
      return;
    }

    setDesktopStartIndex((index) => Math.min(maxDesktopStartIndex, index + 1));
  }

  return (
    <section className="space-y-5 pt-12">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-4xl font-semibold text-zinc-900">你可能也會喜歡</h2>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={!hasPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="上一組推薦商品"
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={!hasNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="下一組推薦商品"
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2" role="region" aria-label="推薦商品滑動列表">
          {items.map((item) => (
            <div key={item.slug} className="w-[72vw] shrink-0">
              <ProductCard item={item} />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block">
        <div className="overflow-hidden">
          <div
            className="motion-slide-x -mx-1.5 flex"
            style={{ transform: desktopTrackTransform }}
          >
            {items.map((item) => (
              <div
                key={item.slug}
                className="shrink-0 px-1.5"
                style={{ width: `${desktopItemWidthPercent}%` }}
              >
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
