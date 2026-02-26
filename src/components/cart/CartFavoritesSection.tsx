"use client";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { CartFavoriteSizePickerDialog } from "@/components/cart/CartFavoriteSizePickerDialog";
import { formatPrice } from "@/lib/cart/mock-cart";
import { useCartFavoritesController } from "@/hooks/cart/useCartFavoritesController";

export function CartFavoritesSection() {
  const {
    items,
    hasItems,
    pickerItem,
    pickerSizes,
    pickerError,
    selectedSizes,
    onAddToCart,
    openSizePicker,
    closeSizePicker,
    onSelectPickerSize,
    confirmAddToCartFromPicker,
    resolveSizeLabel,
  } = useCartFavoritesController();
  const previewItems = items.slice(0, 2);

  return (
    <>
      <section className="space-y-5 border-t border-zinc-200 pt-7">
        <h2 className="text-4xl font-semibold text-zinc-900 sm:text-2xl">最愛</h2>

        {hasItems ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {previewItems.map((item) => {
              const selectedSize = resolveSizeLabel(item);

              return (
                <article key={item.id} className="grid grid-cols-[132px_minmax(0,1fr)] gap-3">
                  <Link href={`/products/${item.slug}`} className="relative block h-[132px] overflow-hidden bg-zinc-100">
                    <Image src={item.imageSrc} alt={item.name} fill sizes="132px" className="object-cover" />
                  </Link>

                  <div className="flex h-full flex-col">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.1">
                          <Link
                            href={`/products/${item.slug}`}
                            className="block text-base font-medium leading-snug text-zinc-900 hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-zinc-500">{item.subtitle}</p>
                        </div>
                        <p className="shrink-0 text-sm font-medium text-zinc-900">{formatPrice(item.price)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => openSizePicker(item.id)}
                        className="inline-flex text-sm text-zinc-700 hover:text-zinc-900"
                      >
                        {selectedSize ? `尺寸 ${selectedSize}` : "選取尺寸"}
                      </button>
                    </div>

                    <div className="mt-auto pt-1">
                      {item.isInCart ? (
                        <p className="inline-flex h-10 items-center gap-1 rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-700">
                          <CheckCircleIcon className="h-4 w-4 text-emerald-600" aria-hidden />
                          已加入
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddToCart(item)}
                          className="inline-flex h-10 items-center rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-900"
                        >
                          加入購物車
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-zinc-700">你的最愛中未儲存任何品項。</p>
        )}

        <div className="border-t border-zinc-200 pt-4">
          <Link href="/favorites" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
            檢視更多最愛
          </Link>
        </div>
      </section>

      <CartFavoriteSizePickerDialog
        open={Boolean(pickerItem)}
        item={pickerItem}
        sizes={pickerSizes}
        selectedSize={pickerItem ? (selectedSizes[pickerItem.id] ?? pickerItem.defaultSize ?? null) : null}
        errorMessage={pickerError}
        onClose={closeSizePicker}
        onSelectSize={onSelectPickerSize}
        onConfirm={confirmAddToCartFromPicker}
      />
    </>
  );
}
