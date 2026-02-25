"use client";

import Link from "next/link";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummaryPanel } from "@/components/cart/CartSummaryPanel";
import { useCartController } from "@/hooks/cart/useCartController";

export function CartPage() {
  const { items, summary, messages, onIncreaseQty, onDecreaseQty, onRemove, onToggleFavorite } = useCartController();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
        <section className="space-y-6">
          <h1 className="text-4xl font-semibold text-zinc-900 sm:text-2xl">購物車</h1>

          {items.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <p className="text-base text-zinc-700">{messages.emptyCart}</p>
              <Link href="/products" className="mt-3 inline-flex text-base font-medium text-zinc-900 underline">
                繼續選購
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  lowStockMessage={messages.lowStock}
                  onIncreaseQty={() => onIncreaseQty(item.id)}
                  onDecreaseQty={() => onDecreaseQty(item.id)}
                  onRemove={() => onRemove(item.id)}
                  onToggleFavorite={() => onToggleFavorite(item.id)}
                />
              ))}
            </div>
          )}

          <section>
            <h2 className="text-4xl font-semibold text-zinc-900 sm:text-2xl">最愛</h2>
            <p className="mt-2 text-base text-zinc-700">{messages.favoritesEmpty}</p>
          </section>
        </section>

        <CartSummaryPanel summary={summary} />
      </div>
    </div>
  );
}
