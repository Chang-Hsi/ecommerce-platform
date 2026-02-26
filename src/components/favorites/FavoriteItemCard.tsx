"use client";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/cart/mock-cart";
import type { FavoriteViewItem } from "@/hooks/favorites/useFavoritesController";

type FavoriteItemCardProps = {
  item: FavoriteViewItem;
  onRemoveFavorite: (itemId: string) => void;
  onAddToCart: (item: FavoriteViewItem) => void;
};

export function FavoriteItemCard({ item, onRemoveFavorite, onAddToCart }: Readonly<FavoriteItemCardProps>) {
  return (
    <article className="space-y-3">
      <div className="relative overflow-hidden bg-zinc-100">
        <Link href={`/products/${item.slug}`} className="block">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={item.imageSrc}
              alt={item.name}
              fill
              sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={() => onRemoveFavorite(item.id)}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-900"
          aria-label="移除最愛"
        >
          <HeartIcon className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-medium text-zinc-900">{item.name}</h2>
          <p className="shrink-0 text-base font-medium text-zinc-900">{formatPrice(item.price)}</p>
        </div>
        <p className="text-base text-zinc-500">{item.subtitle}</p>
      </div>

      {item.isInCart ? (
        <p className="inline-flex h-8 items-center gap-1 rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-700">
          <CheckCircleIcon className="h-4 w-4 text-emerald-600" aria-hidden />
          已加入
        </p>
      ) : (
        <button
          type="button"
          onClick={() => onAddToCart(item)}
          className="inline-flex h-8 items-center rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-900"
        >
          加入購物車
        </button>
      )}
    </article>
  );
}
