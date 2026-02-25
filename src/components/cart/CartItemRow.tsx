import { ClockIcon, HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/cart/mock-cart";
import type { MockCartItem } from "@/lib/cart/types";
import { QuantityStepper } from "@/components/cart/QuantityStepper";

type CartItemRowProps = {
  item: MockCartItem;
  lowStockMessage: string;
  onIncreaseQty: () => void;
  onDecreaseQty: () => void;
  onRemove: () => void;
  onToggleFavorite: () => void;
};

export function CartItemRow({
  item,
  lowStockMessage,
  onIncreaseQty,
  onDecreaseQty,
  onRemove,
  onToggleFavorite,
}: Readonly<CartItemRowProps>) {
  return (
    <article className="border-b border-zinc-200 pb-7">
      <div className="grid gap-3 sm:grid-cols-[138px_minmax(0,1fr)_150px] sm:gap-4">
        <Link href={`/products/${item.slug}`} className="relative block h-[96px] overflow-hidden bg-zinc-100 sm:h-[112px]">
          <Image src={item.imageSrc} alt={item.name} fill sizes="(max-width: 639px) 100vw, 138px" className="object-cover" />
        </Link>

        <div className="space-y-0.5 text-zinc-700">
          <Link href={`/products/${item.slug}`} className="block text-xl font-medium leading-snug text-zinc-900 hover:underline">
            {item.name}
          </Link>
          <p className="text-base text-zinc-500">{item.subtitle}</p>
          <p className="text-base">{item.colorLabel}</p>
          <p className="text-base">尺寸 {item.sizeLabel}</p>
        </div>

        <div className="space-y-0.5 text-left sm:text-right">
          {item.compareAtPrice ? (
            <p className="text-xl text-zinc-500 line-through">{formatPrice(item.compareAtPrice * item.qty)}</p>
          ) : null}
          <p className="text-2xl font-medium text-zinc-900">{formatPrice(item.unitPrice * item.qty)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-700"
          aria-label="刪除商品"
        >
          <TrashIcon className="h-5 w-5" aria-hidden />
        </button>

        <QuantityStepper qty={item.qty} onDecrease={onDecreaseQty} onIncrease={onIncreaseQty} />

        <button
          type="button"
          onClick={onToggleFavorite}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-700"
          aria-label={item.isFavorite ? "取消最愛" : "加入最愛"}
          aria-pressed={item.isFavorite}
        >
          <HeartIcon className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {item.lowStock ? (
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-amber-700">
          <ClockIcon className="h-4 w-4" aria-hidden />
          {lowStockMessage}
        </p>
      ) : null}
    </article>
  );
}
