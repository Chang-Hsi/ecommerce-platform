"use client";

import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { formatPrice } from "@/lib/cart/mock-cart";
import { useFavoritePanelController } from "@/hooks/favorites/useFavoritePanelController";

export function FavoriteConfirmPanel() {
  const pathname = usePathname();
  const { isOpen, lastOpenedItem, closePanel } = useFavoritePanelController();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname && isOpen) {
      closePanel();
    }

    previousPathnameRef.current = pathname;
  }, [pathname, isOpen, closePanel]);

  if (!isOpen || !lastOpenedItem) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[70] bg-black/45"
        onClick={closePanel}
        aria-label="關閉最愛提示浮層"
      />

      <section
        className="fade-down-in fixed right-4 top-20 z-[80] w-[min(92vw,360px)] rounded-3xl bg-white p-4 shadow-2xl sm:right-6"
        role="dialog"
        aria-modal="true"
        aria-label="已加入最愛"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-base font-semibold text-zinc-900">
            <CheckCircleIcon className="h-5 w-5 text-emerald-600" aria-hidden />
            已加入最愛
          </p>

          <button
            type="button"
            onClick={closePanel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-700"
            aria-label="關閉浮層"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-[84px_minmax(0,1fr)] gap-3">
          <div className="relative h-[84px] overflow-hidden bg-zinc-100">
            <Image
              src={lastOpenedItem.imageSrc}
              alt={lastOpenedItem.name}
              fill
              sizes="84px"
              className="object-cover"
            />
          </div>

          <div className="space-y-0.5">
            <p className="text-base font-medium text-zinc-900">{lastOpenedItem.name}</p>
            <p className="text-sm text-zinc-500">{lastOpenedItem.subtitle}</p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-base">
              <p className="font-medium text-zinc-900">{formatPrice(lastOpenedItem.price)}</p>
              {lastOpenedItem.compareAtPrice ? (
                <p className="text-zinc-500 line-through">{formatPrice(lastOpenedItem.compareAtPrice)}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href="/favorites"
            onClick={closePanel}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white"
          >
            檢視最愛
          </Link>
        </div>
      </section>
    </>
  );
}
