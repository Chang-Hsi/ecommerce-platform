"use client";

import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { formatPrice } from "@/lib/cart/mock-cart";
import { useMiniCartController } from "@/hooks/cart/useMiniCartController";

export function MiniCartPanel() {
  const pathname = usePathname();
  const { isOpen, itemCount, lastAddedItem, closeMiniCart } = useMiniCartController();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname && isOpen) {
      closeMiniCart();
    }

    previousPathnameRef.current = pathname;
  }, [pathname, isOpen, closeMiniCart]);

  if (!isOpen || !lastAddedItem) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[70] bg-black/45"
        onClick={closeMiniCart}
        aria-label="關閉已加入購物車浮層"
      />

      <section
        className="fade-down-in fixed right-4 top-20 z-[80] w-[min(92vw,360px)] rounded-3xl bg-white p-4 shadow-2xl sm:right-6"
        role="dialog"
        aria-modal="true"
        aria-label="已加入購物車"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-base font-semibold text-zinc-900">
            <CheckCircleIcon className="h-5 w-5 text-emerald-600" aria-hidden />
            已加入購物車
          </p>

          <button
            type="button"
            onClick={closeMiniCart}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-700"
            aria-label="關閉浮層"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-[84px_minmax(0,1fr)] gap-3">
          <div className="relative h-[84px] overflow-hidden bg-zinc-100">
            <Image src={lastAddedItem.imageSrc} alt={lastAddedItem.name} fill sizes="84px" className="object-cover" />
          </div>

          <div className="space-y-0.5">
            <p className="text-base font-medium text-zinc-900">{lastAddedItem.name}</p>
            <p className="text-sm text-zinc-500">{lastAddedItem.subtitle}</p>
            <p className="text-sm text-zinc-500">尺寸 {lastAddedItem.sizeLabel}</p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-base">
              <p className="font-medium text-zinc-900">{formatPrice(lastAddedItem.unitPrice)}</p>
              {lastAddedItem.compareAtPrice ? (
                <p className="text-zinc-500 line-through">{formatPrice(lastAddedItem.compareAtPrice)}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/cart"
            onClick={closeMiniCart}
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 text-sm font-semibold text-zinc-900"
          >
            查看購物車 ({itemCount})
          </Link>
          <Link
            href="/checkout"
            onClick={closeMiniCart}
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white"
          >
            結帳
          </Link>
        </div>
      </section>
    </>
  );
}
