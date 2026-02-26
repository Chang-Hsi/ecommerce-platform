"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import type { ProductSizeOption } from "@/content/product-detail";
import { formatPrice } from "@/lib/cart/mock-cart";
import type { CartFavoriteViewItem } from "@/hooks/cart/useCartFavoritesController";

type CartFavoriteSizePickerDialogProps = {
  open: boolean;
  item: CartFavoriteViewItem | null;
  sizes: ProductSizeOption[];
  selectedSize: string | null;
  errorMessage: string | null;
  onClose: () => void;
  onSelectSize: (sizeValue: string) => void;
  onConfirm: () => void;
};

export function CartFavoriteSizePickerDialog({
  open,
  item,
  sizes,
  selectedSize,
  errorMessage,
  onClose,
  onSelectSize,
  onConfirm,
}: Readonly<CartFavoriteSizePickerDialogProps>) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !item) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-black/45"
        aria-label="關閉尺寸選擇視窗背景"
      />

      <section
        className="fade-down-in fixed left-1/2 top-1/2 z-[80] w-[min(94vw,920px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="選擇尺寸"
      >
        <div className="grid md:grid-cols-[44%_minmax(0,1fr)]">
          <div className="relative bg-zinc-100">
            <div className="relative aspect-square w-full">
              <Image src={item.imageSrc} alt={item.name} fill sizes="(max-width: 768px) 94vw, 420px" className="object-cover" />
            </div>
          </div>

          <div className="space-y-4 p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-zinc-900">{item.name}</h3>
                <p className="text-base text-zinc-600">{item.subtitle}</p>
                <p className="text-base font-medium text-zinc-900">{formatPrice(item.price)}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-700"
                aria-label="關閉尺寸選擇"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-base font-medium text-zinc-900">選擇尺寸</p>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => {
                  const isSelected = selectedSize === size.value;
                  return (
                    <button
                      key={size.value}
                      type="button"
                      disabled={!size.inStock}
                      onClick={() => onSelectSize(size.value)}
                      className={`h-9 rounded border text-sm ${
                        !size.inStock
                          ? "cursor-not-allowed border-zinc-200 text-zinc-300 line-through"
                          : isSelected
                            ? "border-zinc-900 text-zinc-900"
                            : "border-zinc-300 text-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      {size.value}
                    </button>
                  );
                })}
              </div>
              {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-zinc-200 pt-4">
              <Link href={`/products/${item.slug}`} className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                檢視完整產品資訊
              </Link>
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex h-10 items-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white"
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
