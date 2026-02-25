"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import type { ProductMediaItem } from "@/content/product-detail";

type ProductMediaGalleryProps = {
  media: ProductMediaItem[];
  activeMediaIndex: number;
  canGoPrevMedia: boolean;
  canGoNextMedia: boolean;
  onSelectMedia: (index: number) => void;
  onGoPrevMedia: () => void;
  onGoNextMedia: () => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProductMediaGallery({
  media,
  activeMediaIndex,
  canGoPrevMedia,
  canGoNextMedia,
  onSelectMedia,
  onGoPrevMedia,
  onGoNextMedia,
}: Readonly<ProductMediaGalleryProps>) {
  return (
    <section className="grid gap-3 md:grid-cols-[70px_minmax(0,1fr)] md:gap-4 lg:sticky lg:top-[calc(var(--storefront-header-offset,0px)+18px)] lg:self-start">
      <div className="order-2 flex gap-2 overflow-x-auto pb-1 md:order-1 md:h-[620px] md:flex-col md:overflow-y-auto md:pr-1">
        {media.map((item, index) => {
          const isActive = index === activeMediaIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectMedia(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-zinc-100 transition",
                isActive ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-400",
              )}
              aria-label={`切換商品圖片 ${index + 1}`}
            >
              <Image src={item.imageSrc} alt={item.alt} fill sizes="64px" className="object-cover" />
            </button>
          );
        })}
      </div>

      <div className="order-1 relative aspect-square overflow-hidden rounded-xl bg-zinc-100 md:order-2 md:h-[620px] md:aspect-auto">
        <div
          className="motion-slide-x absolute inset-0 flex"
          style={{ transform: `translateX(-${activeMediaIndex * 100}%)` }}
        >
          {media.map((item, index) => (
            <div key={item.id} className="relative h-full min-w-full">
              <Image
                src={item.imageSrc}
                alt={item.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 767px) 100vw, 65vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onGoPrevMedia}
            disabled={!canGoPrevMedia}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-zinc-800 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="上一張商品圖"
          >
            <ChevronLeftIcon className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onGoNextMedia}
            disabled={!canGoNextMedia}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-zinc-800 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="下一張商品圖"
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
